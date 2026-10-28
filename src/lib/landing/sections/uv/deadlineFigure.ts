/**
 * The bento's retrofit-deadline figure, shared by the `uv` pages that show it
 * (/plattform/verbrauchsinformation, /kunden/hausverwaltung and the other segment pages): the
 * date until the deadline, then its expired text. Pages pick it in `load`
 * with `now`, so components never read the clock.
 */
import { isExpired } from "$lib/landing/deadline/deadline";
import type { Figure } from "./types";

export const DEADLINE_FIGURE = {
	current: {
		value: "31.12.2026",
		text: "Bis dahin müssen alle Zähler fernablesbar sein",
		compact: true,
	} satisfies Figure as Figure,
	// Placeholder until the content owner writes it (go-live gates of the pages).
	expired: {
		value: "1.1.2027",
		text: "Seitdem müssen alle Zähler fernablesbar sein",
		compact: true,
	} satisfies Figure as Figure,
};

/** The deadline's figure for `now`. */
export function deadlineFigure(now: number): Figure {
	return isExpired(now) ? DEADLINE_FIGURE.expired : DEADLINE_FIGURE.current;
}
