<script lang="ts">
	import CmsImage from "$lib/components/Basic/Image/CmsImage.svelte";
	import type { PostSummary } from "$lib/server/blog";
	import { ROUTE_BLOG } from "$lib/routes";
	import { formatDate } from "$lib/utils";

	let { post }: { post: PostSummary } = $props();
</script>

<a href="{ROUTE_BLOG}/{post.uid}" class="group relative flex flex-col gap-4">
	<CmsImage
		field={post.image}
		fallbackAlt="blog_image"
		class="max-h-[240px] w-full rounded-2xl object-cover"
	/>
	<h3
		class="text-2xl font-medium group-hover:underline max-large:text-lg max-medium:text-base"
	>
		{post.title}
	</h3>
	<div class="flex items-center justify-start gap-2 max-medium:justify-between">
		<span class="text-sm text-gray-500 max-medium:text-xs">
			{formatDate(String(post.date))}
		</span>
		<div class="flex items-center justify-end gap-1">
			{#each post.tags as tag (tag)}
				<span class="rounded-full bg-green/30 px-2 py-1 text-xs font-medium">
					{tag}
				</span>
			{/each}
		</div>
	</div>
</a>
