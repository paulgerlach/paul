import { z } from "zod";
import { QUESTION_IDS } from "$lib/landing/pages/hilfe/content";

/**
 * "War das hilfreich?" under every answer on /hilfe, validated in the
 * browser (superforms) and again in the form action.
 *
 * The schema imports the page content (plain data): the question ids are the
 * contract, and a vote for an unknown id is dropped.
 */
export const helpFeedbackSchema = z.object({
	question: z.enum(QUESTION_IDS as [string, ...string[]]),
	vote: z.enum(["yes", "no"]),
});

export type HelpFeedback = z.infer<typeof helpFeedbackSchema>;

/** The action's answer, always a success (a lost vote doesn't matter). */
export type HelpFeedbackMessage = { type: "success"; question?: string };
