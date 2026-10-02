# Phase 6: Server Endpoints & Server Utilities

**Goal:** port all non-UI server code. Keep URLs and payloads identical, so client components (and anything external) keep working, whichever app serves them.

This phase can run **in parallel** with phases 3–5.

## 6.1 Server modules (`src/lib/server/`)

Anything under `$lib/server` can't be imported by client code. SvelteKit enforces this at build time, which replaces the implicit server-only rule of RSC.

| File | Change |
|---|---|
| `db/index.ts`, `db/schema.ts` | `process.env.DATABASE_URL!` → `env.DATABASE_URL` from `$env/dynamic/private`. Build the client lazily (`getDb()`) so `vite build` doesn't need the env |
| `leads.ts` | unchanged |
| `webhooks.ts` | read `MAKE_WEBHOOK_UNIFIED` from `$env/dynamic/private` **inside** the function. Don't use a module-level constant |
| `rateLimit.ts` | unchanged. On Vercel the limiter and its `setInterval` sweeper are per warm instance (best effort, the same as today). If spam gets past it, move to Upstash/Vercel KV (`@upstash/ratelimit`). Out of scope for the port |
| `slack.ts` | replace the `axios.create` instance with a `slackPost(method, body)` helper using `fetch`. Note that Slack's `conversations.replies` and `chat.postMessage` want `application/x-www-form-urlencoded`, so send `new URLSearchParams(body)` and the `Authorization: Bearer` header |
| `ai/personas.ts` | unchanged |

`drizzle.config.ts` moves to `web/` as is. Update the `schema` path.

## 6.2 Endpoint translation template

```ts
// Next
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ success: true });
}

// SvelteKit: src/routes/api/<name>/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const body = await request.json();
  return json({ success: true });
};
```

| Next | SvelteKit |
|---|---|
| `NextResponse.json(x, { status })` | `json(x, { status })` |
| `new NextResponse(html, { headers })` | `new Response(html, { headers })` |
| `NextRequest` | `RequestEvent` (`request`, `url`, `cookies`, `getClientAddress`) |
| `export const maxDuration = 30` | `export const config = { maxDuration: 30 }` (adapter-vercel) |
| `getClientIP(req)` via `x-forwarded-for` | `getClientAddress()`. It is adapter-aware and correct on Vercel |

## 6.3 Endpoints

| Endpoint | Notes |
|---|---|
| `POST /api/contact` | Port the honeypot → timing → zod → gibberish → rate-limit pipeline unchanged. Move `isGibberish` and the schema to `$lib/server/contact.ts` so the form action from phase 7 can reuse them. Add unit tests for `isGibberish` (vitest) while you're there |
| `POST /api/fragebogen` | Unchanged field whitelist → `sendOfferInquiryEvent`. Add zod validation with the same schema the client uses (`$lib/fragebogen/schema.ts`) |
| `POST /api/send-email` | Newsletter webhook. Pass `getClientAddress()` as `ipAddress` (today it is always `undefined`) |
| `POST /api/leads` | Unchanged. Consider validating `email` with zod |
| `POST /api/chat` | Phase 8 |
| `POST /api/chat/slack/send`, `/messages` | Phase 8 (straight port using `slack.ts`) |
| `GET /api/preview`, `/api/exit-preview` | Phase 5 |
| `POST /api/revalidate` | Phase 5 (probably removed) |
| `GET /api/email-preview` | Phase 9 |

## 6.4 CSRF note

SvelteKit's built-in CSRF check rejects cross-origin **form** submissions (`application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain`) to any route. All current endpoints take JSON, so they are unaffected. If an external service (for example Make.com) ever posts form-encoded data to these routes, add it to `kit.csrf.trustedOrigins`.

## 6.5 Verification
Write a small `scripts/compare-endpoints.ts` that posts the same fixtures to `:3000` and `:5173`. Point `MAKE_WEBHOOK_UNIFIED` at a request bin (for example `webhook.site`) in **both** apps and compare the outgoing webhook bodies. They must be identical apart from `timestamp`.

## Known issues fixed in this phase
Details are in [known-issues.md](known-issues.md). Tick them there as well.

- [x] **KI-15** (Low): Newsletter webhook never sends the IP
- [x] **KI-16** (Med): No server-side validation on `/api/fragebogen` and `/api/leads`

## Exit criteria
- All endpoints return the same status codes and bodies for the fixture set (valid, invalid, honeypot, too fast, gibberish, rate-limited).
- Outgoing Make.com payloads are identical.
- `bun run build` succeeds without DB or env vars present.
- All known issues listed above are fixed.
