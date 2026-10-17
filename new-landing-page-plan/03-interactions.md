# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means the end state: no loops, no counting, no draw-ins, no confetti; the interactive parts still work, they just change instantly. Loops run only while their block is in view and the tab is visible, through `loopInView` (its `run` resets the block and schedules the steps, and returns a cleanup that clears them).

# Part A: The dashboard preview

Ordered so each step is usable on its own: 3A.1 → 3A.2 → 3A.3 is a working Overview; the views, the drawer and the billing run follow.

## 3A.1 State

`demo/demo.svelte.ts`: `class DashboardDemo` with `$state` fields, the design's `S` plus what it kept in closures: `view` (`dash | obj | mtr | doc | abr`), `scope` (object id or `null`), `period` (`ytd | q3 | y25`), `granularity` (`d | w | m`), `dataView`, `previousYear: { kalt, warm }`, `meterType`, `meterQuery`, `objectQuery`, `docCategory`, `billingFunction`, `objects` (the seven plus any added), `documents` (plus generated ones), `invited: string[]`, `added: { rm: [], fl: [] }`, `docsUnseen`, `openMenu`, `drawer` (`{ kind: "alert", type } | { kind: "meter", id } | null`), `dialogTile`, `note`. Derived values (`$derived`) call `model.ts`; methods (`setScope`, `setPeriod`, `go(view)`, `openAlert`, `openMeter`, `openTile`, `addObject`, `invite`, `runBilling`, `addUvi`, `addDevice`, `notify(text)`) only change state. `setDemo()` / `getDemo()` through context, created in `DashboardDemo.svelte` (one per page instance, no SSR leak). The initial state equals the server render, so hydration matches.

## 3A.2 Menus, view switch, granularity, data view

- **Pickers** (`Picker.svelte`): a button with `aria-expanded` / `aria-controls` and the popup (rendered only while open). Opening one closes the others (`openMenu`); a click outside (`clickOutside` from `$lib/attachments/`), Escape, or picking an entry closes it and returns focus to its button. Entries are buttons with `aria-current="true"` on the chosen one and the design's check icon. Portfolio: "Portfolio wählen", "Alle Objekte" ("7 Objekte · 370 Wohnungen") and each object ("{n} Wohnungen"); picking sets `scope`, the subtitle becomes "{name} · {n} Wohnungen", the scope chip appears ("{name}" + × with `aria-label` "Filter entfernen"), and the view goes to Dashboard. Period: "Zeitraum" with the three periods; picking redraws with the draw-in. Share and account: 3A.6.
- **View switch**: both tablists (side nav, mobile tabs) drive `view`; arrow keys move between tabs (roving `tabindex`), Enter/Space or click activates (manual activation, as the views do work). Opening Dokumente clears the "neu" badge. Changing view or scope keeps the menus closed.
- **Granularity**: `Segmented` bound to `granularity`; the charts redraw from `expanded()` with the draw-in.
- **Data view**: the switch toggles `dataView`; every chart tile shows its `DataTable` instead (3A.8). No draw-in.
- **Vorjahr**: the two line tiles' "Vorjahr" buttons (`aria-pressed`) toggle the dashed previous-year line; disabled for `y25` (the design does the same).

## 3A.3 Charts: draw-in and tooltips

- **Draw-in** (on entering the view once, and after a scope, period or granularity change): lines reveal through a clip rect whose `transform: scaleX()` goes from 0 to 1 over 1.4 s (1.5 s for the forecast); bars scale from the bottom with 40 ms stagger per bar on monthly (6 ms on weekly/daily); the CO₂ figure counts up over 1.2 s (`countUp` with `format`, phase 1.5). Under reduced motion: none of it. Switching views back to Dashboard redraws without the draw-in (the design's `drawAll(false)`).
- **Tooltips**: pointer move over a line chart picks the nearest slot from the pointer's x in percent of the plot width (no `getBoundingClientRect` math beyond that), shows the dashed marker, the dot (HTML, positioned in percent) and the tip "**{value} {unit}** · {pointLabel}" (+ " · Vorjahr {v}" when on), clamped inside the tile. Bars show the tip on hover. Forecast: "Ist, {Monat}" or "Prognose {low}–{high}, {Monat}". Pointer leave hides it. The tips are pointer-only and `aria-hidden`: the chart's label and the data view carry the values for keyboard and screen-reader users (3A.8).
- **Resize**: nothing to do; the charts are in percent (README, Charts).

## 3A.4 Views (loaded on first use)

`views/Objects`, `Meters`, `Documents`, `Billing` load through `import()` when first selected (a small "Wird geladen …" placeholder in the panel), and stay loaded.

- **Objekte**: head "Objekte" with "{n} Objekte · {units} Wohnungen", a search field ("Objekt suchen", filters by name as you type), the "Objekt anlegen" button revealing a small form (address, units 1–500, "Speichern", "Abbrechen"). Saving adds the object locally (badge "neu", "Montage geplant", no meters, radio share 0) and to the portfolio picker, and shows the note "{name} angelegt (Vorschau)". The table: Objekt, Wohnungen, Zähler, Funk-Anteil (bar + %), Status ("In Ordnung" with a check), Verbrauch zum Vorjahr (↘ −x,x % green / ↗ +x,x % red); the object's name is a button that scopes the dashboard (the design's clickable row); "Kein Objekt gefunden." when empty; the hint "Klicken Sie auf ein Objekt, um das Dashboard darauf zu filtern." Unlike the design, typing doesn't re-render the input (no focus juggling): the input is bound, the rows derive.
- **Zähler**: head with "{n} Zähler im Auszug" (+ " · {object}"), search ("Nummer, Objekt oder WE"), chips "Alle" + the four types (`aria-pressed`), the table (Zähler-Nr., Typ, Objekt, Einheit, Stand, Übertragung "Heidi-Funk" / "Bestand", Status) with the first ten matches; the number is a button that opens the meter drawer; "Keine Zähler für diese Auswahl."; "{n} weitere Zähler. Filtern Sie nach Typ oder suchen Sie nach einer Nummer."
- **Dokumente**: head with the count, category chips (Alle, Abrechnungen, Verbrauchsinfo, Protokolle), the list (icon, title with "neu" badge for generated ones, "{object} · {date} · {detail}", "Herunterladen" → note "Download in der Vorschau nicht verfügbar").
- **Abrechnung**: "Funktionen auf Knopfdruck"; the function list (five buttons, `aria-pressed`) and the panel:
  - Heizkostenabrechnung: the object select (default the scoped object or Bergmannstraße 4), the period select (one option), "Abrechnung erstellen" → the four steps run 650 ms apart (`run` → `ok`), then a generated document "Heizkostenabrechnung 2025" ("PDF · {n} Einzelabrechnungen", dated "05.10.2026") is added with the "neu" badge on Dokumente, the result line "{n} Einzelabrechnungen erstellt" / "{name} · rechtssicher nach HKVO" with "In Dokumenten ansehen" (→ Dokumente), and the confetti burst over the preview (`burst` from `$lib/landing/confetti.ts`, on a canvas inside the frame, `aria-hidden`). Reduced motion: steps and result at once, no confetti. The button is disabled while running.
  - uVI hinzufügen: object and month ("September 2026", "August 2026"); adds a "Verbrauchsinformation September" document and the line "uVI für {n} Mietparteien hinzugefügt".
  - Betriebskosten: the object select and the seven cost types with bars and the sum (static example values).
  - Rauchmelder / Feuerlöscher hinzufügen: object, unit and room (or location), "Hinzufügen" adds an entry to the local list ("erfasst") and shows a note; "Noch nichts erfasst." when empty.
  Status lines after an action are in a `role="status"` element, so they're announced once.

## 3A.5 Drawer and enlarged chart

- **Drawer** (`Drawer.svelte`, the design's side panel inside the frame): `role="dialog"`, `aria-modal="false"`, `aria-labelledby` its heading, a close button ("Schließen"). Opening moves focus to the heading (`tabindex="-1"`); Escape or the close button closes it and returns focus to the element that opened it. Contents: for a status row, "{type}" / "Alle {n} in Ordnung" / "Alle Geräte haben heute per Funk übertragen · {scope}. Auszug:" with six meters (buttons → the meter) and "Alle im Bereich Zähler ansehen" (closes, sets the type filter, goes to Zähler); for a meter, its facts (`<dl>`: Objekt, Einheit, Stand, Übertragung, Letzter Wert, Status) and nine monthly bars "Verbrauch Jan–Sep" (values from the PRNG).
- **Enlarged chart** (`TileDialog.svelte`, the design's `.hd-modal` over the frame): same dialog pattern, plus closing on a click on the backdrop. Heading = tile title, sub "{scope or Alle Objekte} · {period}", the summary (Summe, Ø pro Monat, Zum Vorjahr with sign and colour), and the chart at the large size (`.hd-ch.big`), always as a chart even when the data view is on (the design does the same).
- Only one of them is open at a time; Escape closes the top-most thing (menu, then dialog, then drawer), handled once in `DashboardDemo` (`<svelte:document onkeydown>`), not by three document listeners.

## 3A.6 Share and account

- **Share menu**: "Dashboard teilen"; a small form (e-mail field with label, "Einladen"): an invalid address marks the field (`aria-invalid`, the design's red border) and keeps focus; a valid one is added to the list ("eingeladen", initial avatar) and shows the note "Einladung an {email} vorbereitet (Vorschau)". Nothing is sent; the address lives in component state until the page is left. "Noch niemand eingeladen." when empty. "Link kopieren" copies the page URL (open question 6) with `navigator.clipboard.writeText` (failure ignored) and shows "Link kopiert" for 1.6 s.
- **Account menu** ("Ihre Hausverwaltung": Profil, Benachrichtigungen, Abmelden): each entry closes the menu and shows "In der Vorschau nicht verfügbar".
- **Note** (`Note.svelte`): `role="status"`, the text with a check, visible 2.6 s; a new note replaces the old one and restarts the timer.

## 3A.7 Hint and first view

- The hint "Probieren Sie es aus: Das Dashboard ist voll bedienbar." with its pulsing dot appears after mount (it's a promise only JS can keep).
- On entering the view the first time, the Overview plays its draw-in (3A.3); below the fold on load, so nothing visible flashes. If the preview is already in view on load (tall screens), the server's charts stay and nothing replays.

## 3A.8 Accessibility of the preview

- The frame is a labelled region; the tablists, menus, switch, segmented control, chips and dialogs follow the patterns above; every icon-only control has a label.
- Each chart is `role="img"` with `aria-label` from `describeChart()` ("Kaltwasser, Jan bis Okt 2026, monatlich: 28 bis 284 m³, zuletzt 284 m³"); the data view's tables are the complete alternative. The design hides the "Datenansicht" switch at ≤820 px, which would leave small screens without it (the enlarge dialog always shows the chart), so below 820 px the switch moves into the Overview bar next to the granularity control, as a compact switch (a deviation from the design, listed in §4.1's expected differences).
- Nothing in the preview is a live region except the note and the action results; chart redraws, counters and draw-ins are silent.
- Focus is visible on the light frame with the landing focus ring.

# Part B: The rest of the page

## 3B.1 Hero chips

The popovers open on hover (CSS, as designed; the design also opens them on focus of the non-focusable span, which is dropped). The "Kosten" popover counts from 0 to "18.420 €" over 900 ms each time it opens (`countUp` with `hoverTarget` and `format`, phase 1.5), the "Verbrauch" bars grow in. Reduced motion: final values. The live dot's ping is CSS (off under reduced motion; the design's `#pillfx` hover ping is CSS too and is ported).

## 3B.2 KPI cards

- **Sparkline**: the line draws in once on view (dash offset via a CSS custom property set on mount from `getTotalLength()`; this SVG has a fixed viewBox, so measuring is fine here) and the area fades in.
- **`BarScrub`** (cards 2 and 3): the bars grow from 0 on first view, 45 ms apart (server: full height; on mount, when the card is below the fold and motion is allowed, they're set to 0 first, as `/mieterportal`'s photo zoom does). Pointer move/down picks the month under the pointer (from x in percent), pointer leave (mouse only) and a pointer down outside reset; the chart is focusable (`tabindex="0"`, `role="group"` with the design's `aria-label`) and takes ArrowLeft/ArrowRight (first press picks the first/last month), Home/End, Escape (reset); blur resets. The picked month dims the others, highlights its label, swaps the figure to the month's value (two decimals) and the caption to "{caption} {Monat}", and shows the tooltip above the bar. A visually hidden `aria-live="polite"` line states the picked month and value, so keyboard users hear what the tooltip shows. The mode (`Segmented`) swaps data and caption and keeps the picked month.
- **CO₂ figure**: counts from 0 to 11,3 over 1.4 s on first view while no month is picked (`countUp` with `format`).

## 3B.3 Scroll scene

On mount, when motion is allowed, the section gets the scene class (520 vh, sticky stage, sentences stacked and transformed) and one passive `scroll` + `resize` listener (`<svelte:window>`), throttled to one `requestAnimationFrame`, computes `p = clamp(−top / (height − vh))`, `t = p · (n − 1) · 1.08` and per sentence the design's opacity, offset, blur, scale and strike width (`--s`) and colour; the current dot. The function is pure (`strikeFrame(i, t, n, heights)` in the component's module script or `chart.ts`'s neighbour; unit-tested at a few `t`). Writes go to element styles directly from the frame callback (no `$state` per frame). Reduced motion or no JS: the static list. Leaving reduced motion on mid-session isn't handled (the media query is read once, as elsewhere).

## 3B.4 Bento demos

| Demo | Behaviour | Loop |
|---|---|---|
| `AddObject` | Types the next entry ("{name}, {units}") at 80 ms per character (deterministic; the design adds random jitter), presses the button (180 ms), inserts the row at the top (slide-in), trims to three, shows the placeholder again | `loopInView`, every 4600 ms, first run 600 ms after entering |
| `Notifications` | The five cards rotate one position (`p-2 … p2`, others hidden) | `loopInView`, every 2600 ms |
| `TakeOver` | The `sw` rows' badges swap while the card is hovered | CSS only (as designed) |
| `LeakWatch` | A scan line sweeps the 14 days over 4.2 s (ease-in-out), revealing points and the line through the clip; at day 10 the badge appears and the flagged points pulse; the scan label shows "Tag {n}"; 5.2 s hold, 0.7 s fade, repeat. Hovering a revealed point shows "{v} Liter" / "Tag {t}" (+ "· auffällig") | `loopInView`, threshold 0.35, every 10 100 ms, first run 300 ms after entering. Server and reduced motion: everything shown, badge on |
| `BillingRun` | Click: the button disables, the hint reads "Plausibilitätsprüfung läuft …", each row turns "Wird erstellt" then "Erstellt" (380 ms apart, 900 ms each), then the toast, "Zurücksetzen" and the confetti (`burst`) over the card; a second click resets. The hint/toast line is the `role="status"` | Click only. Reduced motion: the end state at once, no confetti |
| `Share` | Types the next address at 60 ms per character, presses "Dashboard teilen", adds the invitee ("Eingeladen"), trims the list to "Sie" + two; a click on the button adds the next invitee at once | `loopInView`, every 5600 ms, first run 500 ms after entering. Reduced motion: the first invitee, no typing; the click still works |

The typed text and caret are `aria-hidden` (the visuals are illustrations); `BillingRun` and `Share`'s buttons are real and keep focus when the content changes.

## 3B.5 Hand-over

`loopInView` on the figure, every 3400 ms, first run 600 ms after entering (the design also skips while `document.hidden`; `loopInView` covers that). A run: the first queued card turns "wird übertragen" and the sync icon spins; after 650 ms a copy of the card flies (transform and width over 0.9 s, cubic-bezier(.65,0,.35,1), measured once from the card's and the table's boxes) to the table; after 880 ms the row is inserted on top ("Neu", "gerade eben"), the older rows age ("vor 1 Min.", then the fixed times), the table keeps five rows, the counter increments with a bump, a new card joins the queue. Reduced motion: the server state, no loop. Everything is `aria-hidden` except the figure's caption.

## 3B.6 Recommendation list

- **Check run** (once, on first view; the design's `onView(pl, run)`): rows reset to hidden, come in 140 ms apart with "Wird geprüft" (spinner), turn checked 700 + 420·i ms, counts tick up, then "7 Liegenschaften geprüft" with a check. Server and reduced motion: the end state. Not announced (the hidden status line announces filter results only).
- **Filters and search**: `aria-pressed` buttons and the search field drive `filterRecommendations()`; hidden rows get `hidden`; the status line says "{n} Liegenschaften" after a change (debounced 300 ms while typing).
- **Toggletips**: the chip shows its popover on pointer hover, on focus, and toggles on click (`aria-expanded`); Escape or focus leaving closes it. The popover is the design's (`title · name`, text, three numbered steps, the note) and positioned as designed; check it stays inside the viewport at 375 px.

## 3B.7 Question marquee

The rows' CSS animation runs only while the section is in view (`inView` toggles `running` on the section, `animation-play-state` otherwise `paused`), pauses on hover and focus-within (as designed) and with the pause button (open question 4, `aria-pressed`, labels "Anhalten" / "Abspielen"). Reduced motion: no animation and no pause button, the rows static and clipped at the edges (the design's reduced-motion rule); the first `<ul>` of each row carries the content for assistive tech.

## 3B.8 Closing chart, reveal and the rest

- **Closing chart**: on first view the clip grows from 0 to the full width over 2 s (ease-out), then the dot and halo appear; then `loopInView` every 3200 ms picks new targets (each point ± 7, the last one only lower, the previous-year line ± 4) and tweens the paths towards them over ~1.5 s with `requestAnimationFrame`, stopping when they arrive (the design's tween never stops). Server and reduced motion: the full chart at the base values; the halo's pulse is CSS (off under reduced motion).
- **Reveal**: `{@attach reveal()}` on `<main>` with the design's `.rv` styles (phase 1.1).
- **Hover effects**: buttons, chips, cards, the photo-less bento hovers: CSS only.
- Anchors (`#start`, `#strike`) are plain links with `scroll-margin-top: 72px` on their targets; `tokens.css` already turns off smooth scrolling under reduced motion.
- `FloatingCta`, `TrustSeals`, `SignupForm` bring their own behaviour (unchanged).
