# heidisystems.com

Marketing site for Heidi Systems: SvelteKit 2 + Svelte 5 (runes), Tailwind v4, Prismic, deployed on Vercel.
The landlord/tenant app lives at platform.heidisystems.com.

## Develop

```sh
bun install
cp .env.example .env   # fill in the values
bun run dev            # http://localhost:5173
```

| Command                             | What it does                                       |
| ----------------------------------- | -------------------------------------------------- |
| `bun run dev`                       | Dev server                                         |
| `bun run build` / `bun run preview` | Production build / serve it on :4173               |
| `bun run check`                     | svelte-check (types)                               |
| `bun run lint` / `bun run format`   | Prettier + ESLint                                  |
| `bun run test:unit`                 | Vitest                                             |
| `bun run test:e2e`                  | Playwright (builds, then runs against the preview) |
| `bun run slicemachine`              | Prismic Slice Machine                              |

The Playwright signup specs need the local Postgres from `DATABASE_URL`.

## Conventions

See [`CLAUDE.md`](CLAUDE.md) for the project state and the Svelte 5 conventions used here, and [`svelte-migration-plan/`](svelte-migration-plan/) for how the site was ported from Next.js.
