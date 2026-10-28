import { error } from "@sveltejs/kit";
import { asImageSrc } from "@prismicio/client";
import { getBlogPost, getLatestPosts } from "$lib/server/blog";
import type { SeoData } from "$lib/seo/site";

export const load = async ({ fetch, cookies, params }) => {
	const [result, latest] = await Promise.all([
		getBlogPost({ fetch, cookies }, params.uid),
		getLatestPosts({ fetch, cookies }, { limit: 4 }),
	]);
	if (!result) error(404);

	const { post, author } = result;
	const title = post.data.meta_title || "Heidi Systems";
	const description = post.data.meta_description || undefined;

	return {
		post,
		author,
		recommended: latest.filter((p) => p.uid !== post.uid).slice(0, 3),
		// Next used the generic "Heidi Systems" title for every post (KI-12).
		seo: {
			title,
			description,
			ogTitle: title,
			ogDescription: description,
			ogImage: asImageSrc(post.data.meta_image) ?? undefined,
		} satisfies SeoData,
	};
};
