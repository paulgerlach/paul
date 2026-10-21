import { ROUTE_DEMO_BUCHEN, ROUTE_KARRIERE } from "$lib/routes";

/**
 * Anchor of the page's signup form (the hero's on most pages, the final
 * CTA's on /upgrade-now). Every "start" CTA on the page links here.
 */
export const START_HREF = "#start";
export const HERO_EMAIL_ID = "email-top";

/**
 * Click handler for links to `#start`: the browser scrolls to the form as
 * usual, and its email field gets focus so the visitor can type right away.
 * `preventScroll` keeps focus from cutting the smooth scroll short.
 */
export function focusSignup() {
	requestAnimationFrame(() =>
		document
			.querySelector<HTMLInputElement>(`${START_HREF} input[name="email"]`)
			?.focus({ preventScroll: true }),
	);
}

/**
 * Target of every "Demo buchen" CTA (and the other links the designs point at
 * the booking design, such as the floating "Erstgespräch vereinbaren"): the
 * /demo-buchen page. Set another URL here to switch all of them at once.
 */
export const DEMO_HREF: string = ROUTE_DEMO_BUCHEN;

/**
 * Target of every careers link ("Karriere bei Heidi", "Zur Karriereseite"):
 * the /karriere page. Set another URL here to switch all of them at once.
 */
export const CAREERS_HREF: string = ROUTE_KARRIERE;
/** Target of the "Offene Stellen" links: the job list on /karriere. */
export const CAREERS_JOBS_HREF = `${ROUTE_KARRIERE}#stellen`;
