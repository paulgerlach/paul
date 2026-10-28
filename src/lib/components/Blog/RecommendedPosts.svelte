<script lang="ts">
	import BlogPostsList from "./BlogPostsList.svelte";
	import type { PostSummary } from "$lib/server/blog";
	import { ROUTE_BLOG } from "$lib/routes";

	let { posts }: { posts: PostSummary[] } = $props();
</script>

{#if posts.length > 0}
	<div class="px-4 py-8">
		<div class="mx-auto flex max-w-7xl items-center justify-between">
			<h3
				class="mb-4 text-2xl font-medium max-large:text-lg max-medium:text-base"
			>
				Aktuell
			</h3>
			<a
				class="my-5 mr-2 flex w-fit min-w-28 cursor-pointer items-center justify-start gap-1.5 rounded-full bg-green/30 px-2 py-1 text-center text-xs font-medium text-dark_text transition-all duration-300 hover:bg-green/80 active:bg-green/90"
				href={ROUTE_BLOG}
			>
				Alle Beiträge ansehen
			</a>
		</div>
		<BlogPostsList {posts} />
	</div>
{/if}
