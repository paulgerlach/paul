<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";

	type Props = SliceComponentProps<Content.QuoteSlice>;

	let { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="mx-auto max-w-3xl"
>
	<div class="mx-auto max-w-5xl border-l-4 border-green px-4 py-3">
		<p class="text-lg max-megalarge:text-base max-medium:text-sm">
			{slice.primary.qoute}
		</p>
	</div>
</section>
