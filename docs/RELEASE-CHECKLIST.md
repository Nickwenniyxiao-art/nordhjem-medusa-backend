# RELEASE-CHECKLIST

This checklist standardizes the release lifecycle for NordHjem Backend and aligns with the current CD flow:

`develop → staging → main → production`

## 1. Pre-Release

- [ ] All CI checks passed (lint, typecheck, build, tests)
- [ ] E2E tests passed in the staging environment
- [ ] Security scans show no high-severity vulnerabilities (Gitleaks, Semgrep, Trivy)
- [ ] Database migrations validated in staging
- [ ] Performance benchmarks show no regression
- [ ] CHANGELOG updated (handled automatically by semantic-release)
- [ ] Related issues linked to the PR

## 2. Release Process

- [ ] Code merged into `develop` branch
- [ ] CD Test deployment succeeded → automatically promoted to `staging`
- [ ] CD Staging deployment succeeded → automatically promoted to `main`
- [ ] CD Production triggered → waiting for approval
- [ ] Owner approved Production deployment
- [ ] Production deployment completed

## 3. Post-Release

- [ ] Production health checks passed
- [ ] Core API endpoints responding normally
- [ ] Monitoring metrics show no anomalies
- [ ] No newly introduced error logs
- [ ] Status page updated (if applicable)

## 4. Rollback

### Rollback Conditions

- Production health check fails after release
- Critical API endpoints are unavailable or unstable
- Error rate, latency, or resource usage exceeds acceptable thresholds
- Security or data integrity risk detected after deployment

### Rollback Steps (Redeploy Previous Version)

1. Identify the last known stable release artifact/version.
2. Trigger rollback deployment using the previous stable image/tag.
3. Confirm rollback deployment completion in CD pipeline.
4. Temporarily freeze further deployments until root cause is identified.

### Post-Rollback Validation Checklist

- [ ] Health checks passed after rollback
- [ ] Core API endpoints restored and stable
- [ ] Error rate returned to baseline
- [ ] Monitoring and alerting status normal
- [ ] Incident notes recorded and shared

### Database Rollback Notes

- Prefer backward-compatible migrations to avoid destructive rollback.
- If a migration is irreversible, use a forward-fix migration instead of direct rollback.
- Validate schema and critical data consistency immediately after rollback.
- Keep a tested backup/restore plan for production data before release.

## 5. Hotfix

### Hotfix Branch Strategy

- Create hotfix branch from `main`:
  - `hotfix/<issue-number>-<short-description>`
- Keep scope minimal and limited to production incident resolution.

### Fast-Track Approval Flow

- Use expedited review by Owner/CTO.
- Ensure mandatory CI checks still pass before production deployment.
- Document risk acceptance if any checks are conditionally bypassed.

### Hotfix Deployment Steps

1. Branch from `main` and implement minimal fix.
2. Open PR with clear incident context and impact.
3. Run CI and required verification.
4. Deploy with priority through CD pipeline.
5. Confirm production recovery with post-release checks.

### Post-Hotfix Documentation

- Update incident record/postmortem.
- Backport or forward-merge hotfix changes into regular development branches if needed.
- Add follow-up tasks to prevent recurrence.
- Ensure issue/PR traceability is complete.
