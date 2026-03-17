# Docker Tagging Strategy

## Overview

To improve deployment traceability and rollback safety, Docker images pushed to GHCR include semantic version tags in addition to branch and commit tags.

## Tag Rules

The CI workflow (`.github/workflows/ci.yml`) now publishes:

- `vX.Y.Z` (`type=semver,pattern={{version}}`) when the workflow runs on a matching Git tag.
- `vX.Y` (`type=semver,pattern={{major}}.{{minor}}`) for minor-line pinning.
- `<sha>` (`type=sha,prefix=`) for immutable commit-level traceability.
- `<branch>` (`type=ref,event=branch`) for branch environments.
- `latest` only on the default branch (`type=raw,value=latest,enable={{is_default_branch}}`).

## Operational Notes

- Production CD continues to pull `latest` to preserve current deployment behavior.
- Rollback can use a semantic version tag directly (`ghcr.io/<repo>:vX.Y.Z`).
- Release process should create annotated Git tags in the format `v*.*.*` so semver tags are emitted.
