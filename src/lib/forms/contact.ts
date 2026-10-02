import { z } from "zod";

/**
 * The /kontakt form, validated in the browser (superforms) and again in the
 * form action. Length limits beyond the minimums are left to the server spam
 * pipeline (`$lib/server/contact`), which Next's form didn't check either.
 */
export const contactFormSchema = z.object({
	name: z.string().min(3, "Name muss mindestens 3 Zeichen lang sein"),
	email: z.email("Bitte eine gültige E-Mail-Adresse eingeben"),
	message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen enthalten"),
	infoChecked: z.boolean().refine((checked) => checked, {
		message: "Bitte akzeptieren Sie die Datenschutzbestimmungen",
	}),
	// Honeypot: invisible to real users, bots auto-fill it
	website: z.string(),
	// When the form was rendered, for the "too fast" check
	_t: z.number(),
});

export const CONTACT_SUCCESS = "Ihre Nachricht wurde erfolgreich gesendet!";
export const CONTACT_ERROR =
	"Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.";
