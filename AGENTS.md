# AI Agent Guidelines

This document provides context for AI coding assistants working on this codebase.

## Project Overview

This is a NestJS Turborepo monorepo template with:
- **@repo/api** - NestJS API application with Fastify
- **@repo/common** - Shared DTOs, PrismaModule
- **@repo/database** - Prisma ORM schema and migrations
- **@repo/typescript-config** - Shared TypeScript configuration
- **@repo/eslint-config** - Shared ESLint configuration
- **@repo/prettier-config** - Shared Prettier configuration

## Tech Stack

- **Runtime**: Node.js 20+
- **Package Manager**: pnpm 10+ with workspaces
- **Build System**: Turborepo
- **Backend**: NestJS 11 with Fastify adapter
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript 5

## Key Conventions

### Code Style

- Use TypeScript strict mode
- Prefer `interface` over `type` for object shapes
- Use class-validator decorators for DTOs
- Use dependency injection via NestJS constructor injection

### File Naming

- `module.<name>.ts` - NestJS modules
- `service.<name>.ts` - NestJS services
- `controller.<name>.ts` - NestJS controllers
- `dto.<name>.ts` - Data Transfer Objects

### Path Aliases

In `@repo/api`:
- `#/*` maps to `./src/*`

### Package References

- Use `@repo/common` for shared DTOs and PrismaService
- Use `@repo/database` for Prisma types

## Example Modules

### User Module (CRUD Example)
Located at `apps/api/src/module/user/`:
- `controller.user.ts` - REST endpoints
- `service.user.ts` - Business logic
- `module.user.ts` - Module definition

### Auth Module
Located at `apps/api/src/module/auth/`:
- Email-based authentication
- JWT tokens in httpOnly cookies

## Common Tasks

### Adding a New API Module

```bash
# 1. Create module directory
mkdir -p apps/api/src/module/my-feature

# 2. Create files
# - module.my-feature.ts
# - service.my-feature.ts
# - controller.my-feature.ts

# 3. Register in app.module.ts
```

### Adding a New DTO

```bash
# 1. Create in packages/common/src/dto/dto.my-feature.ts
# 2. Export from packages/common/src/dto/index.ts
# 3. Rebuild: pnpm build:common
```

### Database Changes

```bash
# 1. Edit schema in packages/database/prisma/models/
# 2. Generate client: pnpm --filter @repo/database db:generate
# 3. Create migration: pnpm --filter @repo/database db:migrate
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | API server port (default: 3001) |
| `COOKIE_SECRET` | Secret for cookie signing |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRES_IN` | JWT expiration (e.g., "7d") |
| `DB_URL` | PostgreSQL connection string |

## Development Commands

```bash
pnpm dev:api        # Start API in dev mode
pnpm build          # Build all packages
pnpm build:deps     # Build common and database
pnpm lint           # Run ESLint
pnpm docker:dev:up  # Start PostgreSQL
pnpm init           # Full initialization
```
