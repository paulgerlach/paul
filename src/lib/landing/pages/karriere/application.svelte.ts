/**
 * The role chosen for an application, shared by every "bewerben" link on
 * /karriere (`components/ApplyLink.svelte`) and the form's `<select>`.
 */
import { getContext, setContext } from "svelte";
import { ROLE_IDS, type RoleId } from "$lib/forms/application";
import { prefersReducedMotion } from "$lib/landing/motion";

export const APPLY_ID = "bewerben";
export const NAME_FIELD_ID = "kr-n";

export class Application {
	role = $state<RoleId>(ROLE_IDS[0]);

	/**
	 * Chooses a role, scrolls to the form and focuses the name field once the
	 * scroll ends (the 72 px header offset is the section's scroll-margin-top).
	 */
	apply(role: RoleId) {
		this.role = role;
		const section = document.getElementById(APPLY_ID);
		const field = document.getElementById(NAME_FIELD_ID);
		if (!section) return;
		const instant = prefersReducedMotion();
		section.scrollIntoView({ behavior: instant ? "auto" : "smooth" });
		if (!field) return;
		if (instant) {
			field.focus({ preventScroll: true });
			return;
		}
		// `scrollend` isn't in every browser yet; the timer is the design's.
		let done = false;
		const focus = () => {
			if (done) return;
			done = true;
			clearTimeout(timer);
			window.removeEventListener("scrollend", focus);
			field.focus({ preventScroll: true });
		};
		const timer = setTimeout(focus, 600);
		window.addEventListener("scrollend", focus, { once: true });
	}
}

const KEY = Symbol("application");

export function setApplication() {
	return setContext(KEY, new Application());
}

export function getApplication(): Application {
	return getContext(KEY);
}
