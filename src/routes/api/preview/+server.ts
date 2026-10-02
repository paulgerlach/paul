import { redirectToPreviewURL } from "@prismicio/svelte/kit";
import { createClient } from "$lib/prismicio";

/**
 * Entry point for Prismic's "Preview" button. Sets the preview cookie and
 * redirects to the document under /preview/… (see `src/params/preview.ts`).
 */
export const GET = async ({ fetch, request, cookies }) =>
	redirectToPreviewURL({ client: createClient({ fetch }), request, cookies });
