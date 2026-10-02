import { redirect } from "@sveltejs/kit";
import * as prismic from "@prismicio/client";

/** Ends a preview session. The Prismic toolbar's own "exit" works without it. */
export const GET = ({ cookies }) => {
	cookies.delete(prismic.cookie.preview, { path: "/" });
	redirect(307, "/");
};
