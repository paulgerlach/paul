<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";

	type Props = SliceComponentProps<Content.SubtitleSlice>;

	let { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
>
	<h2
		class="mx-auto max-w-5xl text-center text-2xl font-medium max-megalarge:text-xl max-medium:text-base"
	>
		{slice.primary.subtitle}
	</h2>
</section>
