<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";

	type Props = SliceComponentProps<Content.BussinessTextSlice>;

	let { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="mx-auto max-w-3xl space-y-7 px-4 text-center"
>
	{#each slice.primary.bussinesstextitem ?? [] as text, index (index)}
		<p
			class="text-center text-lg font-medium max-megalarge:text-base max-medium:text-sm"
		>
			{text.bussinesstextitem}
		</p>
	{/each}
</section>
