# AGENTS.md — NordHjem Backend

## Project Overview
NordHjem is a Scandinavian furniture e-commerce platform.
This is the backend, powered by **Medusa.js v2** (2.13.x) + **PostgreSQL** + **Docker**.

## Tech Stack
- Runtime: Node.js 20+
- Framework: Medusa.js v2 (not v1 — API and module patterns are different)
- ORM: MikroORM (via @mikro-orm/postgresql)
- Language: TypeScript 5.6+ (strictNullChecks enabled)
- Containerization: Docker (single Dockerfile, docker-compose for local dev)
- Process Manager: Docker (production), Node directly (development)

## Project Structure
```
src/
├── api/          # Custom API routes (REST endpoints)
├── jobs/         # Background scheduled jobs
├── links/        # Module link definitions
├── modules/      # Custom Medusa modules
├── scripts/      # One-off scripts (seed, migrations)
├── subscribers/  # Event subscribers
└── workflows/    # Medusa workflows
```

## Key Conventions
- All source code in `src/` uses TypeScript
- API routes follow Medusa v2 conventions: `src/api/store/...` for storefront, `src/api/admin/...` for admin
- Use Medusa's built-in dependency injection — do NOT use raw `new` for services
- Database migrations are handled by `npx medusa db:migrate`
- Environment variables are defined in `.env` (see `.env.example`)

## Branch Strategy
- `develop` → `staging` → `main`
- All changes via feature branches → PR to `develop`
- Branch naming: `codex/*` for AI-generated, `feature/*` for manual
- PR titles must use Conventional Commits (feat/fix/refactor/chore)

## CI/CD
- CI: Docker build + lint + type-check on PR/push to develop/staging/main
- CD: develop auto-deploys to test → staging auto-deploys → main needs approval for production
- Required checks: `build` + `ai-review-gate`

## Environments
| Env | Port | Container | Database |
|-----|------|-----------|----------|
| Test | 9001 | nordhjem_medusa_test | nordhjem_test |
| Staging | 9002 | nordhjem_medusa_staging | nordhjem_staging |
| Production | 9000 | nordhjem_medusa | nordhjem_production |

## Do NOT
- Hardcode environment-specific values (use env vars)
- Modify `.github/workflows/` without explicit instruction
- Change database schema without a migration
- Use `npm install` in CI (use `npm ci`)
- Commit `.env` files
