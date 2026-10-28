<!--
  Tag filter as links (?tag=…), so filtering works without JS, is shareable
  and crawlable, and re-runs the page `load` (KI-14).
-->
<script lang="ts">
	import { page } from "$app/state";
	import BlogPostsList from "./BlogPostsList.svelte";
	import type { PostSummary } from "$lib/server/blog";

	let {
		posts,
		tags,
		activeTag,
	}: { posts: PostSummary[]; tags: string[]; activeTag: string } = $props();

	const ALL = "Alle";
</script>

<div class="mx-auto flex min-h-dvh max-w-7xl flex-col gap-8 px-4 py-8">
	<div class="mb-4 flex flex-wrap items-center justify-start gap-4">
		{#each [ALL, ...tags] as tag (tag)}
			<a
				href={tag === ALL
					? page.url.pathname
					: `?tag=${encodeURIComponent(tag)}`}
				data-sveltekit-noscroll
				data-sveltekit-replacestate
				aria-current={activeTag === tag ? "page" : undefined}
				class={[
					"flex w-fit cursor-pointer items-center justify-center gap-1.5 rounded-halfbase px-5 py-2 text-center text-sm text-dark_text transition-all duration-300 hover:bg-green/80 active:bg-green/90 max-medium:py-3",
					activeTag === tag ? "bg-green" : "bg-green/30 text-gray-700",
				]}
			>
				{tag}
			</a>
		{/each}
	</div>
	<BlogPostsList {posts} />
</div>
