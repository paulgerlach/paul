<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";
	import CopyLinkButton from "$lib/components/Basic/CopyLinkButton/CopyLinkButton.svelte";
	import CmsImage from "$lib/components/Basic/Image/CmsImage.svelte";
	import type { BlogContext } from "$lib/server/blog";
	import { formatDate } from "$lib/utils";

	type Props = SliceComponentProps<Content.BlogImageSlice, BlogContext>;

	let { slice, context }: Props = $props();
</script>

<div
	class="blogImage flex items-center justify-between gap-2 max-medium:grid max-medium:grid-cols-2"
>
	<div class="blogImageTags flex flex-wrap items-center gap-1">
		{#each context?.tags ?? [] as tag (tag)}
			<span class="mr-2 rounded-full bg-green/30 px-2 py-1 text-xs font-medium">
				{tag}
			</span>
		{/each}
	</div>
	<span class="blogImageDate text-sm text-gray-500 max-medium:text-base">
		{slice.primary.creationdate ? formatDate(slice.primary.creationdate) : ""}
	</span>
	<CopyLinkButton />
</div>
<section
	class="max-h-[600px] w-full rounded-2xl object-cover"
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
>
	<CmsImage
		field={slice.primary.blogMainImage}
		fallbackAlt="blogMainImage"
		class="max-h-[600px] w-full rounded-2xl object-cover"
	/>
</section>
