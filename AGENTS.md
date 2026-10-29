<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# wanderlust

Travel-booking app ("Wanderlust"): a Next.js 16.4 **frontend** that talks to a **separate backend API on `http://localhost:8000`** (not part of this repo) plus **Better Auth + MongoDB** for auth. Single Next.js app (not a monorepo) — everything lives in one `src/` tree. **npm only** (`package-lock.json`); don't add pnpm/yarn lockfiles.

## Commands

- `npm run dev` — Turbopack dev server on :3000. Note: it re-writes the agent-rules block above, so expect it in diffs.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); with no args it lints the whole repo.
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` script; `npm run build` also typechecks.
- `npm run build` — production build.
- **No tests, no CI, no pre-commit hooks exist.** Verification order: `lint` → `tsc --noEmit` → `build`.

Shell quirk (this machine): `npm` is blocked by PowerShell execution policy — use `npm.cmd run lint`, `npx.cmd tsc --noEmit`, etc.

### Pre-existing lint failures

`npm run lint` currently exits 1 on two vendored shadcn/ui files (`src/components/ui/carousel.tsx`, `src/hooks/use-mobile.ts`, rule `react-hooks/set-state-in-effect`). They predate your change — don't churn generated component files to make lint green, and don't assume your own code caused them.

## Architecture

- **Auth: Better Auth** with `@better-auth/mongo-adapter` on a MongoDB Atlas cluster. MongoDB is used **only** for auth in this repo — destination/booking data lives in the external backend.
  - Server config: `src/lib/auth.ts` (exports `auth`, connects via `process.env.MONGODB_URI`, db name `wanderlust`).
  - Client: `src/lib/auth-client.ts` (exports `authClient` from `better-auth/react`, base URL `process.env.BETTER_AUTH_URL`).
  - Catch-all handler: `src/app/api/auth/[...all]/route.ts` (`toNextJsHandler(auth)` — don't add other API routes in this folder; app data comes from :8000).
  - Server-side session: `auth.api.getSession({ headers: await headers() })` — see `src/app/my-bookings/page.tsx`.
  - Client-side: `authClient.useSession()`, `authClient.signUp.email(...)`, `authClient.signIn.email(...)`, `authClient.signOut()` — see `src/app/signin/page.tsx`, `src/app/signup/page.tsx`, `src/components/Navbar.tsx`.
  - Email+password auth is enabled; no OAuth providers configured.
- **External backend on `http://localhost:8000`** — destinations, bookings, etc. URLs are hardcoded per component (e.g. `API_URL` in `src/components/Destinations.tsx`, `BookingCard.tsx`, the add/edit/delete destination dialogs, `src/app/my-bookings/page.tsx`). Most data-driven UI is `"use client"` components doing their own `fetch`. The backend must be running for those pages to work; there is no proxy or env var for its URL.
- **Routes so far** (root layout in `src/app/layout.tsx` wraps every page in `<Navbar/>` + `<Footer/>`): `/`, `/destinations`, `/destinations/[id]`, `/add-destination`, `/my-bookings`, `/signin`, `/signup`, `/api/auth/[...all]`.
- Env vars live in `.env` (gitignored): `MONGODB_URI`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`. Values are live credentials — never paste them into code, docs, or commits.

## Stack details that differ from defaults

- **Next 16, App Router** in `src/app`. The root layout declares `function RootLayout({ children }: LayoutProps<"/">)` — `LayoutProps` is a Next-generated global type; don't "fix" it into hand-written props. Font is `Josefin_Sans` via `next/font/google`. Local Next docs: `node_modules/next/dist/docs/01-app/`.
- **`cacheComponents: false` and `partialPrefetching: false`** in `next.config.ts` — caching directives (`use cache`, `cacheTag`, `cacheLife`) are **not** in play (zero usages in `src/`); standard Next data fetching applies. If you flip `cacheComponents` back on, re-read `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` first.
- **`reactCompiler: true`** (with `babel-plugin-react-compiler`) — React compiler rules apply to your components.
- **`images.remotePatterns`** allows only `images.unsplash.com` — adding image hosts means editing `next.config.ts`.
- **Tailwind v4, CSS-first**: no `tailwind.config.*` and no PostCSS config exist — never add one. Theme tokens are in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`); CSS is loaded via the Turbopack rule in `next.config.ts`.
- **shadcn/ui, `base-nova` style on Base UI primitives** (`@base-ui/react`), **not Radix** — imports look like `import { Button } from "@base-ui/react/button"`. Add components with `npx shadcn add <name>`; config in `components.json`. `src/components/ui/` also contains vendored extras (chat/AI bits like `message.tsx`, `bubble.tsx`, `code-block.tsx` backed by the shiki wrapper in `src/lib/highlighter.tsx` + `src/hooks/use-highlighted-code.ts`) that the app doesn't use yet.
- **`cn` comes from the npm package `cn`**: components import `from "cn"`; `src/lib/utils.ts` only re-exports it. Follow that pattern instead of redefining a helper.
- **lucide-react v1 has no brand icons** (Twitter/X, LinkedIn, Instagram…) and its `XIcon` is the ✕ close glyph — use inline SVGs for social logos (see `src/components/Footer.tsx`). Icon exports use the `*Icon` suffix (e.g. `ChevronRightIcon`).
- Path alias `@/*` → `src/*` (`tsconfig.json`).
- `README.md` is untouched create-next-app boilerplate and its paths are stale (says `app/page.tsx`, actual is `src/app/page.tsx`) — trust config and `src/`, not the README.
