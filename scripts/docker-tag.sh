#!/bin/bash
# Docker Semantic Version Tagging
# Usage: ./scripts/docker-tag.sh <image-name>

set -euo pipefail

IMAGE_NAME="${1:-nordhjem-backend}"

# Get latest git tag or default to 0.0.0
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
VERSION="${LATEST_TAG#v}"

# Parse semver
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)
PATCH=$(echo "$VERSION" | cut -d. -f3)

# Get short SHA
SHORT_SHA=$(git rev-parse --short HEAD)

# Build date
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "VERSION=$VERSION"
echo "MAJOR=$MAJOR"
echo "MINOR=$MINOR"
echo "PATCH=$PATCH"
echo "SHORT_SHA=$SHORT_SHA"
echo "BUILD_DATE=$BUILD_DATE"

# Output for GitHub Actions
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "version=$VERSION" >> "$GITHUB_OUTPUT"
  echo "major=$MAJOR" >> "$GITHUB_OUTPUT"
  echo "minor=$MINOR" >> "$GITHUB_OUTPUT"
  echo "patch=$PATCH" >> "$GITHUB_OUTPUT"
  echo "short_sha=$SHORT_SHA" >> "$GITHUB_OUTPUT"
  echo "build_date=$BUILD_DATE" >> "$GITHUB_OUTPUT"
  echo "tags=$IMAGE_NAME:v$VERSION,$IMAGE_NAME:v$MAJOR.$MINOR,$IMAGE_NAME:v$MAJOR,$IMAGE_NAME:latest,$IMAGE_NAME:$SHORT_SHA" >> "$GITHUB_OUTPUT"
fi
