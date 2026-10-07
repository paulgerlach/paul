# Phase 3: the deadline clock and the interactions

Goal: everything that depends on "now" is correct in the Europe/Berlin time zone, identical between SSR and hydration, and live in the browser. Every animation respects `prefersReducedMotion()`; timers and observers start only in the browser and are cleaned up.

## 3.1 One time source

**`deadline.ts`** (pure functions, no DOM, no `Date.now()` inside; every function takes `now: number`):

- `DEADLINE = Date.UTC(2026, 11, 31, 23, 0, 0)`: 31.12.2026, 24:00 in Berlin (= 1.1.2027, 00:00 CET), as in the design.
- `berlinDate(ms)` → `{ year, month, day, weekday }` via `Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", … })`. The design uses `new Date(y, m, d)` (local time); on Vercel that is UTC, so the "today" cell would be wrong between 0:00 and 1:00/2:00 Berlin time.
- `remaining(now)` → `{ days, hours, minutes, seconds, expired }` for the countdown.
- `daysLeft(now)`, `monthsText(now)` (the design's `moText`: "knapp drei Monate", "gut zwei Monate", "einen Monat", "45 Tage" …), `daysLeftText(now)` ("Noch 85 Tage").
- `yearProgress(now)` → per-month fill fractions, the percentage, and the "Oktober, November und Dezember: Ihr letztes Zeitfenster" sentence.
- `calendarMonths(now)` → the months from the current Berlin month to December 2026, each with its day cells (past, today, weekend, holiday, deadline) and its remaining working days; plus the totals (working days, weeks, holidays) for the KPIs.
- `HOLIDAYS_2026`: the 9 nationwide holidays of the design (Neujahr … 2. Weihnachtstag). Regional holidays (e.g. Reformationstag) are not counted, which matches the KPI label "bundesweite Feiertage".

**Fix two design bugs while porting** (and note them for the designer):

- On 31.12. itself `floor((END − now) / day)` is 0, so the design shows "Frist abgelaufen" and "Nur noch null Tage" although the deadline hasn't passed. Use `expired = now >= DEADLINE` for the state and a "heute" wording for the last day ("Nur noch heute", "Letzter Tag").
- `moText` reads `NUM[f + 1]`, which is `undefined` for more than ~11.5 months. Unreachable after go-live, but clamp it.

**`deadline.test.ts`** (Vitest): fixed timestamps for 7.10.2026, 1.12. 00:30 Berlin (= 30.11. 23:30 UTC), 31.12. 12:00, 31.12. 23:59:59 Berlin, 1.1.2027 00:00 Berlin and 2027-02-01. Check the texts, the working-day count (by hand for one month), the today cell, and the expired state.

**SSR and hydration.** `load` returns `now: Date.now()`. A small rune class `DeadlineClock` (`clock.svelte.ts`, provided with `setContext` per page, as `$lib/fragebogen` does) holds `now = $state(data.now)`. Sections read derived values from it (`$derived(remaining(clock.now))`), never `Date.now()`. During hydration `clock.now` is still the server's value, so the markup matches. On mount the clock sets `now = Date.now()` and ticks once per second, aligned to the full second as in the design (`1000 − Date.now() % 1000`), stopped on teardown and when the deadline passes. The CDN can serve HTML up to ~11 minutes old; the first client tick corrects it.

## 3.2 Expired state (`clock.expired`)

Reached on the client at the deadline, or server-side for every request after it:

- Hero: the H1 and lede switch to the content module's expired texts (open question 3), the countdown and the year band are not rendered, the design's `um-over` paragraph is shown.
- Timeline: the 31.12.2026 entry becomes `done`, its badge says "Frist abgelaufen".
- Consequences: the eyebrow "Ab 1. Januar 2027" becomes "Seit 1. Januar 2027".
- Time window: the calendar and the KPIs are not rendered; the steps stay, with the "Vor dem 31.12." timing replaced (content module).
- Calculator: the switch label "Vor dem 31.12. mit Heidi umgerüstet" gets its expired text.
- Final CTA: kicker "Frist abgelaufen", H2 from the content module.

Test it with Playwright's clock (§5.2). Review the copy with the content owner in December.

## 3.3 Countdown and hero

- `Countdown.svelte`: four units; a changed digit slides in while the old one slides out (the design's `.in` / `.out` spans, removed after 520 ms). With reduced motion the text just changes. `role="timer"`, `aria-live="off"` (a per-second announcement would be noise); the `aria-label` names the deadline.
- `YearBand.svelte`: 12 month bars; on first view the fills grow one after the other (70 ms stagger). Reduced motion: the fills render at their final width. The SSR markup has the final widths too, so no-JS is correct.

## 3.4 Count-ups

- The three consequence numbers (3, 12, 15) count up over 1.1 s when the card is in view; the "Werktage" KPI over 1.2 s. Use the existing `countUp` attachment (`onView`, no hover). SSR renders the final values (the design starts at 0, which would be wrong without JS).

## 3.5 Risk calculator

**`calculator.ts`** (pure, tested):

- `UNIT_STOPS`: 2–19 in steps of 1, 20–95 by 5, 100–490 by 10, 500–2000 by 50 (the design's `STOPS`); the slider moves over the index, default 120 units.
- Heating cost per unit: 400–3000 € in steps of 50, default 1000 €.
- Share not yet remotely readable: 25 / 50 / 75 / 100 % (default "Alle").
- `risk({ units, costPerUnit, share, retrofitted })` → `{ base = units × share × cost, cut = 3 % of base, perUnit = 3 % of cost }`; with `retrofitted` the cut and per-unit values are 0.
- Formatting with `toLocaleString("de-DE")`, rounded to whole euros.

**Component:**

- `$state` for the four inputs, `$derived` for the result. The displayed amount tweens with `tweenNumber` (500 ms; 1400 ms when the switch turns on); cancel the running tween on each change.
- The range tracks are painted with a `--p` custom property (`style:--p`) instead of the design's inline gradient string.
- The result card switches to the "safe" look and texts when the switch is on; the bar width is `max(2, share × 100) %`, or 100 % when safe.
- Turning the switch on fires the confetti 250 ms later from the amount (`confetti.ts` with this design's options, §2.3). Not with reduced motion; stopped on teardown.
- Without JS the inputs still render with their defaults and the server-rendered result; that's enough (the CTA works).

## 3.6 Smaller behaviour

- Reveal on scroll: `inView` on the elements with the design's `rv` class.
- Anchor links (`#risiko`, the CTA links): the design scrolls with a 72 px offset. Check how the other landing pages handle anchors under the sticky header (`scroll-margin-top` or the existing scroll code) and do the same; don't add a second mechanism.
- The radio-wave visual in `WhyHeidi` is CSS only; stop it with reduced motion.
- The pulsing "live" dot in the hero pill: CSS only, static with reduced motion.

## Done when

- `deadline.test.ts` and `calculator.test.ts` pass.
- No hydration warnings at any time of day, including with the system time zone set to UTC and to America/New_York.
- With reduced motion emulated, every number shows its final value immediately and nothing loops.
- Playwright clock tests of §5.2 pass.
