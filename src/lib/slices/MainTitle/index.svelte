<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";

	type Props = SliceComponentProps<Content.MainTitleSlice>;

	let { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
>
	<h1
		class="mx-auto max-w-4xl text-center text-7xl max-megalarge:text-5xl max-medium:text-3xl"
	>
		{slice.primary.maintitle}
	</h1>
</section>
