/**
 * `answer` may contain <b> and <a>; it comes from trusted content modules.
 * `more` is a link shown after the answer (without `href`: not shown, until
 * its page exists); it isn't part of the structured data.
 */
export type FaqItem = {
	question: string;
	answer: string;
	more?: { text: string; href?: string };
};

/**
 * The FAQPage structured data of `items` as a complete
 * `<script type="application/ld+json">` tag, for `{@html}` in
 * `<svelte:head>`. Answers may contain <b>, which schema.org allows; every
 * "<" is escaped, so the data can't end the script block.
 */
export function faqJsonLd(items: FaqItem[]): string {
	const json = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: { "@type": "Answer", text: item.answer },
		})),
	}).replace(/</g, "\\u003c");
	// Split so the closing tag doesn't end a <script> block it's written in.
	return `<script type="application/ld+json">${json}<` + "/script>";
}
