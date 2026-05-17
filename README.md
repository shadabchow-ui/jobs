# Jobs Board

SSR-first job board application built with the Ventari 2.0 stack.

**Stack**: Remix + React 18 + TypeScript → Cloudflare Workers/Pages

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run typecheck

# Run tests
npm run test

# Build for production
npm run build
```

## Architecture

- **SSR-first**: All route content is server-rendered via Remix route loaders
- **Cloudflare Workers**: Targets Cloudflare Workers/Pages runtime
- **Vite**: Build and dev server
- **Vitest**: Unit and integration testing
- **TypeScript**: Strict mode throughout

## Directory Structure

```
app/
  components/
    shell/       — Header, nav, footer
    jobs/        — Job listing components
    companies/   — Company profile components
    salaries/    — Salary chart components
    profile/     — User profile components
    ai/          — AI tool components
    molecules/   — Shared UI primitives
  fixtures/      — Synthetic data for development
  lib/           — Shared utilities
  loaders/       — Route loader utilities
  routes/        — File-based Remix routes
  services/      — Server-only service boundaries
  styles/        — Design tokens and global CSS
  types/         — Shared TypeScript types
tests/           — Vitest test files
```

## Route Map

| Route | Path | Description |
|-------|------|-------------|
| Home | `/` | Job search hero, popular searches, AI teaser |
| Find Jobs | `/jobs` | Job search and listings |
| Companies | `/companies` | Company profiles and reviews |
| Salaries | `/salaries` | Salary benchmarks and comparisons |
| AI Career Tools | `/ai-career-tools` | AI-powered career guidance |
| My Jobs | `/my-jobs` | Saved jobs and applications |
| Profile | `/profile` | User account and preferences |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for Cloudflare Pages |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run Vitest test suite |
| `npm run deploy` | Deploy to Cloudflare Pages |
