import type { Attachment } from "svelte/attachments";

/**
 * Gives the matching headings in a row the same min-height, so the paragraphs
 * under them start on one line. Only applies while they sit side by side;
 * once the row stacks, the headings keep their own height.
 */
export function equalHeights(selector: string): Attachment<HTMLElement> {
	return (el) => {
		const update = () => {
			const items = [...el.querySelectorAll<HTMLElement>(selector)];
			for (const item of items) item.style.minHeight = "";
			if (items.length < 2) return;
			const tops = items.map((item) => item.getBoundingClientRect().top);
			if (!tops.every((top) => Math.abs(top - tops[0]) < 4)) return;
			const max = Math.max(...items.map((item) => item.offsetHeight));
			for (const item of items) item.style.minHeight = `${max}px`;
		};

		// Only width changes matter. Height changes are caused by update()
		// itself, and reacting to them would loop.
		let width = -1;
		const observer = new ResizeObserver(([entry]) => {
			if (entry.contentRect.width === width) return;
			width = entry.contentRect.width;
			update();
		});
		observer.observe(el);
		document.fonts?.ready.then(update);
		return () => observer.disconnect();
	};
}
