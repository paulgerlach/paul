<!-- The articles: the sticky topic list, the result line, the six topics and the empty state. -->
<script lang="ts">
	import { getHelpSearch } from "../search.svelte";
	import NoResults from "./NoResults.svelte";
	import Toc from "./Toc.svelte";
	import TopicSection from "./TopicSection.svelte";

	const search = getHelpSearch();
</script>

<div class="main">
	<div class="wrap grid">
		<Toc />
		<div class="list">
			<p class="res" aria-live="polite">{search.resultLine}</p>
			{#each search.topics as topic (topic.id)}
				<TopicSection {topic} />
			{/each}
			{#if search.results.count === 0}
				<NoResults />
			{/if}
		</div>
	</div>
</div>

<style>
	.main {
		padding: 0 0 100px;
	}
	.grid {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		gap: 48px;
		align-items: start;
	}
	.res {
		font-size: 14px;
		color: var(--muted);
		min-height: 1em;
		margin-bottom: 8px;
	}
	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
