<!--
  The author document is resolved in the page `load` (getBlogPost) and passed
  in `context`. Next fetched it inside the slice and turned a broken author
  link into a 404 for the whole post. Here the section is skipped instead.
  The slice simulator passes no context, so it gets a labelled placeholder.
-->
<script lang="ts">
	import type { Content } from "@prismicio/client";
	import { SliceZone, type SliceComponentProps } from "@prismicio/svelte";
	import type { BlogContext } from "$lib/server/blog";
	import { components } from "..";

	type Props = SliceComponentProps<Content.BlogAuthorSlice, BlogContext>;

	let { slice, context }: Props = $props();

	const link = $derived(slice.primary.blogauthor);
</script>

{#if context?.author}
	<section
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		class="mx-auto flex max-w-3xl items-center justify-start gap-10"
	>
		<SliceZone
			slices={context.author.data.slices}
			{components}
			context={context.author}
		/>
	</section>
{:else if !context || !("author" in context)}
	<section
		data-slice-type={slice.slice_type}
		data-slice-variation={slice.variation}
		class="mx-auto max-w-3xl rounded border border-dashed p-4 text-sm"
	>
		Autor: {"uid" in link && link.uid ? link.uid : "(verknüpftes Dokument)"}
	</section>
{/if}
