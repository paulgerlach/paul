<script lang="ts">
	import type { Content } from "@prismicio/client";
	import { PrismicRichText, type SliceComponentProps } from "@prismicio/svelte";
	import RichTextBlockImage from "$lib/components/Basic/RichTextBlockImage/RichTextBlockImage.svelte";

	type Props = SliceComponentProps<Content.RichTextBlockSlice>;

	let { slice }: Props = $props();
</script>

<section
	class="richTextBlock mx-auto max-w-3xl space-y-7"
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
>
	<PrismicRichText
		field={slice.primary.rishtextblock}
		components={{ image: RichTextBlockImage }}
	/>
</section>
