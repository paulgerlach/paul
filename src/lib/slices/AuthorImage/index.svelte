<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";
	import CmsImage from "$lib/components/Basic/Image/CmsImage.svelte";

	type Props = SliceComponentProps<Content.AuthorImageSlice>;

	let { slice }: Props = $props();
</script>

<section
	class="flex items-center justify-center"
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
>
	<CmsImage
		field={slice.primary.authorimage}
		class="size-16 h-full max-h-16 w-full max-w-16 rounded-full object-cover"
	/>
</section>
