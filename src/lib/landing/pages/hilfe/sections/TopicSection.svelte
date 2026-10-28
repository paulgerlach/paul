<!-- One topic: heading with its icon tile and its questions. Hidden while the search finds none of them. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import type { Topic } from "../content";
	import { getHelpSearch } from "../search.svelte";
	import Question from "./Question.svelte";

	let { topic }: { topic: Topic } = $props();
	const search = getHelpSearch();
</script>

<section
	class="sec"
	id="c-{topic.id}"
	aria-labelledby="c-{topic.id}-h"
	hidden={!search.hasResults(topic)}
>
	<div class="sh">
		<span class="ic"><Icon name={topic.icon} /></span>
		<h2 id="c-{topic.id}-h">{topic.title}</h2>
	</div>
	{#each topic.questions as question (question.id)}
		<Question {question} />
	{/each}
</section>

<style>
	.sec {
		scroll-margin-top: 96px;
		margin-bottom: 40px;
	}
	.sec[hidden] {
		display: none;
	}
	.sh {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}
	.ic {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: #e4efe6;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 19px;
		height: 19px;
	}
	h2 {
		font-size: clamp(22px, 2vw, 28px);
		font-weight: 500;
		letter-spacing: -0.02em;
	}
</style>
