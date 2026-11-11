// GA4 events of the forms and wizards. The parameter names are registered in
// GA (form_name, step_number, step_name, path, units): keep them as they are.
// Never put anything personal into an event (no names, emails, addresses,
// phone numbers, free text): only ids, counts and the path. The types allow
// nothing else.

/** The self-service check's path: with a device list or invoice ("upload")
 *  or by answering the questions ("questions"); "unknown" before it's chosen. */
export type SelfServicePath = "upload" | "questions";

export type LeadForm = "demo" | "angebot" | "kontakt" | "self_service";

type Events = {
	generate_lead: { form_name: LeadForm };
	self_service_start: { path: SelfServicePath };
	self_service_step: {
		step_number: number;
		step_name: string;
		path: SelfServicePath | "unknown";
	};
	self_service_complete: { path: SelfServicePath; units: number };
	demo_step: { step_number: number; step_name: string };
};

/** Sends a GA event; does nothing without gtag (dev, e2e, untracked pages). */
export function track<K extends keyof Events>(name: K, params: Events[K]) {
	if (typeof window === "undefined") return;
	window.gtag?.("event", name, params);
}
