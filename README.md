# NestJS Turborepo Prisma Template

A production-ready monorepo template for building scalable NestJS applications with Prisma ORM and Turborepo.

## Tech Stack

- **Runtime**: Node.js 20+
- **Package Manager**: pnpm 10+
- **Build System**: Turborepo
- **Backend Framework**: NestJS 11
- **HTTP Server**: Fastify
- **Database**: PostgreSQL + Prisma ORM
- **Testing**: Vitest (E2E)
- **Language**: TypeScript 5

## Project Structure

```
├── apps/
│   └── api/                    # NestJS API application
│       ├── src/
│       │   ├── module/
│       │   │   ├── auth/       # Authentication (email code + JWT)
│       │   │   ├── user/       # Example CRUD module
│       │   │   ├── jwt/        # JWT service
│       │   │   └── smtp/       # Email service
│       │   ├── decorator/      # Custom decorators
│       │   ├── filter/         # Exception filters
│       │   ├── guard/          # Auth guards
│       │   ├── interceptor/    # Response interceptors
│       │   └── middleware/     # Request middleware
│       └── test/               # E2E tests (Vitest)
│           ├── e2e/            # E2E test files
│           ├── utils/          # Test utilities (app builder)
│           ├── vitest.e2e-config.ts
│           └── vitest.e2e-setup.ts
├── packages/
│   ├── common/                 # Shared DTOs, PrismaModule
│   ├── database/               # Prisma schema & migrations
│   ├── eslint-config/
│   ├── prettier-config/
│   └── typescript-config/
├── env/                        # Centralized environment files
│   ├── .env.example            # Template for all env vars
│   ├── .env.dev                # Development environment
│   └── .env.e2e                # E2E testing environment
├── docker-compose.yml          # PostgreSQL for production
├── docker-compose.dev.yml      # PostgreSQL for development
├── docker-compose.e2e.yml      # PostgreSQL for E2E testing
└── turbo.json                  # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10
- Docker (for PostgreSQL & Mailhog)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nestjs-turborepo-prisma-template
```

2. Install dependencies:

```bash
pnpm install
```

3. Start PostgreSQL:

```bash
pnpm docker:dev:up
```

4. Initialize the database and build dependencies:

```bash
pnpm init
```

5. Start the development server:

```bash
pnpm dev:api
```

The API will be available at `http://localhost:3001`.

## Environment Variables

Environment files are centralized in the `env/` directory:

| File              | Purpose                           | Tracked |
| ----------------- | --------------------------------- | ------- |
| `env/.env.example`| Template with all variables       | Yes     |
| `env/.env.dev`    | Development environment           | Yes     |
| `env/.env.e2e`    | E2E testing environment           | Yes     |
| `env/.env.prod`   | Production environment            | No      |

Each environment uses different ports to avoid conflicts:

| Service    | Dev   | E2E   |
| ---------- | ----- | ----- |
| PostgreSQL | 5434  | 5435  |
| Mailhog SMTP | 1027 | 1028 |
| Mailhog UI | 8027 | 8028  |
| PgAdmin    | 5052  | 5053  |

Scripts automatically load the correct env file via `dotenv-cli`:
- `pnpm dev:api` loads `env/.env.dev`
- `pnpm e2e:api` loads `env/.env.e2e` (via vitest setup)
- Prisma commands use `dotenv -e ../../env/.env.[env]`

## Available Scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev:api`         | Start API in development mode                           |
| `pnpm build`           | Build all packages                                      |
| `pnpm build:deps`      | Build @repo/common and @repo/database                   |
| `pnpm lint`            | Run ESLint across all packages                          |
| `pnpm format`          | Format code with Prettier                               |
| `pnpm docker:dev:up`   | Start Docker services (dev)                             |
| `pnpm docker:dev:down` | Stop Docker services (dev)                              |
| `pnpm docker:e2e:up`   | Start Docker services (E2E)                             |
| `pnpm docker:e2e:down` | Stop Docker services (E2E)                              |
| `pnpm e2e:api`         | Run E2E tests                                           |
| `pnpm init`            | Install, generate Prisma, deploy migrations, build deps |
| `pnpm init:db:e2e`     | Initialize E2E database                                 |

## E2E Testing

E2E tests use Vitest with SWC for fast TypeScript compilation.

### Setup

1. Start E2E Docker services:

```bash
pnpm docker:e2e:up
```

2. Initialize the E2E database:

```bash
pnpm init:db:e2e
```

3. Run E2E tests:

```bash
pnpm e2e:api
```

### Test Structure

```
apps/api/test/
├── e2e/
│   └── e2e.health-test.ts    # Infrastructure health checks
├── utils/
│   └── utils.app-builder.ts  # NestJS test app builder
├── vitest.e2e-config.ts       # Vitest configuration
└── vitest.e2e-setup.ts        # Environment setup
```

### Writing Tests

- Place E2E test files in `apps/api/test/e2e/` with the naming pattern `e2e.*.ts`
- Use `buildE2eApp()` from `utils/utils.app-builder.ts` to bootstrap the test app
- Tests run sequentially (no parallelism) to avoid database conflicts

## Example Modules

### User Module (`/users`)

A complete CRUD example:

- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

### Auth Module (`/auth`)

Email-based authentication:

- `POST /auth/request-code` - Request verification code
- `POST /auth/confirm-code` - Confirm code and get JWT
- `POST /auth/refresh` - Refresh JWT token

## API Documentation

When running in development, API documentation is available at:

- Scalar API Reference: `http://localhost:3001/reference`

## License

MIT
