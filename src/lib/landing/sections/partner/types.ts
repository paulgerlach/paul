/**
 * Content shapes of the partner form section (the designs' `.ipf`), shared by
 * the "Partner" pages (/partner/installationspartner, /partner/softwarepartner). Each page
 * fills them in its `content.ts` and keeps its own fields, schema and action.
 */

/** The left column: the pill, the heading, the text and the three steps. */
export type ApplyContent = {
	pill: string;
	h2: [string, string];
	text: string;
	steps: { title: string; text: string }[];
};

/** The form's button and its message line. */
export type FormTexts = {
	submit: string;
	sending: string;
	/** After a submit with invalid fields. */
	missing: string;
	/** A failed send: the text, then the phone number as a link. */
	sendError: { text: string; phone: string; phoneHref: string };
};
