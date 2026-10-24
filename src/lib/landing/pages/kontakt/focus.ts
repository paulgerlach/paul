import { FORM_ID } from "./content";

/**
 * Click handler for links to the form (the design's `data-scroll`): the
 * browser scrolls to `#schreiben` as usual, and the first name gets focus so
 * the visitor can type right away. `preventScroll` keeps focus from cutting
 * the smooth scroll short.
 */
export function focusContactForm() {
	requestAnimationFrame(() =>
		document
			.querySelector<HTMLInputElement>(`#${FORM_ID} input[name="firstName"]`)
			?.focus({ preventScroll: true }),
	);
}
