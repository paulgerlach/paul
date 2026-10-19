# Phase 2: The sections

## 2.1 The page

Page-only components in `$lib/landing/pages/hkvo-leitfaden/`. The page's `<main class="lf">` holds the design's `.dm` tokens (`--bg`, `--hair`), `.pg-sec` (104 px, 72 px at 640 px and below, the top hairline, `.alt` grey), the reveal transition and `#hs-css`'s heading sizes, as `/fristenrechner`'s page does.

| # | Section | Design | Component | Notes |
|---|---|---|---|---|
| 1 | Hero | `.pg-hero` | `Hero` + `Check` | Grey (`--bg`), 72/88 px (44/60 at 640 px), bottom hairline; `.pg-grid` (1fr and up to 560 px, 64 px gap; one column at 1040 px, 44 px gap). Pill with the document icon (`#pillfx` hover), H1 (`.pg-h1` 38–64 px, accent `--ok`), lead (52 ch), the CTAs (`.bk-next` dark and `.pg-ghost`, both with ↓; stacked and centred at 640 px), the ticks (`.pg-ticks` with the green `.okb` circles). As `/fristenrechner`'s hero |
| 1a | Schnell-Check | `.lf-chk` | `Check` | White card, 22 px radius, 20 px padding, the long soft shadow. Head (`.lf-ch`): "Schnell-Check" (16 px, 600) and its sub (12.5 px muted), the 52 px ring (stroke 4, grey track, green arc from the top with round caps; the score "0/5" 12 px bold in its middle) under a hairline. Five rows (`.lf-qi`, 11 px padding, a light hairline): the question (13.5 px) with its paragraph below (11.5 px faint), the two buttons (12.5 px, 8 px radius; "Ja" chosen green, "Nein" chosen red-orange); at 560 px the buttons go under the question. The result (`.lf-out`, 13 px, at least 20 px high): the faint hint, the green "Alles erfüllt" box with its tick, the light-orange risk box (the title in `#A8431A`, the list, the link in `--ok`), or the faint "Noch N Fragen offen." |
| 2 | Guide | `.pg-sec#leitfaden` | `Guide` | Two columns (260 px and the rest, 64 px gap). The TOC (`.lf-toc`, sticky at 96 px): "INHALT" (11.5 px, spaced capitals, faint), nine links (14 px muted, the number 11 px faint and tabular; hover grey; `on` light green with the number in `--ok`), the 3 px progress bar. The body (max 760 px, 18 px gaps): nine white cards (18 px radius, 28/30 px padding; 22/18 px at 560 px): the number (12 px faint) and the paragraph chip (`.lf-par`, 12 px green on light green), the H2 (22–26 px, 500), paragraphs (16 px, 1.65, `#3E4D49`; links in `--ok`), the bullet list (`.lf-ul`, 8 px `--accent` dots), the note (`.lf-note`, grey box with the info icon in `--ok`). At 900 px one column (24 px gap): the TOC a static white card (16 px radius, 14 px padding) with the links in two columns and no bar; at 560 px one column of links |
| 3 | Penalties | `.pg-sec.alt#kuerzung` | `Penalties` | `SectionHead` centred (pill with the warning icon, H2 without a muted part); three white cards in a row (one at 900 px), 14 px gaps, 48 px below the head: the figure (44 px, 500, `#A8431A`), H3 17 px 600, text 15 px muted. The design's `.lf-cta` line hidden (README, open question 1) |
| 4 | FAQ | `.pg-sec` with `.xfq` | `Faq` → shared `Faq` | White band with the top hairline, the centred H2 (`.dm-h2 c`), the list 1100 px wide, 56 px below; first answer open; the toggles white; links in `--ok`, 600 |
| 5 | Closing | `.dm-end` | `Closing` → shared `CtaCard` | `id="start"`, `final`, the text under the heading (`#dcta-css`), the `SignupForm` in place of the video button |
| 6 | Trust | `.trust` | shared `TrustSeals` | |
| — | Floating CTA | `.ctab` | shared `FloatingCta` | |

Icons: the design's 20×20 stroke icons (document, warning, info) as paths in the hero's pill, `SectionHead`'s `icon` snippet and the notes; the check's ticks the shared `Check`.

## 2.2 End states (server, no JS, reduced motion)

- The check: unanswered (ring empty, "0/5", the hint). Without JS the buttons, the ring and the hint are hidden; the five questions with their paragraphs stay as a list.
- The TOC: the first link `on`, the bar empty; every link is a working anchor.
- Every `.rv` block shown (the reveal only hides blocks below the fold, in the browser).
- With reduced motion: no ring or bar transition, no confetti, no pill hover movement (the landing reset turns off transitions and animations; `confettiFrom` checks).

Overflow checks at 320 px: the H1 (the soft hyphen in "Heizkostenverordnung"), the check's rows (question and buttons), the TOC card, the articles' chips ("CO2KostAufG"), the penalty figures, the closing form.
