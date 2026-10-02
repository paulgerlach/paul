import * as prismic from "@prismicio/client";
import type { CreateClientConfig } from "@prismicio/svelte/kit";
import type { Content } from "@prismicio/client";
import { createClient } from "$lib/prismicio";

const newestFirst = {
	field: "document.first_publication_date",
	direction: "desc",
} as const;

export async function getAllBlogPosts(
	config: CreateClientConfig,
	{ tags }: { tags?: string[] } = {},
) {
	return createClient(config).getAllByType("blogpost", {
		orderings: newestFirst,
		filters: tags ? [prismic.filter.any("document.tags", tags)] : [],
	});
}

function findSlice<
	T extends Content.BlogpostDocument["data"]["slices"][number],
>(post: Content.BlogpostDocument, type: T["slice_type"]) {
	return post.data.slices.find((slice) => slice.slice_type === type) as
		T | undefined;
}

export type NavPost = {
	uid: string;
	title: string;
	subtitle: string;
	image: { url: string; alt: string } | null;
};

/** The six newest posts, reduced to what the header nav shows (KI-07). */
export async function getNavPosts(
	config: CreateClientConfig,
): Promise<NavPost[]> {
	const { results } = await createClient(config).getByType("blogpost", {
		orderings: newestFirst,
		pageSize: 6,
	});

	return results.map((post) => {
		const image = findSlice<Content.BlogImageSlice>(post, "blog_image")?.primary
			.blogMainImage;
		return {
			uid: post.uid ?? "",
			title:
				findSlice<Content.MainTitleSlice>(post, "main_title")?.primary
					.maintitle || "",
			subtitle:
				findSlice<Content.SubtitleSlice>(post, "subtitle")?.primary.subtitle ||
				"",
			image: image?.url ? { url: image.url, alt: image.alt || "" } : null,
		};
	});
}
