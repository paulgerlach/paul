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

/**
 * Limits summary queries to the slice fields `toSummary` reads. Full documents
 * are ~11 KB each (4.5 MB per 100 posts on /blog); this cuts that ~34x. The
 * API's parser needs one field per line.
 */
const summaryGraphQuery = `{
blogpost {
slices {
...on main_title {
variation {
...on default {
primary {
maintitle
}
}
}
}
...on subtitle {
variation {
...on default {
primary {
subtitle
}
}
}
}
...on blog_image {
variation {
...on default {
primary {
creationdate
blogMainImage
}
}
}
}
}
}
}`;

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

type Client = ReturnType<typeof createClient>;

/**
 * Every blog post matching `params`, newest first. Replaces `getAllByType`,
 * which sleeps 500 ms between pages (~1 s for the 237 posts); this reads the
 * page count from page 1 and fetches the rest in parallel.
 */
async function getAllPosts(
	client: Client,
	params: Parameters<Client["getByType"]>[1],
) {
	const query = { ...params, orderings: newestFirst, pageSize: 100 };
	const first = await client.getByType("blogpost", query);
	const rest = await Promise.all(
		Array.from({ length: first.total_pages - 1 }, (_, i) =>
			client.getByType("blogpost", { ...query, page: i + 2 }),
		),
	);
	return [first, ...rest].flatMap((page) => page.results);
}

/** All posts (optionally only those with one of `tags`), newest first. */
export async function getAllBlogPosts(
	config: CreateClientConfig,
	{ tags }: { tags?: string[] } = {},
): Promise<PostSummary[]> {
	const posts = await getAllPosts(createClient(config), {
		graphQuery: summaryGraphQuery,
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
		graphQuery: summaryGraphQuery,
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
	// uid and dates are metadata, returned regardless. `fetch: []` would be
	// ignored and return full documents (~4.5 MB per 100 posts).
	const posts = await getAllPosts(createClient(config), {
		fetch: ["blogpost.uid"],
	});
	return posts.map((post) => ({
		uid: post.uid ?? "",
		lastmod: post.last_publication_date,
	}));
}
