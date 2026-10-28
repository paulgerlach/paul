import type { Attachment } from "svelte/attachments";

/** Scrolls the element to the bottom whenever what `watch` reads changes. */
export function scrollToBottom(watch: () => unknown): Attachment<HTMLElement> {
	return (el) => {
		$effect(() => {
			watch();
			el.scrollTop = el.scrollHeight;
		});
	};
}
