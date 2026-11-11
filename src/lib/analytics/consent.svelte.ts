// The cookie choice in the browser: read once on mount, changed through the
// banner (`ConsentBanner`) or the footer's "Cookie-Einstellungen". A module
// singleton, as it's client-only global state: it's only ever written in the
// browser (`restore()` runs in `onMount`), so server renders never share it.
import {
	CONSENT_KEY,
	consentUpdate,
	parseConsent,
	serializeConsent,
	type Consent,
} from "./consent";

class ConsentStore {
	/** The stored choice; null until one is made (or before `restore`). */
	choice = $state<Consent | null>(null);
	/** The banner shows: no choice yet, or reopened from the footer. */
	open = $state(false);
	/** The banner shows its category list. */
	details = $state(false);

	/** On mount: the stored choice, or the banner. */
	restore() {
		let raw: string | null = null;
		try {
			raw = localStorage.getItem(CONSENT_KEY);
		} catch {
			// Storage blocked: ask on every visit.
		}
		this.choice = parseConsent(raw, Date.now());
		this.open = !this.choice;
	}

	/** Whether analytics may set cookies (false until a choice). */
	get analytics() {
		return this.choice?.analytics ?? false;
	}

	/** Saves a choice, tells gtag (if it's loaded) and closes the banner. */
	set(analytics: boolean) {
		this.choice = { analytics, at: Date.now() };
		try {
			localStorage.setItem(CONSENT_KEY, serializeConsent(this.choice));
		} catch {
			// As above: the choice holds for this visit.
		}
		window.gtag?.("consent", "update", consentUpdate(this.choice));
		this.open = false;
		this.details = false;
	}

	/** "Cookie-Einstellungen" in the footer. */
	reopen() {
		this.details = true;
		this.open = true;
	}
}

export const consent = new ConsentStore();
