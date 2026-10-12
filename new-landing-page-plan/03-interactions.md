# Phase 3: Interactions

The rules match the other landing pages: runes and the existing attachments, no new dependencies, timers and observers only in the browser and cleaned up on teardown. `prefersReducedMotion()` renders the end state, and the server markup is the end state, so no-JS and above-the-fold content never flashes or stays hidden.

## 3.1 Hero feed ("Ein Tag bei Heidi")

In the design, a new event slides in at the top every 2.6 s (`kr-in`: 10 px drop + fade, .5 s), and once there are more than 5 the oldest fades out (`kr-out`, .4 s) and is removed. The interval starts when the feed is shown and runs forever. The dot blinks forever.

- State: `let items = $state<{ key: number; event: FeedEvent }[]>()` initialised with the first 4 (keys 0–3), and a plain `let next = 4` counter. `tick()` prepends `EV[next % 7]` with key `next++` and drops the last item when there are more than 5.
- Markup: keyed `{#each items as item (item.key)}`. Items added in the browser get the `kr-in` keyframe through a class (`new`), so the server's first 4 don't animate on load. The leaving item uses an `out:` transition with the `kr-out` keyframe's values (a small `css` transition function, no library).
- Timer: a `setInterval(tick, 2600)` that runs only while all of these hold: in view (`inView` attachment), `document.visibilityState === "visible"`, not paused, and no reduced motion. It's created and cleared in an `$effect` on those flags. The design never stops; we stop off-screen.
- Pause: a small icon button in the feed header ("Animation anhalten" / "Animation fortsetzen", `aria-pressed`). It's rendered after mount and not at all with reduced motion. Hovering or focusing the feed also pauses it. Paused, the dot stops blinking.
- Reduced motion: no ticker, no blink. The server's 4 items stay.
- A11y: the list has no `aria-live`. The feed wrapper is `role="group"` with the design's aria label.

## 3.2 Areas

- `let area = $state<AreaId>("eng")`, bound to `Segmented`. The panel renders `content.areas` for that id inside `{#key area}` with the design's `.in` (`kr-in`, .45 s) on the text and list. There's no animation with reduced motion, and the panel's `min-height: 250px` keeps the layout from jumping.
- The design writes the panel with `innerHTML` and re-binds its `data-role` links; we render from content, and the link is an `ApplyLink`.

## 3.3 Choosing a role

- `ApplyLink` props: `role`, `class`, children. It renders `<a href="#bewerben">` with `onclick={(e) => { e.preventDefault(); application.apply(role); }}`. Without JS, it's a normal anchor.
- In `ApplicationForm`, the `<select name="role">` uses `bind:value={application.role}`. On a validation error, superforms returns the submitted role, which already equals `application.role`, so there's no syncing and no `$effect`.
- The job cards' "Auf diese Stelle bewerben", the open application's "Initiativ bewerben", the area panel's "bewerben" and the hero's "Initiativ bewerben" all use `ApplyLink`.

## 3.4 Form

- Superforms with `use:enhance`, the zod schema on the client too (`validators: zod4Client(applicationSchema)`). Errors appear only after the first submit (as on the other landing forms). `_t` is re-stamped on mount (CDN-cached page).
- Error line: the design shows one sentence, "Bitte ergänzen Sie Ihren Namen und eine gültige E-Mail-Adresse." It's built from the name/email errors ("Ihren Namen", "eine gültige E-Mail-Adresse", joined by " und "). A link error gets its own sentence. The fields get the `.bad` border and `aria-invalid`.
- While submitting: the button is disabled and reads "Wird gesendet …" (`$submitting`). No artificial delay, unlike the design's 800 ms `setTimeout`.
- Success (the message type is `success`): the form gets `.sent`, the dark overlay fades in, and the check circle pops (`cubic-bezier(.3,1.6,.5,1)`). The text names the chosen role (`successText(formLabel)`). `confetti.ts` bursts from the check circle inside the form, but not with reduced motion. Focus moves to the overlay's heading (`tabindex="-1"`), so keyboard and screen-reader users notice the change, and the fields behind it get `inert`.
- "Weitere Bewerbung": `<a href="/karriere#bewerben">`, so it works without JS (a fresh page). With JS, it resets the form (`reset()`, role back to the first job), removes `.sent` and focuses the name field.
- Send error (status 502): the error line shows the message with the fallback address as a `mailto:` link. Values stay.
- Without JS: the post reloads the page at the form (the action's response renders `#bewerben` with errors or the success overlay; add `#bewerben` to the form's `action` so the browser scrolls there).

## 3.5 Reveal and the rest

- `{@attach reveal()}` on `<main>` with the design's `.rv` transition styles, the same as `/ueber-uns`. The trust cards keep their own reveal.
- The `<details>` cards need no JS. The `+` rotation and border change are CSS on `[open]`, with no transition under reduced motion.
- The design's pill hover wiggles (`#pillfx`) aren't ported, the same as on the other landing pages.
