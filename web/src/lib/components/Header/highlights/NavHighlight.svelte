<!-- The right-side panel of a nav dropdown, picked by the group's key. -->
<script lang="ts">
	import type { PostSummary } from "$lib/server/blog";
	import type { NavHighlightKey } from "$lib/types";
	import BlogHighlight from "./BlogHighlight.svelte";
	import FunktionenHighlight from "./FunktionenHighlight.svelte";
	import GeraeteHighlight from "./GeraeteHighlight.svelte";

	let { key, posts }: { key: NavHighlightKey; posts: PostSummary[] } = $props();
</script>

{#if key === "geraete"}
	<GeraeteHighlight />
{:else if key === "funktionen"}
	<FunktionenHighlight />
{:else if posts[0]}
	<BlogHighlight post={posts[0]} />
{/if}
