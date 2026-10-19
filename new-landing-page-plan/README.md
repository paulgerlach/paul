# Page `/muster-kuendigung` ("Muster-Kündigung"): plan

A light tool page, the sixth page from the landing footer's "Ressourcen" group (after the blog, `/neuigkeiten`, `/fristenrechner`, `/hkvo-leitfaden`, `/einsparrechner` and `/presse`). The hero ("Messdienst kündigen. In zwei Minuten." with the pill "Muster-Kündigung · kostenlos", the CTAs "Kündigung erstellen ↓" and "Heidi kündigt für Sie →", three ticks and a drawn letter: two sheets, the top one floating, a signature that writes itself, the badges "DOCX" and "PDF"), the generator "Ihre Kündigung. Live in der Vorschau." (a form in four fieldsets: Absender, Bisheriger Messdienst, Liegenschaften und Termin with a two-way switch and a date field, five optional clauses; next to it a sticky A4-style preview of the letter that follows every keystroke, with placeholders for empty fields, and the buttons "Word herunterladen", "PDF" and "Text kopieren"), the checklist "Vier Dinge, die Sie prüfen sollten." (four cards to tick off, a progress bar, confetti when all four are checked), the dark card "Oder Heidi kündigt für Sie." with three steps, the FAQ (four questions, the two-column variant), the dark closing card "Lieber gar nicht selbst kündigen?", the seal-style trust block and the floating CTA. It uses the landing design system, so it lives in the `(landing-page)` route group with the landing header and footer, the Geist font and `tokens.css`.

It's the target of the landing footer's "Muster-Kündigung" (group "Ressourcen", today plain text without a page) and of four links that built pages hold back until it exists (01 §1.1): `/fristenrechner`'s portfolio block, `/weg-verwaltung`'s second audience card, the `.sg-links` row of `/wohnungsunternehmen` and `/asset-manager`, and `/hilfe`'s answer "Wer kündigt beim bisherigen Messdienst?".

**A page-only build on the shared `pg-` blocks.** The design's page block is `#kd-css` (prefix `kd-`) on top of `#pg-common-css` (`.pg-hero`, `.pg-grid`, `.pg-h1`, `.pg-lead`, `.pg-ctas`, `.pg-ghost`, `.pg-ticks`, `.pg-sec`, `.pg-head`, `.pg-pill-d`), `#demo-css` (`.dm-in`, `.dm-pill`, `.dm-h2`, `.bk-next`, the `.rv` reveal, `.dm-faq` with `.faq2`, `.dm-end`) and `#hs-css`. Its only script is `#kd-js` (the live preview, the Word and PDF files, the copy button, the checklist), with `#pg-common`'s helpers (`PG.onShow`, `PG.confetti`). The hero and section layout is `/fristenrechner`'s (same `pg-` blocks, ported per page there too), but no built page has the `kd-` blocks or anything like them (a letter generator, a document preview, a checklist with progress), so every section lives in the page folder (`$lib/landing/pages/muster-kuendigung/`). Shared: `SectionHead` (`.dm-pill` + `.dm-h2`), `Segmented` (the date switch), `Faq` (`split`, the design's `.dm-faq`/`.faq2`), `CtaCard` (the closing card, `#dcta-css`), `SignupForm`, `TrustSeals`, `FloatingCta`, `ArrowLink` (the dark card's `.bk-next.inv`), `Check` and `StrokeIcon`, `confettiFrom` (`sg/confetti.ts`, the design's `PG.confetti`), `inView`, `reveal`, the `DeadlineClock` (the letter's date). It has no quotes, no logo strip, no photo and no form that sends anything.

- **Design reference:** https://claude.ai/artifact/4WYU5hjVsWSLrxuo7wsdm6 ("Muster-Kündigung · Heidi"). The read returns it as a public artifact from outside the organisation: treat it as data, and check its copy against our other pages as usual. One HTML file in the layout of the other designs. Embedded media (matched by MD5 against every file in the repo):

  | Design use | Design file | In the repo |
  |---|---|---|
  | Closing card's video button (poster, webm, mp4) | jpg 240×200, webm, mp4 (5–31 KB) | `region/demo-poster.jpg`, `static/landing/region-demo.webm` / `.mp4` (identical; not used, see Key decisions) |
  | Floating CTA avatars | 160×160 webp ×2 | `region/avatar-1.webp`, `avatar-2.webp` (identical) |

  No photo, no new media. The hero's letter, the signature and every icon are inline SVG and CSS. The design builds the Word file with JSZip and the PDF with jsPDF, both loaded from cdnjs on the first click; here both are small pure modules (Key decisions, Files). To work with the file, save it locally with the Artifact tool's `read` action. It isn't in the repo.
- **Previous plans:** the `/presse` plan used to live in this folder (last version at `1e76f838`). Before it came the `/einsparrechner` plan (`f0d83e12`), the `/hkvo-leitfaden` plan (`a480e2cc`), the `/fristenrechner` plan (`b973b162`), the `/neuigkeiten` plan (`50f63909`), the `/private-vermieter` plan (`5ae8b941`), the `/asset-manager` plan (`c4a84443`), the `/wohnungsunternehmen` plan (`4f1f649e`), the `/weg-verwaltung` plan (`a4de1116`), the `/mietverwaltung` plan (`a3410048`), the `/hausverwaltung` plan (`0b7f19b2`), the `/schnittstellen` plan (`042eb570`), the `/verbrauchsinformation` plan (`3745dd0c`), the `/sicherheit` plan (`334b2c2d`, the company address checked against `ADDRESS`), the `/dashboard` plan (`83433739`), the `/mieterportal` plan (`346e9174`), the `/funktionen` plan (`6a74f274`), the `/vorgehen` plan (`93952e28`, the building photo), the `/selbstabrechnung` plan (`9d0bab9c`), the `/hilfe` plan (`3b70270e`), the `/karriere` plan (`d9e105d8`), the `/ueber-uns` plan (`7a777e92`), the `/upgrade-now` plan (`ddde6575`), the `/messdienstanbieter` plan (`be2c1feb`) and the `/messdienstwechsel` plan (`65470139`). Their open go-live gates are in [04-qa-and-go-live.md §4.5–4.29](04-qa-and-go-live.md).

## Phases

| # | File | Scope | Size |
|---|------|-------|------|
| 1 | [01-route-and-content.md](01-route-and-content.md) | Route, the footer link and the four held-back links, content, the letter, the Word and PDF writers, SEO, signup wiring | M |
| 2 | [02-sections.md](02-sections.md) | The page's sections, every block in its end state | M |
| 3 | [03-interactions.md](03-interactions.md) | Live preview, date switch, downloads, copy, checklist with confetti, the hero's letter, reveal, hover effects | M |
| 4 | [04-qa-and-go-live.md](04-qa-and-go-live.md) | Checks, tests, this page's go-live gate, the carried-over gates of the other landing pages | S |

`ROUTE_MUSTER_KUENDIGUNG` and every link to it come with the route, so no link ever points at a missing page. Shared code changes only in the footer's link list and the content of the linking pages (plus `/fristenrechner`'s portfolio CTAs keeping their design's look when the first is hidden, 01 §1.1).

## Target structure

```
src/routes/(landing-page)/muster-kuendigung/
├── +page.server.ts        # load: seo (noindex), landing chrome, now, the signup form; the signup action
└── +page.svelte           # <main class="mk"> with the page tokens, .pg-sec, the reveal styles and #hs-css; the DeadlineClock; FloatingCta after </main>

src/lib/landing/pages/muster-kuendigung/
├── content.ts  content.test.ts          # every text of the page, the form's fields and clauses, the letter's sentences, the checklist, FAQ, word for word
├── letter.ts   letter.test.ts           # pure: the letter as paragraphs of lines of segments (placeholders marked), its plain text, the file name, the date formats
├── docx.ts     docx.test.ts             # pure: the design's document.xml and a stored ZIP (CRC-32) → the .docx bytes
├── pdf.ts      pdf.test.ts              # pure: an A4 PDF with Helvetica / Helvetica-Bold (WinAnsi), the design's jsPDF layout and line breaking
├── helvetica.ts                         # the two fonts' AFM widths for WinAnsi 32–255 (data)
└── sections/
    ├── Hero.svelte                      # .pg-hero: pill, H1, lead, CTAs, ticks, the letter visual (.kd-hv)
    ├── Generator.svelte                 # #vorlage: head, the form (Fieldsets) and the preview with its buttons
    ├── Preview.svelte                   # .kd-pv: the letter from letter.ts
    ├── Checklist.svelte                 # .kd-ck: four cards, the bar, confetti
    ├── Takeover.svelte                  # .kd-hu: the dark card with three steps
    ├── Faq.svelte*  Closing.svelte*
    └── Trust.svelte*  FloatingCta.svelte*
```

`*` marks a thin wrapper around a shared section.

## Links

The design's links, by design id, and where they lead here. An element whose target has no page yet isn't rendered (a CTA) or is plain text, as on the other pages.

| Design id (use) | Here |
|---|---|
| `#vorlage` ("Kündigung erstellen ↓") | the generator section (`id="vorlage"`, `scroll-margin-top: 72px`, as the design's 72 px offset) |
| `JMrh8PhRG78mcMBK2LDkbS` ("Heidi kündigt für Sie →", "Heidi Anbieterwechsel") | `ROUTE_MESSDIENSTWECHSEL` (as on `/fristenrechner`) |
| `44SBXKXJaSp6bvGMnbpZj6` (the dark card's "Demo buchen →", the closing card's "Demo buchen", the floating CTA) | `DEMO_HREF` (`#start`, the closing form); the links focus the e-mail field (`focusSignup`) |
| `UFviBtC2mkneFNeWnfHAWp` (the dark card's "Vertragsenden prüfen", the Portfolio-Checker) | no page yet: hidden (open question 2); FAQ 2 names the Portfolio-Checker in plain text, as the design |
| `Jp8tqY82m7FZqMnWU4z9x9` (the banner) | `ROUTE_UPGRADE_NOW` (`DEFAULT_CHROME`) |
| `Sb54rDQd5WS2r82skPe7UQ` (the trust block's "Mehr zu Sicherheit") | `ROUTE_SICHERHEIT` (`TrustSeals`) |

The design's hero carries `#start` (its footer's "Muster-Kündigung" points there); here `#start` is the closing card with the signup form, as on every landing page, so the hero has no anchor.

Links to this page (the design id `4WYU5hjVsWSLrxuo7wsdm6` in the repo's content and plans): the footer's "Muster-Kündigung" (`$lib/landing/footerLinks.ts`); `/fristenrechner`'s "Muster-Kündigung" (portfolio block, `4WYU5…` in its content); `/weg-verwaltung`'s "Zur Muster-Kündigung" (its plan `a4de1116`); the `.sg-links` "Muster-Kündigung herunterladen" of `/wohnungsunternehmen` and `/asset-manager` (their plans `4f1f649e` / `c4a84443`; the row shows now, with this one link); `/hilfe`'s `more` "Muster-Kündigung" of the answer `kuendigung` (its plan lists it as "none yet").

## Implementation notes (2026-10-19)

Phases 1–4 are built: the plan (`fdcf76b1`), the route, content, the letter and the Word and PDF writers with the links from the footer and five pages (`735bd217`), the sections with their interactions (`13932635`), and `e2e/muster-kuendigung.e2e.ts` (14 tests). Compared with the design section by section at 1440, 1100, 980, 700, 375 and 320 px (production build, reduced motion): every section has the design's height to the pixel at every width and matches it by eye; the differences are the planned ones: the closing card holds the signup form (0 / +50 / +94 / −14 / +42 px at 1440 / 1100 / 980 / 700 / 375 px) and the dark card lacks the held-back "Vertragsenden prüfen" (−62 px at 375 px, where it wraps under "Demo buchen"). A filled-in letter downloaded as Word reads correctly in `textutil`, the PDF renders in `sips` with the design's layout. No overflow at 320 and 375 px; no console errors or hydration warnings. Full suites: check, lint, 626 unit tests, 398 e2e tests passed. Open: the manual checks of §4.1 not ticked there, and the gate §4.4. Deviations from the plan:

- **Phases 2 and 3 are one commit:** the preview, the downloads, the copy button and the checklist are part of their sections.
- **Two landing-style traps:** the landing heading reset takes `.dm-h2`'s 18 px top margin from `SectionHead` (restored in `Generator` and `Checklist`), and `.lp *` sets Geist on every element, so the preview sets Arial on itself and its children (otherwise the letter wraps differently from the design's).
- **Copy order:** the clipboard API first, the design's `execCommand` fallback second (the design tries them the other way round); same labels and messages.
- **Local Postgres:** none was running; a throwaway `postgres:18-alpine` on 127.0.0.1:54322 with the roles `anon`, `authenticated` and `service_role` before `drizzle-kit push`, stopped afterwards.

## Key decisions

| Topic | Decision |
|---|---|
| URL | `/muster-kuendigung`, `ROUTE_MUSTER_KUENDIGUNG` in `$lib/routes.ts`: the footer's label without the umlaut. Not confirmed (gate §4.4) |
| Route group | `(landing-page)`, outside `[[preview=preview]]` |
| Indexing | `seo.noindex = true` and out of the sitemap until the cutover; then indexed and in the sitemap (decision of 2026-10-17), so its gate (§4.4) blocks the cutover PR (#440) |
| Header | The shared `LandingHeader` with `DEFAULT_CHROME` (the design's banner is the same) |
| Content | Every text in `content.ts`, word for word, including the letter's sentences, the placeholders ("[Name der Verwaltung]" …) and the messages |
| The letter | `letter.ts` (pure) is the design's `build()`: paragraphs (`ab`, `to`, `dt`, `bt`, `p`, `sg`) of lines of segments, a segment marked as a placeholder when its field is empty. Nothing is stored or sent ("Diese Seite speichert und versendet nichts", FAQ 4): the fields are plain `$state` in the generator, no `name`, no form action, no `localStorage` |
| The letter's date | The design writes the browser's local date ("Berlin, 19.10.2026"). Here it's today in Europe/Berlin from the page's `DeadlineClock` (started at `load`'s `now`, ticking in the browser), so SSR and hydration agree and no component calls `Date.now()` |
| Word file | `docx.ts` writes the design's three parts (`[Content_Types].xml`, `_rels/.rels`, `word/document.xml` with its runs: Arial 11 pt, the spacing, the right-aligned date, the bold subject, the empty paragraph before the signature, A4 with its margins) into a ZIP with stored entries (JSZip's default too) and a CRC-32: about 80 lines, no dependency. Characters XML forbids are dropped |
| PDF | `pdf.ts` writes a PDF 1.4 with the two standard fonts Helvetica and Helvetica-Bold (WinAnsiEncoding, not embedded, as jsPDF), the design's layout (A4, 11 pt, x 25 mm, width 160 mm, start 28 mm, line 5.6 mm, a new page below 275 mm at 25 mm, the paragraph gaps 9 / 6 / 3.5 mm, 14 mm before the signature, the date right-aligned) and jsPDF's line breaking by the fonts' AFM widths (`helvetica.ts`). A character outside WinAnsi becomes "?" (jsPDF's standard fonts can't show it either) |
| Loading | The Word and PDF writers load on the first click (`import()`), as the design loads its libraries; the button reads "Wird erstellt …" and is disabled meanwhile |
| Download | A Blob behind an object URL and a clicked `<a download>`, revoked after 1.5 s: the design's fallback path. The message "Download gestartet: <Datei>" and the confetti from the button; on an error "Der Download ist hier gerade nicht möglich. Nutzen Sie „Text kopieren“ …" in the error colour. The design's other branch (the artifact runtime's `downloads`, "Gespeichert: … Jetzt unterschreiben und nachweisbar versenden.", "Ein Download wartet noch auf Ihre Bestätigung.") has no case here |
| File name | The design's `Kuendigung-<Messdienst>.<ext>` (special characters dropped, spaces to dashes; "Messdienst" when the field is empty). When the name has only special characters the design writes `Kuendigung-.docx`; here it falls back to "Messdienst" too |
| Without JS | The preview is server-rendered with every placeholder and today's date, so the template reads and can be selected; the form fields render but change nothing, the download and copy buttons are hidden (`@media (scripting: none)`), the checklist cards stay unticked (they're buttons) |
| Preview and screen readers | The design makes the preview `aria-live="polite"`, which would read the whole letter on every keystroke. Not ported: the preview is a labelled region (`role="document"`, "Vorschau der Kündigung"), the status line under the buttons stays `role="status"` |
| Checklist | Four `aria-pressed` buttons; the bar and "n von 4 geprüft" follow; the first time all four are ticked the line reads "Alles geprüft. Bereit zum Versand." and the confetti bursts from the last card (the design's `PG.confetti`, `confettiFrom`); the count line is `aria-live="polite"` (the design has none) |
| Hero letter | Server-rendered in its end state (the signature drawn, both badges shown). The signature's drawing (2.2 s from 0.6 s) and the badges' pop (2.4 / 2.6 s) are CSS animations with a `both` fill, so they play from the first paint on load, as the design's (the hero is in view at once, so its `PG.onShow` fires at once), and with reduced motion (the landing reset turns animations off) the end state stays. The top sheet's 6 s float pauses while the hero is out of view (`inView`) |
| Signup and CTAs | The closing card gets the `SignupForm` and `id="start"` in place of the design's video button "Demo buchen" (as on `/presse`); the submit label is "Demo buchen". The dark card's "Demo buchen →" leads to `#start` and focuses the e-mail field. Leads: `source: "muster-kuendigung"`, `switchinquiry` with `page: "/muster-kuendigung"`. Open question 1 |
| FAQ | The shared `Faq` `split` variant (the design's `.dm-faq` / `.faq2`: the title left, the four questions right, all closed, the plus turning 45°), with its FAQPage JSON-LD |
| Styling | Component-scoped CSS from the design; breakpoints the design's (1040 and 640 px for `kd-` and `pg-`; `#hs-css` 1040/620, which also enlarges the dark card's H2 between 621 and 1040 px, as the design does). No class that is also a Tailwind utility |

## Open questions (the default is built unless answered)

1. **Closing card.** The design's video button "Demo buchen" leads to a booking page that doesn't exist. *Default: the signup form with "Demo buchen" as its button.*
2. **"Vertragsenden prüfen".** The Portfolio-Checker has no page. *Default: hidden until it exists.*
3. **The letter's wording.** A template others sign and send: legal review of every sentence (README, Risks). *Default: the design's text.*

## Risks

- **Every gate is on the cutover's critical path** (04 §4.4–4.29).
- **A legal template.** Visitors send this letter to end contracts: "hiermit kündigen wir den bestehenden Vertrag über Messdienstleistungen (insbesondere Ablesung, Abrechnung sowie Miete und Wartung der Messgeräte) … fristgerecht zum nächstmöglichen Zeitpunkt", the clauses on the devices, the readings, the power of attorney and the data deletion, and the checklist's advice ("Viele Messdienstverträge verlängern sich automatisch …", "per Einschreiben mit Rückschein", "sollte ein Beschluss oder eine Vollmacht vorliegen"). The disclaimer "Vorlage ohne Gewähr, keine Rechtsberatung." stays under the buttons. Mitigation: legal sign-off in §4.4, word for word.
- **Files that open everywhere.** A hand-written DOCX and PDF must open in Word, Pages, LibreOffice, Google Docs, Acrobat, Preview and the browsers' viewers. Mitigation: unit tests of the ZIP (CRC, offsets, the parts) and the PDF (the xref offsets, the fonts, line breaking); in QA the files opened in macOS's text system (`textutil`) and Preview (`sips`), and the manual check in Word and Acrobat in §4.1.
- **"Speichert und versendet nichts."** The promise of FAQ 4 must stay true. Mitigation: the e2e test types into the form, downloads both files and checks that no request leaves the page after hydration.

## Out of scope

- The design's nav, footer, chat button, `#top-js`, `#mobfx`, `#eb-js`, `#pillfx` beyond the pills' icon hover, `#end-css`, `#fx-js` (the design footer's newsletter; ours is the shared footer), `#demo-css` beyond the blocks above, `PG.countUp` / `tween` / `seg` / `paintRange` (unused by this page), the design's `.kd-pv .chg` highlight (styled but never set by its script), the design's own smooth anchor scrolling (app.css scrolls smoothly), the artifact runtime's `downloads` capability.
- Saving the form between visits, sending the letter, a server-side generator.
