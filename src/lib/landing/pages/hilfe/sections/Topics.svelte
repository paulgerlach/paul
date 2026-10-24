<!-- The six topic cards. With JS a click clears the search and opens the topic's first question before the jump. -->
<script lang="ts">
	import { flushSync } from "svelte";
	import Icon from "../components/Icon.svelte";
	import { articlesText, type Topic } from "../content";
	import { getHelpSearch } from "../search.svelte";

	const search = getHelpSearch();

	function open(topic: Topic) {
		if (search.query) search.setQuery("");
		search.open.add(topic.questions[0].id);
		// The DOM is final before the browser scrolls to the topic.
		flushSync();
	}
</script>

<section class="cats-w">
	<div class="wrap cats">
		{#each search.topics as topic (topic.id)}
			<a class="cat rv" href="#c-{topic.id}" onclick={() => open(topic)}>
				<span class="ic"><Icon name={topic.icon} /></span>
				<b>{topic.title}</b>
				<small>{topic.sub}</small>
				<em>{articlesText(topic.questions.length)}</em>
			</a>
		{/each}
	</div>
</section>

<style>
	.cats-w {
		padding: 24px 0 56px;
	}
	.cats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}
	.cat {
		display: flex;
		flex-direction: column;
		gap: 4px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 20px;
		transition:
			transform 0.25s,
			box-shadow 0.25s,
			border-color 0.25s;
	}
	.ic {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: #e4efe6;
		display: grid;
		place-items: center;
		margin-bottom: 10px;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.ic :global(svg) {
		width: 19px;
		height: 19px;
	}
	@media (hover: hover) {
		.cat:hover {
			transform: translateY(-3px);
			box-shadow: 0 18px 36px -26px rgba(30, 50, 45, 0.4);
			border-color: #cfe3d3;
		}
		.cat:hover .ic {
			background: var(--ink);
			color: var(--accent);
		}
	}
	b {
		font-size: 17px;
		font-weight: 600;
	}
	small {
		color: var(--muted);
		font-size: 14px;
	}
	em {
		font-style: normal;
		font-size: 12.5px;
		color: var(--ok);
		font-weight: 600;
		margin-top: 8px;
	}
	@media (max-width: 900px) {
		.cats {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.cats {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cat,
		.ic {
			transition: none;
		}
		.cat:hover {
			transform: none;
		}
	}
</style>
