<script lang="ts">
	import { ROUTE_BLOG } from "$lib/routes";
	import type { PostSummary } from "$lib/server/blog";
	import HighlightTitle from "./HighlightTitle.svelte";

	let { post }: { post: PostSummary } = $props();
</script>

<a class="group" href="{ROUTE_BLOG}/{post.uid}">
	<HighlightTitle text="Blog Artikel Highlights" />
	<div class="mb-2.5 flex items-center justify-center rounded-base">
		{#if post.image.url}
			<img
				loading="lazy"
				decoding="async"
				class="min-h-[150px] rounded-2xl object-cover"
				style="width: 100%; height: auto"
				src={post.image.url}
				alt={post.image.alt || "blog_image"}
			/>
		{/if}
	</div>
	<p class="mb-3 text-[15px] font-bold text-dark_text">{post.title}</p>
	<p class="text-xs text-dark_text">{post.subtitle}</p>
</a>
