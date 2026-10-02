import { getAllBlogPosts } from "$lib/server/blog";

export const load = async ({ fetch, cookies, url }) => {
	// One query for everything: the newest three, the tag list (from all posts,
	// so it doesn't shrink while a filter is active) and the filtered list.
	const posts = await getAllBlogPosts({ fetch, cookies });
	const tag = url.searchParams.get("tag");

	return {
		newest: posts.slice(0, 3),
		posts: tag ? posts.filter((post) => post.tags.includes(tag)) : posts,
		tags: [...new Set(posts.flatMap((post) => post.tags))],
		activeTag: tag ?? "Alle",
	};
};
