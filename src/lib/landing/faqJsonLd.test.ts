import { describe, expect, it } from "vitest";
import { faqJsonLd } from "./faqJsonLd";

const parse = (tag: string) =>
	JSON.parse(
		tag.slice(
			'<script type="application/ld+json">'.length,
			-"</script>".length,
		),
	);

describe("faqJsonLd", () => {
	it("has one entry per item", () => {
		const data = parse(
			faqJsonLd([
				{ question: "A?", answer: "Ja." },
				{ question: "B?", answer: "Nein." },
			]),
		);
		expect(data["@type"]).toBe("FAQPage");
		expect(data.mainEntity).toEqual([
			{
				"@type": "Question",
				name: "A?",
				acceptedAnswer: { "@type": "Answer", text: "Ja." },
			},
			{
				"@type": "Question",
				name: "B?",
				acceptedAnswer: { "@type": "Answer", text: "Nein." },
			},
		]);
	});

	it("escapes < so the data can't close the script", () => {
		const tag = faqJsonLd([{ question: "</script>?", answer: "<b>Ja</b>" }]);
		expect(tag.match(/<\/script>/g)).toHaveLength(1);
		expect(parse(tag).mainEntity[0].acceptedAnswer.text).toBe("<b>Ja</b>");
	});
});
