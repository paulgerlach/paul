<script lang="ts">
	import CmsImage from "$lib/components/Basic/Image/CmsImage.svelte";
	import type { PostSummary } from "$lib/server/blog";
	import { ROUTE_BLOG } from "$lib/routes";
	import { formatDate } from "$lib/utils";

	let { posts }: { posts: PostSummary[] } = $props();
</script>

<div class="px-4 py-8">
	<div class="mx-auto max-w-7xl">
		<h3
			class="mb-4 text-2xl font-medium max-large:text-lg max-medium:text-base"
		>
			Neueste
		</h3>
	</div>
	<div class="-mx-4">
		<div
			class="scrollbar-hide flex snap-x snap-mandatory gap-8 overflow-x-scroll max-small:gap-4"
		>
			{#each posts as post (post.uid)}
				<a
					href="{ROUTE_BLOG}/{post.uid}"
					class="group scroll-item relative flex min-h-[400px] w-fit max-w-7xl min-w-[80%] flex-row-reverse items-center overflow-hidden rounded-4xl bg-[#FAFAF9] max-large:grid max-large:max-h-[400px] max-large:min-h-[200px] max-large:grid-rows-[60%_40%] max-medium:min-h-[150px]"
				>
					<div class="h-full overflow-hidden">
						<CmsImage
							field={post.image}
							fallbackAlt="blog_image"
							class="-my-1 block h-full w-full rounded-r-2xl object-cover max-large:rounded-t-2xl max-large:rounded-r-none"
						/>
					</div>
					<div
						class="flex h-full flex-col justify-between px-8 py-10 max-large:px-4 max-large:py-5"
					>
						<h3
							class="text-3xl font-medium group-hover:underline max-large:text-lg max-medium:text-base"
						>
							{post.title}
						</h3>
						<p class="text-sm text-gray-500">
							{formatDate(String(post.date))}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
