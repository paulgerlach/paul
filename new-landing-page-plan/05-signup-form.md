# Phase 5: Signup form

The city page has the same two email forms as `/messdienstwechsel`: one in the hero (`#start`, input `email-top`) and one in the final CTA (`email-bottom`). Only the button text differs: "Bestand kostenlos prüfen". The placeholder stays "Ihre geschäftliche E-Mail?".

Almost everything already exists after phase 1:

| Piece | Source |
|---|---|
| Schema, success and error texts | `$lib/forms/switchInquiry.ts`, unchanged (`placement: "hero" \| "final"`) |
| Server: empty forms, spam traps, rate limit, lead, webhook | `$lib/server/switchSignup.ts` (phase 1.4) |
| Client: states (idle, submitting, success "Wir melden uns", inline error), no-JS POST, `_t` re-stamp on mount, honeypot | `$lib/landing/components/SignupForm.svelte` with `submitLabel` |
| `#start` focus handling | `cta.ts` `focusSignup()` on every `#start` link (nav CTA, map CTA, "Mehr erfahren" in the portfolio card, demo links while `DEMO_HREF = START_HREF`) |

## City- and Germany-specific parts

Germany page (phase 8): `source: "messdienstanbieter"`, `page: "/messdienstanbieter"`, no `city`.

- `+page.server.ts` action: `handleSwitchSignup(event, { source: "messdienstanbieter-berlin", page: "/messdienstanbieter/berlin", extra: { city: "berlin" } })`. The source and page are built from `params.city`, never from form input.
- Webhook payload: `sendWebhookEvent("switchinquiry", email, { placement, page, city })`. `city` is a new optional field; `/messdienstwechsel` doesn't send it. Note it in `$lib/server/webhooks.ts` next to the event.
- Rate limit: the same `switch:<ip>` bucket as `/messdienstwechsel` (3 per 10 min). One person signing up on two landing pages is still one person.
- The `leads` table needs no change: `source` is free text.

## Make.com

The pending `switchinquiry` route (in the `/messdienstwechsel` gate) covers these signups too. Tell whoever builds it that the payload may carry `city`, so sales can see where the lead came from. Add this to the PR description.

## Done when

- With JS: both forms submit, the success state shows, a `leads` row with `source = "messdienstanbieter-berlin"` appears, and the webhook sink receives `switchinquiry` with `city: "berlin"`.
- Without JS: the POST, the redirect back and the message work.
- Invalid email, filled honeypot, an immediate submit and the rate limit behave as on `/messdienstwechsel`.
