# Phase 4: Signup form

The page has two identical email forms: one in the hero (`#start`) and one in the final CTA. Both use the button "Wechsel kostenlos prüfen" and the placeholder "Ihre geschäftliche E-Mail?". In the design, submitting only changes the button text to "Wir melden uns".

## 4.1 Server

`$lib/forms/switchInquiry.ts` (shared between client and server):

```ts
export const switchInquirySchema = z.object({
  email: z.email().max(254),
  placement: z.enum(["hero", "final"]),   // which form, for reporting
  website: z.string().max(0).optional(),  // honeypot, same as kontakt
  _t: z.number().optional(),              // render timestamp, same timing check as kontakt
});
export const SWITCH_SUCCESS = "Danke! Wir melden uns innerhalb eines Werktags.";
export const SWITCH_ERROR = "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut.";
```

`messdienstwechsel/+page.server.ts`:
- `load` returns `seo` (phase 1.7) and **two** superforms instances (`heroForm` and `finalForm`), each with a different `id`. Two forms on one page with the same schema need distinct ids in superforms. Stamp `_t` the same way kontakt does.
- `actions.default`:
  1. `superValidate(request, zod4(switchInquirySchema))`.
  2. Run the spam layers: honeypot, timing, and `checkIPRateLimit(getClientAddress())`. Reuse what `runContactPipeline` does. Extract the shared spam checks from `$lib/server/contact.ts` into a small helper rather than duplicating them. A blocked request gets the same success message, as with kontakt.
  3. `saveLeadDB(email, "messdienstwechsel")`. The `leads` table already has `source`.
  4. `sendWebhookEvent("switchinquiry", email, { placement, page: "/messdienstwechsel" })`. This adds `"switchinquiry"` to the `EventType` union in `$lib/server/webhooks.ts`. A webhook failure is logged but doesn't fail the request, because the lead is already stored.
  5. `message(form, { type: "success", text: SWITCH_SUCCESS })`.

**Make.com dependency (agreed):** someone with access to the Make.com scenario needs to add a `switchinquiry` route that notifies sales. Until then the leads are only in the database. Write this into the PR description.

## 4.2 Client: `SignupForm.svelte`
- Props: `form` (the superforms data), `placement`, `id`, `inputId`.
- `use:enhance` from superforms, so it works without JS (full-page POST, then the same page with the message).
- States:
  - idle;
  - submitting: the button is disabled and shows a small spinner (reuse `Basic/Loading` or the CSS spinner);
  - success: show the design's "Wir melden uns" state, with the button text changed and the input disabled, and put `SWITCH_SUCCESS` in an `aria-live="polite"` region;
  - error: show the error inline below the field, styled to the design.
- Use the browser's `type="email"` and `autocomplete="email"`. Show the zod error inline.
- The honeypot field is visually hidden, the same as kontakt.

## 4.3 CTA wiring
- "Wechsel starten" (nav), "Demo ansehen" (testimonial banner), the demo card and "Kostenlosen Abrechnungscheck starten" all link to `#start` and move focus to the hero email input after scrolling. To do that, put a small click handler on the links that calls `document.getElementById('email-top')?.focus({ preventScroll: true })` after the scroll. Use `scroll-margin-top` on `#start` for the sticky nav.
- If a booking URL is provided (README "still open" 3), the demo CTAs link there instead.

## Done when
- With JS: both forms submit, the success state shows, a row appears in `leads` with the correct `source`, and the webhook is attempted. Without `MAKE_WEBHOOK_UNIFIED` set locally it logs "Skipping".
- Without JS (disable it in DevTools): the POST, the redirect back and the message all work.
- Invalid email, honeypot filled, an immediate submit (timing) and the rate limit all behave like kontakt.
