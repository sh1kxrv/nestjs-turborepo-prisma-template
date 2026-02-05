# NestJS Turborepo Prisma Template

A production-ready monorepo template for building scalable NestJS applications with Prisma ORM and Turborepo.

## Tech Stack

- **Runtime**: Node.js 20+
- **Package Manager**: pnpm 10+
- **Build System**: Turborepo
- **Backend Framework**: NestJS 11
- **HTTP Server**: Fastify
- **Database**: PostgreSQL + Prisma ORM
- **Language**: TypeScript 5

## Project Structure

```
├── apps/
│   └── api/                    # NestJS API application
│       └── src/
│           ├── module/
│           │   ├── auth/       # Authentication (email code + JWT)
│           │   ├── user/       # Example CRUD module
│           │   ├── jwt/        # JWT service
│           │   └── smtp/       # Email service
│           ├── decorator/      # Custom decorators
│           ├── filter/         # Exception filters
│           ├── guard/          # Auth guards
│           ├── interceptor/    # Response interceptors
│           └── middleware/     # Request middleware
├── packages/
│   ├── common/                 # Shared DTOs, PrismaModule
│   ├── database/               # Prisma schema & migrations
│   ├── eslint-config/
│   ├── prettier-config/
│   └── typescript-config/
├── docker-compose.yml          # PostgreSQL for production
├── docker-compose.dev.yml      # PostgreSQL for development
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

## Available Scripts

| Script                 | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev:api`         | Start API in development mode                           |
| `pnpm build`           | Build all packages                                      |
| `pnpm build:deps`      | Build @repo/common and @repo/database                   |
| `pnpm lint`            | Run ESLint across all packages                          |
| `pnpm format`          | Format code with Prettier                               |
| `pnpm docker:dev:up`   | Start PostgreSQL (dev)                                  |
| `pnpm docker:dev:down` | Stop PostgreSQL (dev)                                   |
| `pnpm init`            | Install, generate Prisma, deploy migrations, build deps |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# App
PORT=3001

# Auth / Cookies
COOKIE_SECRET=change_me
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

# PostgreSQL
POSTGRES_DB=template
POSTGRES_USER=template_user
POSTGRES_PASSWORD=template_password
POSTGRES_PORT=5434

# Database URL
DB_URL=postgresql://template_user:template_password@localhost:5434/template
```

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

- Swagger UI: `http://localhost:3001/docs`

## License

MIT
