import type { Attachment } from "svelte/attachments";
import { slideDown, slideUp } from "$lib/utils/slide";

/**
 * Opens or closes the element with the height animation the Next site used.
 * Unlike `transition:slide`, closed content stays in the DOM (hidden by CSS),
 * so it remains in the server-rendered HTML.
 */
export function slideToggle(
	open: boolean,
	duration = 300,
): Attachment<HTMLElement> {
	return (el) => {
		if (open) slideDown(el, duration);
		else slideUp(el, duration);
	};
}
