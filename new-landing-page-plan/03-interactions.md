# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, listeners and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` means instant scrolling and no transitions. The server markup is a complete page for `/hilfe` and `/hilfe?q=…`, so no-JS visitors get the same list, only filtered by submitting the form.

## 3.1 Live search

- `SearchBox` binds the input to `search.query`. `search.results` is `$derived`, so topics, questions, highlights, the result line and `NoResults` follow on every keystroke. No `$effect` syncs any of it.
- Auto-open: when a query change gives 1–3 results, their ids are added to `search.open` (in the `oninput` handler, not an effect). Opened cards stay open when the query is cleared, as in the design.
- The form's `onsubmit` prevents the navigation with JS (the list is already filtered) and blurs nothing; on mobile, `enterkeyhint="search"` closes the keyboard via the submit.
- URL: on input, a 300 ms debounced `replaceState` from `$app/navigation` writes `?q=…` (or removes it), so reload, back/forward and sharing keep the query. The timer is cleared on teardown.
- The result line is `aria-live="polite"` and only changes with the query, so screen readers hear "3 Ergebnisse für „uvi“" once the typing settles. The debounce of the live region text is the same 300 ms, so it isn't announced per keystroke.

## 3.2 Keyboard

- `/` focuses the search (`<svelte:document onkeydown>`), but only when no modifier is held and focus isn't in an `input`, `textarea`, `select` or `contenteditable` (the design steals `/` from every field, including the footer's newsletter input).
- `Escape` in the search field clears it (and the URL's `q`). The native `type="search"` clear button does the same through `oninput`.

## 3.3 Popular questions

`<a href="#q-<id>">` with an `onclick` that, with JS: clears the query, adds the id to `search.open`, scrolls the card to the centre (`block: "center"`, smooth or `auto` with reduced motion) after the DOM update (`tick()`), and adds `.flash` for 1.2 s. `preventDefault` so the hash scroll doesn't fight the centred one; `history.replaceState` sets the `#q-<id>` hash so the link is shareable. Without JS: the browser jumps to the closed card.

## 3.4 Deep links and topic cards

- On mount and on `hashchange`: a `#q-<id>` hash for a known question clears the query if that question is hidden, opens it and scrolls it into view; a `#c-<id>` hash does nothing more than the browser's jump. `ontoggle` on each `<details>` keeps `search.open` in sync with the user's own clicks.
- Topic cards (`href="#c-<id>"`): with JS, the click clears the query (so the topic isn't hidden) and opens the topic's first question, as the design does. The design opens it after 400 ms; we open it right away, before the smooth scroll starts, so the scroll target is final. The 96 px offset is the section's `scroll-margin-top`, so the design's scroll script isn't needed.

## 3.5 Topic scroll-spy

An attachment on `Toc` observes the 6 topic sections with `IntersectionObserver({ rootMargin: "-30% 0px -60% 0px" })` (the design's) and sets the active id in a local `$state`; the link gets `.on` and `aria-current="location"`. Hidden topics (search) are skipped. The observer is disconnected on teardown. Nothing is created below 900 px, where the list is hidden (`matchMedia`, re-checked on change).

## 3.6 Feedback

- One superform for the page (`superForm(data.feedbackForm, { id: "help-feedback", resetForm: true })`), shared by all 22 `Feedback` forms through the `HelpSearch` context, each with its own hidden `question`. With `use:enhance`, a click posts in the background; the voted ids go into a `SvelteSet` and their form shows "Danke für Ihr Feedback!" (`role="status"`), the buttons go away. The answer is always success (phase 1.6), so there's no error state.
- Voting twice on the same question in one visit isn't possible (the buttons are gone); a reload allows it again. No `localStorage`.
- Without JS: the post reloads the page at `#q-<id>` (the form's `action`), and the action's message (`question`) marks that one as voted in the server render, with its card open.
- While a vote is in flight, both buttons are disabled.

## 3.7 Reveal and the rest

- `{@attach reveal()}` on `<main>` with the design's `.rv` transition styles, the same as `/karriere`. Hidden questions and topics aren't `.rv`, so the search never waits for a reveal. The trust cards keep their own reveal.
- The `<details>` cards need no JS. The `+` → `−` rotation, the dark fill and the border change are CSS on `[open]`, with no transition under reduced motion.
- The design's global smooth-scroll handler for `a[href^="#"]` isn't ported; `scroll-margin-top` and `app.css`'s `html { scroll-behavior: smooth }` do the same, as on the other landing pages. That rule has no reduced-motion exception yet; add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }` to `$lib/landing/tokens.css`.
