#!/usr/bin/env bash
# Manual deploy pipeline: clean -> build (prune runs via postbuild) -> e2e -> s3 sync -> cloudfront invalidate.
# Run from anywhere; always operates on the repo root.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# better-sqlite3 is a native module (ABI-specific per Node major). The build
# reads the DB via generateStaticParams, and `npm run build` has no prebuild
# version guard (only predev/preinstall do) — so without this, a build run
# under the wrong Node fails with a NODE_MODULE_VERSION mismatch instead of
# a clear error. Reads the version from .nvmrc.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
  echo "nvm not found at $NVM_DIR/nvm.sh — install nvm or adjust NVM_DIR." >&2
  exit 1
fi
# shellcheck disable=SC1091
source "$NVM_DIR/nvm.sh"
nvm use

SKIP_CONFIRM=false
for arg in "$@"; do
  case "$arg" in
    -y|--yes) SKIP_CONFIRM=true ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Usage: $0 [-y|--yes]" >&2
      exit 1
      ;;
  esac
done

ENV_FILE=".env.deploy"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE. Copy .env.deploy.example to $ENV_FILE and fill in S3_BUCKET / CLOUDFRONT_DISTRIBUTION_ID." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"

: "${S3_BUCKET:?Set S3_BUCKET in $ENV_FILE}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?Set CLOUDFRONT_DISTRIBUTION_ID in $ENV_FILE}"

AWS_ARGS=()
[[ -n "${AWS_PROFILE:-}" ]] && AWS_ARGS+=(--profile "$AWS_PROFILE")
[[ -n "${AWS_REGION:-}" ]] && AWS_ARGS+=(--region "$AWS_REGION")

echo "==> Checking AWS credentials"
aws sts get-caller-identity "${AWS_ARGS[@]}" >/dev/null

GIT_REF="$(git rev-parse --abbrev-ref HEAD)@$(git rev-parse --short HEAD)"
echo
echo "About to deploy:"
echo "  branch/commit : $GIT_REF"
echo "  s3 bucket     : $S3_BUCKET"
echo "  cloudfront    : $CLOUDFRONT_DISTRIBUTION_ID"
echo
if [[ "$SKIP_CONFIRM" != true ]]; then
  read -r -p "Proceed? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

echo "==> Cleaning out/"
rm -rf out

echo "==> Build (postbuild hook runs prune-static-export.mjs)"
npm run build

echo "==> E2E (playwright, against the just-built out/)"
CI=true npx playwright test

echo "==> Uploading immutable static assets to s3://$S3_BUCKET/_next/static/"
# Chunk filenames are content-hashed, so every build's out/_next/static is a
# disjoint set of new filenames — a --delete sync here would remove the prior
# build's chunks the instant the new ones land. A tab still on the old build
# (open pre-deploy, or served a stale edge copy mid CloudFront-invalidation)
# then 404s on its next chunk request -> ChunkLoadError / forced reload.
# Content-hashed assets are immutable and cheap to keep around, so upload-only
# here (no --delete) and let old chunks accumulate; prune them separately on
# a delay if the bucket needs tidying.
# --cache-control: filenames are content-hashed, so a year-long immutable
# cache is safe — a code change always ships under a new filename. Without
# this, S3 sends no Cache-Control header and browsers fall back to weak
# heuristic caching (Lighthouse "efficient cache lifetimes").
aws s3 sync out/_next/static/ "s3://$S3_BUCKET/_next/static/" --size-only \
  --cache-control "public, max-age=31536000, immutable" "${AWS_ARGS[@]}"

echo "==> Uploading out/ to s3://$S3_BUCKET (pruning stale pages)"
# --size-only: every build gives every output file a fresh mtime, so plain
# `s3 sync` (size+mtime) would re-PUT the whole site on every deploy even
# when content is unchanged. Compare by size instead so untouched pages are
# skipped. Tradeoff: a same-size content change (rare) won't be re-uploaded.
# --exclude _next/static: already synced above without --delete; excluding it
# here keeps this pass's --delete from removing older builds' chunks while
# still pruning stale HTML/other pages that no longer exist in out/.
# --cache-control: these filenames are NOT hashed (HTML pages, favicon,
# manifest, fonts in public/), so a long max-age would stick a stale page/asset
# in front of returning visitors after a deploy. must-revalidate lets
# CloudFront/browser cache the bytes but forces a conditional check
# (304 on no change) before ever serving a cached copy as fresh.
aws s3 sync out/ "s3://$S3_BUCKET" --delete --size-only --exclude "_next/static/*" \
  --cache-control "public, max-age=0, must-revalidate" "${AWS_ARGS[@]}"

echo "==> Invalidating CloudFront distribution $CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  "${AWS_ARGS[@]}"

echo
echo "Deploy complete: $GIT_REF -> s3://$S3_BUCKET (CloudFront invalidated)."
