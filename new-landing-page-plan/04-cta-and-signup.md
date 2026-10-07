# Phase 4: CTAs and signup

Goal: every call to action on the page leads to a working lead form, with and without JS.

## 4.1 Where the CTAs go (default of open question 2)

The design has no form. Its CTAs point to a "Demo buchen" design or to `#start` (the hero, which has no form). On the site there is no booking URL (`DEMO_HREF` in `cta.ts` already points to the signup form for that reason). So:

| CTA in the design | Target |
|---|---|
| Hero "Umrüstung anfragen →" | the signup form in the final CTA |
| Hero "Kürzungsrisiko berechnen ↓" | `#risiko` (unchanged) |
| Calculator "Kürzung vermeiden →" | the signup form |
| Final "Umrüstung anfragen →" | becomes the form's submit button |
| Header "Bestand prüfen" | the signup form (via `#start`) |
| Banner "Mehr erfahren" | `#risiko` (`bannerHref`, phase 1.4) |

Implementation: the final CTA section carries `id="start"` on this page (the hero doesn't), so `START_HREF` keeps working for the header. `focusSignup()` in `cta.ts` focuses a fixed id (`HERO_EMAIL_ID = "email-top"`); give it an optional id argument (or read the target form's input id from the link) so the final form's email field gets focus. The other pages keep their behaviour.

## 4.2 The form

- `FinalCta` with `SignupForm` and `finalForm` from `load`, `submitLabel: "Umrüstung anfragen"`, plus the kicker snippet with the live day count (phase 2.3, 3.1).
- Server: `handleSwitchSignup(event, { source: "upgrade-now", page: ROUTE_UPGRADE_NOW })`. The same `switchInquiry` zod schema, spam pipeline (honeypot → timing → zod → gibberish → rate limit) and leads table as `/messdienstwechsel` and the city pages. The `_t` timestamp is re-stamped on mount (the page is CDN-cached), which `SignupForm` already does.
- Webhook: the existing `switchinquiry` Make.com event with `page: "/upgrade-now"` (open question 4). The payload shape stays the same as on the other landing pages; tests point `MAKE_WEBHOOK_UNIFIED` at the local sink.
- Feedback stays inline (success state of `SignupForm`, `role="alert"` errors), no toasts.
- Works without JS (form action).

## 4.3 Layout

The design's final block is text on the left (kicker + H2) and one button on the right. With the form, use the existing final-CTA layout of the other landing pages (heading, then the signup box) and keep the design's kicker. Show the result to the designer; if they want the original two-column block, the form goes into the right column instead of the button.

## Done when

- Each CTA in §4.1 lands on the form with the email field focused (with JS) or at the form anchor (without).
- A valid signup creates a lead with `source = "upgrade-now"` and a webhook with `page: "/upgrade-now"`; invalid and honeypot behave as on `/messdienstwechsel`.
