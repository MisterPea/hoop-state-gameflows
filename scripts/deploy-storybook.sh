#!/usr/bin/env bash
# Storybook deploy pipeline: clean -> build-storybook -> s3 sync.
# Separate bucket from the main site (STORYBOOK_S3_BUCKET), plain S3
# static-website hosting, no CloudFront. Run from anywhere; always
# operates on the repo root.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

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
  echo "Missing $ENV_FILE. Copy .env.deploy.example to $ENV_FILE and fill in STORYBOOK_S3_BUCKET." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$ENV_FILE"

: "${STORYBOOK_S3_BUCKET:?Set STORYBOOK_S3_BUCKET in $ENV_FILE}"

AWS_ARGS=()
[[ -n "${AWS_PROFILE:-}" ]] && AWS_ARGS+=(--profile "$AWS_PROFILE")
[[ -n "${AWS_REGION:-}" ]] && AWS_ARGS+=(--region "$AWS_REGION")

echo "==> Checking AWS credentials"
aws sts get-caller-identity "${AWS_ARGS[@]}" >/dev/null

GIT_REF="$(git rev-parse --abbrev-ref HEAD)@$(git rev-parse --short HEAD)"
echo
echo "About to deploy:"
echo "  branch/commit : $GIT_REF"
echo "  s3 bucket     : $STORYBOOK_S3_BUCKET"
echo
if [[ "$SKIP_CONFIRM" != true ]]; then
  read -r -p "Proceed? [y/N] " reply
  [[ "$reply" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 1; }
fi

echo "==> Cleaning storybook-static/"
rm -rf storybook-static

echo "==> Building storybook"
npm run build-storybook

echo "==> Uploading storybook-static/ to s3://$STORYBOOK_S3_BUCKET"
aws s3 sync storybook-static/ "s3://$STORYBOOK_S3_BUCKET" --delete "${AWS_ARGS[@]}"

echo
echo "Deploy complete: $GIT_REF -> s3://$STORYBOOK_S3_BUCKET"
