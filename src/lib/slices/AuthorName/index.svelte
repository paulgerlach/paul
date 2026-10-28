<script lang="ts">
	import type { Content } from "@prismicio/client";
	import type { SliceComponentProps } from "@prismicio/svelte";

	type Props = SliceComponentProps<Content.FirstNameSlice>;

	let { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
>
	<p class="text-xl font-medium">{slice.primary.authorname}</p>
</section>
