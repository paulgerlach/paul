import { TOPIC_LABELS, type Story, type Topic } from "./content";

/** The filter's choice: a topic, or every story. */
export type Choice = Topic | "all";

/** The filter's options in the design's order ("Alle" first). */
export const filterOptions = (allLabel: string) => [
	{ value: "all" as Choice, label: allLabel },
	...(Object.keys(TOPIC_LABELS) as Topic[]).map((topic) => ({
		value: topic as Choice,
		label: TOPIC_LABELS[topic],
	})),
];

/** Whether a story shows under the choice (the design's `.hide`). */
export const shows = (choice: Choice, story: Story) =>
	choice === "all" || story.topic === choice;

/** The live region's text after a change: "9 Meldungen", "1 Meldung". */
export const countText = (n: number) =>
	`${n}\u00a0${n === 1 ? "Meldung" : "Meldungen"}`;
