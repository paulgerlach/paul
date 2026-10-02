# Phase 1: Scaffold

**Goal:** an empty SvelteKit app in `web/` that builds, lints, type-checks, and deploys a preview. The Next app is untouched.

## Steps

1. **Create the project**
   ```bash
   bunx sv create web --template minimal --types ts
   cd web
   bunx sv add tailwindcss eslint prettier playwright vitest
   ```
   - Choose `bun` as the package manager (the repo uses `bun.lock`).
   - Confirm `svelte` ≥ 5.29 (this plan uses `{@attach}`) and `@sveltejs/kit` ≥ 2.20.

2. **Adapter:** Vercel (decided):
   ```bash
   bun add -D @sveltejs/adapter-vercel
   ```
   Next's `output: "standalone"` setting has no equivalent and is dropped.
   `svelte.config.js`:
   ```js
   import adapter from '@sveltejs/adapter-vercel';
   import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

   export default {
     preprocess: vitePreprocess(),
     kit: {
       adapter: adapter({ runtime: 'nodejs22.x' }),
       alias: { $slices: 'src/lib/slices' }
     }
   };
   ```
   Note: `$lib` replaces the `@/` alias. Imports change from `@/components/...` to `$lib/components/...`.

3. **Tailwind v4.** `sv add tailwindcss` sets up `@tailwindcss/vite`. Remove any `postcss.config` it creates if it's not needed. The `@theme` block is moved over in phase 2.

4. **Runtime dependencies** (install now so later phases don't stall):
   ```bash
   bun add @prismicio/client @prismicio/svelte zod drizzle-orm postgres ai @ai-sdk/svelte \
           swiper lottie-web svelte-sonner @lucide/svelte svelte-exmarkdown remark-gfm \
           sveltekit-superforms @fontsource-variable/exo-2
   bun add -D @sveltejs/enhanced-img drizzle-kit slice-machine-ui @slicemachine/adapter-sveltekit
   ```

5. **vite.config.ts**
   ```ts
   import { sveltekit } from '@sveltejs/kit/vite';
   import { enhancedImages } from '@sveltejs/enhanced-img';
   import tailwindcss from '@tailwindcss/vite';
   import { defineConfig } from 'vite';

   export default defineConfig({
     plugins: [tailwindcss(), enhancedImages(), sveltekit()]
   });
   ```
   `enhancedImages()` must come **before** `sveltekit()`.

6. **Environment.** Copy `.env` → `web/.env` and rename `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` → `PUBLIC_PRISMIC_ENVIRONMENT`. Add `.env.example` that lists every key without values.

7. **Formatting and linting.** Port `.prettierrc` settings and add `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`. Use the flat ESLint config from `sv`. Drop `.eslintrc` and `eslint.config.mjs` at cutover.

8. **Scripts** (`web/package.json`):
   ```json
   {
     "dev": "vite dev",
     "build": "vite build",
     "preview": "vite preview",
     "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
     "lint": "prettier --check . && eslint .",
     "test:unit": "vitest",
     "test:e2e": "playwright test",
     "slicemachine": "start-slicemachine"
   }
   ```

9. **CI.** Add a job that runs `bun run check && bun run lint && bun run build` in `web/`.

10. **Preview deploy.** Create a second Vercel project pointing at `web/` (root directory = `web`) so every PR gets a Svelte preview URL next to the Next one.

## Status (done 2026-10-02)

Steps 1–9 are done. Differences from the steps above:
- `sv create` (v1.0.1) scaffolds **Kit 3**. It was downgraded to `@sveltejs/kit@^2.70.3` + `@sveltejs/adapter-vercel@^6.3.4` (decision #5). The Kit 3 conventions were reverted: config is back in `svelte.config.js` (with `runes: true` forced for project files), `$lib` replaces the `#lib` subpath imports, and `tsconfig.json` extends `.svelte-kit/tsconfig.json`.
- Vitest uses `passWithNoTests` until real tests exist. A Playwright smoke test is in `src/routes/page.svelte.e2e.ts`.
- `prettier.config.js` copies the root `.prettierrc` (tabs, width 80, double quotes, trailing commas).
- The root `.env` has no Prismic/Slack/AI keys (they live in Vercel), so nothing needed renaming. `.env.example` lists every key.
- The root `tsconfig.json` now excludes `web/`. Otherwise `next build` would type-check the Svelte app.
- CI: `.github/workflows/web.yml` (check, lint, build on changes under `web/`).
- **Step 10 is still open:** the second Vercel project (root directory `web`) has to be created in the Vercel dashboard.

## Exit criteria
- `bun run dev` serves the default page. `bun run build` and `bun run check` pass.
- The Vercel preview for `web/` deploys.
