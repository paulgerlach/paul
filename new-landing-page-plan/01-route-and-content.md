# Phase 1: Route, links, content and SEO

## 1.1 Route and links

In one commit:

- `ROUTE_FRISTENRECHNER = "/fristenrechner"` in `$lib/routes.ts`, after `ROUTE_NEUIGKEITEN`.
- The landing footer's "Fristenrechner" (`$lib/landing/footerLinks.ts`, group "Ressourcen") gets `href: ROUTE_FRISTENRECHNER`.
- **Other links to the page** (README, Links): `/neuigkeiten`'s row "Fristenrechner" (`deadlines.rows[3].href`); `/hausverwaltung`, `/mietverwaltung` and `/weg-verwaltung`: the first audience card's `cta.href` ("Zum Fristenrechner") and answer 5's "Fristenrechner" as `<a href>` (answers may hold links). Their e2e specs and content tests change with them (the button shows now; `/neuigkeiten`'s rows are four links).
- `src/routes/(landing-page)/fristenrechner/+page.server.ts`, as `/upgrade-now`'s:

```ts
seo: {
	// Drafts for the content owner (plan §4.4).
	title: "Fristenrechner Messdienst: Kündigung, Eichfrist und Abrechnung | Heidi Systems",
	description:
		"Kostenlos und ohne Anmeldung: Berechnen Sie, bis wann Sie Ihren Messdienstvertrag kündigen müssen, wann die Eichfrist Ihrer Zähler abläuft und bis wann die Abrechnung beim Mieter sein muss.",
	ogTitle: "Jede Frist im Messdienst. Auf den Tag genau.",
	noindex: true,
	keepCanonical: true,
},
landing: DEFAULT_CHROME,
now: Date.now(),
```

  and `handleSwitchSignup(event, { source: "fristenrechner", page: ROUTE_FRISTENRECHNER })`. No `cache-control`.
- Sitemap: no entry until the cutover (gate §4.4).

## 1.2 Content module

`$lib/landing/pages/fristenrechner/content.ts`, word for word from the design:

- `hero`: pill "Fristenrechner" (calendar icon), H1 "Jede Frist im Messdienst." + accent "Auf den Tag genau.", lead, CTAs "Frist berechnen" → `#rechner`, "Wichtige Stichtage" → `#stichtage` (both with ↓), ticks "Kostenlos", "Ohne Anmeldung", "Mit Rechtsgrundlage".
- `calculator`: its label "Fristenrechner", the tabs (`vertrag` Vertrag, `eich` Eichfrist, `abr` Abrechnung), the note "Maßgeblich sind Ihr Vertrag und die jeweilige Rechtslage. Keine Rechtsberatung."; per pane the field labels, the options (Erstlaufzeit 1, 2, 3, 5, 8, 10 Jahre, default 10; Verlängerung um 1, 2, 3, 5 Jahre, default 1; Kündigungsfrist 1, 3, 6, 12 Monate, default 3; Zählerart Kaltwasserzähler (6 Jahre), Warmwasserzähler (5 Jahre), Wärmezähler (5 Jahre)), the result labels, the hints (the Vertrag hint's link "So funktioniert der Wechsel" → `ROUTE_MESSDIENSTWECHSEL`), "optional", "12 Monate nach Erhalt".
- `milestones`: pill "Stichtage" (clock icon), H2 "Die wichtigsten Termine " + muted "der Heizkostenverordnung.", four `{ date (ISO), dateText, title, text, law, hot? }`.
- `portfolio`: pill "Für den ganzen Bestand" (building icon), H2 "Viele Verträge? " + muted "Der Portfolio-Checker rechnet für alle.", text, the two CTAs without `href` (with their design ids), the four example rows `{ name, text, action, tone: "t" | "k" | "a" }`, "Beispieldaten".
- `faq`: title "Häufige Fragen", five items (`FaqItem`).
- `closing`: H2 "Fristen im Blick. Den Rest erledigt Heidi.", text "Wir zeigen Ihnen Heidi live, am Beispiel Ihres Bestands." (the same as `/schnittstellen`'s), submit label "Demo buchen".

`content.test.ts`: the H1; every `href` a route or an anchor on the page; no empty or untrimmed text; three tabs, four milestones in date order (the last one `hot`), four rows, five FAQ items; the defaults among the options; the closing text equal to `/schnittstellen`'s; the hidden CTAs without `href`.

## 1.3 Date math (`fristen.ts`, pure)

Dates are calendar days as UTC-midnight milliseconds (`Day`), so no time zone or DST enters the math. Ported from `#fr-js`:

- `todayOf(clockToday)`: the Berlin calendar date of the clock's `today` as a `Day` (`berlinDate`).
- `parseIso` / `toIso` / `formatDate` ("30.09.2027"), `addDays`, `addMonths` (clamps the day to the target month, like the design's `addM`), `addYears`, `daysBetween`.
- `defaults(today)`: `{ contractStart: 1.1. of year − 8, calibrationYear: year − 4, periodEnd: 31.12. of year − 1 }`.
- `contract({ start, term, renewal, notice }, today)`: the first end is start + term − 1 day; the last day to cancel is (end + 1 day) − notice − 1 day; while that day lies before today (at most 60 times) the contract renews by `renewal` years. Returns `{ cancelBy, end, days, progress }`, `progress` = days to `cancelBy` / days to `end` (at least 1), clamped to 0–1.
- `calibration(year, years)`: `{ end: 31.12. of year + years, plan: end − 3 months }`; `null` for an invalid year (`< 1900`).
- `billing(periodEnd, received?)`: `{ deadline: periodEnd + 1 year, objections: received + 1 year | null }`.
- `daysBadge(days, warnAt)`: `{ text, tone }`: "seit N Tagen vorbei" (`late`), "heute", "noch N Tage" (`warn` below `warnAt`: 60 for Vertrag and Abrechnung, 180 for Eichfrist; else `ok`), German thousands separators, singular "Tag".
- `milestoneBadge(date, today)`: "gilt" once the day has come or passed (the design: before today → "gilt"; on the day "in 0 Tagen", here "heute"), else "in N Tagen" / "in 1 Tag".
- `timelineAnchor(progress)`: the label's shift, 12 / 50 / 88 % (below 0.15, between, above 0.85).

`fristen.test.ts`: each function with the design's example values on 19.10.2026 (contract 1.1.2018, 10 years, 1, 3 → 30.09.2027 / 31.12.2027, 346 days; Eichjahr 2022, 6 years → 31.12.2028 / 30.09.2028; period end 31.12.2025 → 31.12.2026, 73 days), the renewal loop (a cancel day just passed moves a year on), month-end clamping (31.1. + 1 month, 29.2.), the badges' boundaries and singulars, DST (a day count across the end of March).

## 1.4 Images

None new: the page has no photo. The floating CTA's avatars and the closing card's video are the repo's (README table).
