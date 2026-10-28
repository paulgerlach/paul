<script lang="ts">
	import { SliceZone } from "@prismicio/svelte";
	import FAQSection from "$lib/components/Basic/FAQ/FAQSection.svelte";
	import Kostenfrei from "$lib/components/Basic/Kostenfrei/Kostenfrei.svelte";
	import RecommendedPosts from "$lib/components/Blog/RecommendedPosts.svelte";
	import type { BlogContext } from "$lib/server/blog";
	import { components } from "$lib/slices";

	let { data } = $props();

	const context: BlogContext = $derived({
		tags: data.post.tags,
		author: data.author,
	});
</script>

<svelte:head>
	<!-- Post images come straight from Prismic's CDN (Next proxied them through
	     /_next/image), so open that connection before the parser finds them. -->
	<link rel="preconnect" href="https://images.prismic.io" />
</svelte:head>

<!-- Next had id="content relative" (KI-13). -->
<main id="content" class="relative">
	<div class="px-20 max-medium:px-10 max-small:px-5">
		<div
			class="mx-auto mb-[52px] max-w-6xl space-y-7 pt-28 pb-4 max-large:pt-24 max-medium:pt-20 max-small:pt-28"
		>
			<SliceZone slices={data.post.data.slices} {components} {context} />
		</div>
		<RecommendedPosts posts={data.recommended} />
	</div>
	<FAQSection />
	<Kostenfrei />
</main>
