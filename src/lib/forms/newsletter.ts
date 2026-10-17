import { z } from "zod";

/** Newsletter signup email (site footer, blog `Subscription`, landing footer). */
export const newsletterEmailSchema = z.email(
	"Bitte geben Sie eine gültige E-Mail-Adresse ein.",
);
