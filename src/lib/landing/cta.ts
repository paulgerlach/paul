/** Anchor of the hero signup form. Every "start" CTA on the page links here. */
export const START_HREF = "#start";
export const HERO_EMAIL_ID = "email-top";

/**
 * Click handler for links to `#start`: the browser scrolls to the form as
 * usual, and the email field gets focus so the visitor can type right away.
 * `preventScroll` keeps focus from cutting the smooth scroll short.
 */
export function focusSignup() {
	requestAnimationFrame(() =>
		document.getElementById(HERO_EMAIL_ID)?.focus({ preventScroll: true }),
	);
}

/**
 * Target of every "Demo buchen" CTA. There's no booking URL yet, so they lead
 * to the signup form; set a URL here to switch all of them at once.
 */
export const DEMO_HREF: string = START_HREF;
