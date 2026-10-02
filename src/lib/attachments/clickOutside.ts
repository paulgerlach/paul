import type { Attachment } from "svelte/attachments";

/** Calls `handler` on a mousedown outside the element. */
export function clickOutside(handler: () => void): Attachment<HTMLElement> {
	return (el) => {
		const onMouseDown = (event: MouseEvent) => {
			if (!el.contains(event.target as Node)) handler();
		};
		document.addEventListener("mousedown", onMouseDown);
		return () => document.removeEventListener("mousedown", onMouseDown);
	};
}
