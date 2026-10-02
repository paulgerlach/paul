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

## Exit criteria
- `bun run dev` serves the default page. `bun run build` and `bun run check` pass.
- The Vercel preview for `web/` deploys.
