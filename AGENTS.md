<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# wanderlust

Single Next.js 16.4 app (not a monorepo) — everything lives in one `src/` tree. **npm only** (`package-lock.json`); don't add pnpm/yarn lockfiles.

## Commands

- `npm run dev` — Turbopack dev server on :3000. Note: it re-writes the agent-rules block above, so expect it in diffs.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); with no args it lints the whole repo.
- `npx tsc --noEmit` — typecheck. There is **no** `typecheck` script; `npm run build` also typechecks.
- `npm run build` — production build.
- **No tests, no CI, no pre-commit hooks exist.** Verification order: `lint` → `tsc --noEmit` → `build`.

Shell quirk (this machine): `npm` is blocked by PowerShell execution policy — use `npm.cmd run lint`, `npx.cmd tsc --noEmit`, etc.

### Pre-existing lint failures

`npm run lint` currently exits 1 on two vendored shadcn/ui files (`src/components/ui/carousel.tsx`, `src/hooks/use-mobile.ts`, rule `react-hooks/set-state-in-effect`). They predate your change — don't churn generated component files to make lint green, and don't assume your own code caused them.

## Stack details that differ from defaults

- **Next 16, App Router** in `src/app` (`layout.tsx` + `page.tsx` are the whole app so far). The root layout declares `function RootLayout({ children }: LayoutProps<"/">)` — `LayoutProps` is a Next-generated global type; don't "fix" it into hand-written props. Local Next docs: `node_modules/next/dist/docs/01-app/`.
- **`cacheComponents: true`** (plus `partialPrefetching`) in `next.config.ts`. Data fetching is *dynamic by default*; caching is opted into per page/component/function with `use cache`, `cacheTag`, `cacheLife`. PPR is on by default and the `runtime` route segment config is unsupported (Node.js runtime only). Read `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` before adding data fetching.
- **`reactCompiler: true`** (with `babel-plugin-react-compiler`) — React compiler rules apply to your components.
- **Tailwind v4, CSS-first**: no `tailwind.config.*` and no PostCSS config exist — never add one. Theme tokens are in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`); CSS is loaded via the Turbopack rule in `next.config.ts`.
- **shadcn/ui, `base-nova` style on Base UI primitives** (`@base-ui/react`), **not Radix** — imports look like `import { Button } from "@base-ui/react/button"`. Add components with `npx shadcn add <name>`; config in `components.json`.
- **`cn` comes from the npm package `cn`**: components import `from "cn"`; `src/lib/utils.ts` only re-exports it. Follow that pattern instead of redefining a helper.
- **lucide-react v1 has no brand icons** (Twitter/X, LinkedIn, Instagram…) and its `XIcon` is the ✕ close glyph — use inline SVGs for social logos (see `src/components/Footer.tsx`). Icon exports use the `*Icon` suffix (e.g. `ChevronRightIcon`).
- Path alias `@/*` → `src/*` (`tsconfig.json`).
- `README.md` is untouched create-next-app boilerplate and its paths are stale (says `app/page.tsx`, actual is `src/app/page.tsx`) — trust config and `src/`, not the README.
