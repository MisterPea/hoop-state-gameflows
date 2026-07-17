#!/usr/bin/env bash
# Manual deploy pipeline: clean -> build (prune runs via postbuild) -> e2e -> s3 sync -> cloudfront invalidate.
# Run from anywhere; always operates on the repo root.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

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

echo "==> Uploading out/ to s3://$S3_BUCKET"
aws s3 sync out/ "s3://$S3_BUCKET" --delete "${AWS_ARGS[@]}"

echo "==> Invalidating CloudFront distribution $CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  "${AWS_ARGS[@]}"

echo
echo "Deploy complete: $GIT_REF -> s3://$S3_BUCKET (CloudFront invalidated)."
