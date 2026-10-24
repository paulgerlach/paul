/**
 * The design's "Zusätzlich per E-Mail senden": a `mailto:` link to the
 * topic's mailbox with the message as the body, built from what the visitor
 * sent (pure; used by the form action for the success and failure answers).
 */
import { mailboxOf } from "$lib/forms/contactInquiry";
import { MAILBOXES } from "./content";

export type MailFields = {
	topic: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	company: string;
	units: string;
	message: string;
};

/** The design's body: greeting, message, then the details after "---". */
export function mailBody(f: MailFields): string {
	return [
		`Hallo Heidi-Team,\n\n${f.message}\n\n---`,
		`Anliegen: ${f.topic}`,
		`Name: ${f.firstName} ${f.lastName}`,
		f.company && `Unternehmen: ${f.company}`,
		f.units && `Einheiten: ${f.units}`,
		`E-Mail: ${f.email}`,
		f.phone && `Telefon: ${f.phone}`,
	]
		.filter(Boolean)
		.join("\n");
}

/** "<topic> · <company>", or the name without a company. */
export const mailSubject = (f: MailFields) =>
	`${f.topic} · ${f.company || `${f.firstName} ${f.lastName}`}`;

/** The topic's mailbox address. */
export const mailboxFor = (topic: string) => MAILBOXES[mailboxOf(topic)];

export const mailHref = (f: MailFields) =>
	`mailto:${mailboxFor(f.topic)}?subject=${encodeURIComponent(mailSubject(f))}&body=${encodeURIComponent(mailBody(f))}`;
