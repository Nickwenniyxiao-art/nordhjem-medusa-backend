# Database Backup Strategy

## Overview

This repository includes an automated GitHub Actions workflow for PostgreSQL backups.
The workflow creates compressed SQL dump files daily and stores them as GitHub
Actions artifacts for short-term retention.

- Workflow file: `.github/workflows/db-backup.yml`
- Schedule: Daily at **02:00 UTC**
- Trigger: `schedule` + manual `workflow_dispatch`
- Artifact retention: **30 days**

## Backup Strategy

### 1) Daily Automated Backups

- Job runs once per day via cron: `0 2 * * *`
- Uses `pg_dump` against `DATABASE_URL`
- Compresses output as `backup-YYYY-MM-DD-HHMMSS.sql.gz`
- Validates backup file size (must be >= 100 bytes)

### 2) Offsite Storage Approach

Current implementation stores backups in GitHub-hosted artifact storage (offsite
relative to runtime infrastructure).

Recommended long-term extension:

- Add object storage replication (for example S3-compatible bucket)
- Enable encryption at rest and lifecycle policies
- Keep at least 30 days hot backups + monthly long-term snapshots

### 3) Retention Policy

- Current: GitHub artifact `retention-days: 30`
- Suggested production policy:
  - Daily backups: 30 days
  - Weekly backups: 12 weeks
  - Monthly backups: 12 months

## Restore Procedure

> Run restore in a controlled environment first, then execute in production.

1. Download backup artifact from Actions run.
2. Decompress backup:

```bash
gunzip backup-<timestamp>.sql.gz
```

3. Restore into target database:

```bash
psql "<TARGET_DATABASE_URL>" < backup-<timestamp>.sql
```

4. Validate restored data:
   - Verify schema exists
   - Verify critical tables row counts
   - Run smoke queries / health checks

## Manual Trigger

You can trigger backup manually from GitHub Actions UI:

1. Open **Actions** → **Database Backup** workflow.
2. Click **Run workflow**.
3. (Optional) Fill `reason` input for audit context.
4. Run and download artifact after completion.

## Secret Configuration Guide

Configure repository secret:

- Name: `DATABASE_URL`
- Value format example:

```text
postgres://<user>:<password>@<host>:<port>/<database>
```

Recommendations:

- Use least-privilege DB account with read permissions required by `pg_dump`
- Rotate credentials periodically
- Restrict repository admin access and secret visibility

## Validation Checklist

- [ ] Workflow exists at `.github/workflows/db-backup.yml`
- [ ] `DATABASE_URL` secret is configured
- [ ] Scheduled run succeeds
- [ ] Artifact file can be downloaded and restored
- [ ] Restore drill is tested regularly
