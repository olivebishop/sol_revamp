# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js monorepo using the `/app` directory for routing and page structure.
- Major features are organized under `/app/(main)/`, `/app/(dashboard)/`, and `/components/`.
- Data and configuration are in `/data/` and `/lib/`.
- Backend logic and API routes are in `/app/api/`.
- Database access is managed via Prisma (`/lib/prisma.ts`, `/prisma/schema.prisma`).

## Key Patterns & Conventions
- **Component Structure:** UI and logic are split into feature folders under `/components/` (e.g., `aboutComponent/`, `gallery/`, `packages/`).
- **Shared UI:** Common UI primitives are in `/components/ui/` and `/components/shared/`.
- **Data:** Static data is imported from `/data/*.ts` files.
- **API:** Custom API endpoints live in `/app/api/` (REST-style, not RPC).
- **Authentication:** Auth logic is in `/lib/auth.ts` and `/lib/auth-client.ts`, with routes under `/app/api/auth/` and `/app/auth/`.
- **Admin:** Admin dashboard and management tools are in `/components/admin/` and `/app/api/admin/`.
- **Prisma:** Use `/lib/prisma.ts` for DB access. Schema is in `/prisma/schema.prisma`. Migrations are in `/better-auth_migrations/`.

## Developer Workflows
- **Start Dev Server:** `pnpm dev` (preferred) or `npm/yarn/bun dev`.
- **Prisma Migrate:**
  - Edit `/prisma/schema.prisma` and run `pnpm prisma migrate dev`.
  - Migrations are stored in `/better-auth_migrations/`.
- **Seeding:** Use scripts in `/scripts/` (e.g., `seed-admin-emails.ts`).
- **Styling:** Uses global CSS (`/app/globals.css`) and PostCSS config (`postcss.config.mjs`).
- **TypeScript:** All code is TypeScript-first. Types are in `.ts`/`.tsx` files.

## Integration & Cross-Component Patterns
- **Data Flow:** Pages import data from `/data/` or fetch via `/app/api/` endpoints.
- **Component Communication:** Props and context are used for state sharing; no global state library is present.
- **External Services:** Auth and DB are the main integrations (see `/lib/`).

## Examples
- To add a new admin tool: create a component in `/components/admin/` and an API route in `/app/api/admin/`.
- To add a new static page: add a folder and `page.tsx` under `/app/(main)/`.
- To update DB schema: edit `/prisma/schema.prisma` and run migration.

## References
- See `/README.md` for basic setup.
- See `/lib/` for utility and integration logic.
- See `/components/ui/` for reusable UI patterns.

---
If any conventions or workflows are unclear, ask for clarification or check for updates in this file.

## Project-Specific AI Agent Instructions

- **Admin Dashboard Sync:** Ensure `/packages` and `/destinations` data and UI always match what admin can add/edit in the dashboard. Any changes made via admin must be reflected in the user-facing UI. Do not add `author` fields or features not present in the app structure.
- **Dashboard Responsiveness:** All dashboard UIs for `/packages` and `/destinations` (in `/app/(dashboard)/`) must be fully responsive and follow Next.js 16.0.3 conventions. Layouts should adapt to all screen sizes.
- **Next.js Caching:** Use the `use cache` directive for data fetching in `/packages` and `/destinations` as described in the official Next.js 16.0.3 documentation. Follow best practices for cache revalidation and performance.
- **Editor for Descriptions:** For any description field where user input is expected, use the editor component from `/components/editor` as the input UI.
- **Drawer Layout:** All drawer components must be responsive, with improved layout, padding, and alignment for a visually appealing look. Apply these standards to all relevant drawers in the app.
