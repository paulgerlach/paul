import type { ParamMatcher } from "@sveltejs/kit";

/**
 * Prismic preview sessions run under `/preview/…` (see `redirectToPreviewURL`
 * and `<PrismicPreview>`). Draft content therefore never shares a URL, and a
 * CDN cache entry, with the published page.
 */
export const match = ((param: string): param is "preview" =>
	param === "preview") satisfies ParamMatcher;
