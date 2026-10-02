# Phase 9: Email Templates

## What exists

- `src/components/emails/`: `EmailLayout`, `HeidiPremiumTrial`, `HeidiYearlyReview`, `CreatorCampEmail`, `HediConfirmEmail`, `TenantInviteEmail`, `SharedQrLoginSection`, `constants` (about 830 lines, `@react-email/components`).
- `src/utils/email/renderEmail.tsx` renders them to HTML.
- They are used **only** by `GET /api/email-preview` and the `/emails/preview` page. Nothing in the marketing site sends email. The Make.com webhooks handle all outbound communication.
- The content (tenant invites, QR login, "creator camp", "yearly review" with `topPlatform: 'Instagram'`) belongs to the platform app or to another project, not to the marketing site.

## Decision: Option A (delete). Confirmed

| Option | Effort | When to choose |
|---|---|---|
| **A. Delete** the templates, both preview routes, and `@react-email/*` | XS | Default. Nothing on heidisystems.com uses them. If the platform needs them, they belong in the platform repo |
| B. Move them to the platform repo as they are | S | The platform team wants them and isn't already maintaining copies |
| C. Keep React Email **server-only** inside SvelteKit (`react`, `react-dom`, `@react-email/render` as deps, used only in `$lib/server/email`) | S | The marketing site must render them. It works, since React never reaches the client bundle, but React stays in the dependency tree |
| D. Port to a Svelte email renderer (for example `better-svelte-email` or `svelte-email-tailwind`) | M | Long-term templates are needed here, and React must be removed entirely |

### Steps (do this **before phase 3**, as a small PR against the Next codebase on `main`)
1. Delete `src/components/emails/`, `src/utils/email/`, `src/app/api/email-preview/`, `src/app/emails/`.
2. `bun remove @react-email/components @react-email/render`.
3. `bun run build` passes, and `grep -r "react-email\|renderEmail" src` returns nothing.

That shrinks the port and the cutover diff, and production stops shipping dead routes.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [x] **KI-25** (Low): React Email templates and preview routes: delete

## Exit criteria
- Email code and `@react-email/*` are removed from the Next codebase. Nothing email-related exists in `web/`.
- All known issues listed above are fixed.
