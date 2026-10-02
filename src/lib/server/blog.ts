import * as prismic from "@prismicio/client";
import type { CreateClientConfig } from "@prismicio/svelte/kit";
import type { Content, ImageField } from "@prismicio/client";
import { createClient } from "$lib/prismicio";

const newestFirst = {
	field: "document.first_publication_date",
	direction: "desc",
} as const;

type Slice = Content.BlogpostDocument["data"]["slices"][number];

function findSlice<T extends Slice>(
	post: Content.BlogpostDocument,
	type: T["slice_type"],
) {
	return post.data.slices.find((slice) => slice.slice_type === type) as
		T | undefined;
}

/** What blog cards and the nav teaser show; keeps full documents off the client. */
export type PostSummary = {
	uid: string;
	title: string;
	subtitle: string;
	/** `creationdate` of the BlogImage slice, as shown on the cards. */
	date: string | null;
	tags: string[];
	image: ImageField;
};

function toSummary(post: Content.BlogpostDocument): PostSummary {
	const image = findSlice<Content.BlogImageSlice>(post, "blog_image")?.primary;
	return {
		uid: post.uid ?? "",
		title:
			findSlice<Content.MainTitleSlice>(post, "main_title")?.primary
				.maintitle || "",
		subtitle:
			findSlice<Content.SubtitleSlice>(post, "subtitle")?.primary.subtitle ||
			"",
		date: image?.creationdate ?? null,
		tags: post.tags,
		image: image?.blogMainImage ?? { url: null, alt: null, copyright: null },
	};
}

/** All posts (optionally only those with one of `tags`), newest first. */
export async function getAllBlogPosts(
	config: CreateClientConfig,
	{ tags }: { tags?: string[] } = {},
): Promise<PostSummary[]> {
	const posts = await createClient(config).getAllByType("blogpost", {
		orderings: newestFirst,
		filters: tags?.length ? [prismic.filter.any("document.tags", tags)] : [],
	});
	return posts.map(toSummary);
}

/** The `limit` newest posts. */
export async function getLatestPosts(
	config: CreateClientConfig,
	{ limit }: { limit: number },
): Promise<PostSummary[]> {
	const { results } = await createClient(config).getByType("blogpost", {
		orderings: newestFirst,
		pageSize: limit,
	});
	return results.map(toSummary);
}

/** The six newest posts for the header nav (KI-07). */
export const getNavPosts = (config: CreateClientConfig) =>
	getLatestPosts(config, { limit: 6 });

/** Passed to the blog post's `<SliceZone>` as `context`. */
export type BlogContext = {
	tags: string[];
	/** Resolved here because slices can't load data themselves (Next's BlogAuthor did). */
	author: Content.AuthorDocument | null;
};

/** A post with its author, or `null` if the UID doesn't exist. */
export async function getBlogPost(config: CreateClientConfig, uid: string) {
	const client = createClient(config);
	const post = await client.getByUID("blogpost", uid).catch((e) => {
		if (e instanceof prismic.NotFoundError) return null;
		throw e;
	});
	if (!post) return null;

	const link = findSlice<Content.BlogAuthorSlice>(post, "blog_author")?.primary
		.blogauthor;
	const author =
		link && "uid" in link && link.uid
			? await client.getByUID("author", link.uid).catch(() => null)
			: null;

	return { post, author };
}

/** Every post's URL and last change, for the sitemap. */
export async function getSitemapPosts(config: CreateClientConfig) {
	const posts = await createClient(config).getAllByType("blogpost", {
		orderings: newestFirst,
		fetch: [],
	});
	return posts.map((post) => ({
		uid: post.uid ?? "",
		lastmod: post.last_publication_date,
	}));
}
