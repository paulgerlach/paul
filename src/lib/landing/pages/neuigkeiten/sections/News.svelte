<!--
  "Neueste Meldungen" (.pg-sec): the H2 and the topic filter in one row, the
  nine stories and the link to the blog. The filter (#bl-js) is the shared
  `Segmented`; the server and no-JS show every story ("Alle").
-->
<script lang="ts">
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { news } from "../content";
	import { countText, filterOptions, shows, type Choice } from "../filter";
	import StoryCard from "./StoryCard.svelte";

	const options = filterOptions(news.allLabel);
	let choice = $state<Choice>("all");
	const shown = $derived(
		news.stories.filter((story) => shows(choice, story)).length,
	);
	// Announced only after a change, not on load.
	let changed = $state(false);

	function choose(value: Choice) {
		choice = value;
		changed = true;
	}
</script>

<section class="pg-sec" aria-labelledby="nw-news-h">
	<div class="wrap">
		<div class="top">
			<h2 class="rv" id="nw-news-h">{news.h2}</h2>
			<div class="rv filter">
				<Segmented
					{options}
					bind:value={() => choice, choose}
					label={news.filterLabel}
				/>
			</div>
		</div>
		<p class="sr-only" aria-live="polite">{changed ? countText(shown) : ""}</p>
		<div class="grid">
			{#each news.stories as story (story.title)}
				<StoryCard {story} hidden={!shows(choice, story)} />
			{/each}
		</div>
		<div class="all rv">
			<a class="ghost" href={news.blog.href}
				>{news.blog.text} <span class="ar" aria-hidden="true">→</span></a
			>
		</div>
	</div>
</section>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		flex-wrap: wrap;
	}
	/* .dm-h2; `.top h2` beats the landing reset of heading margins. */
	.top h2 {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
		margin-top: 40px;
	}
	.all {
		margin-top: 44px;
		text-align: center;
	}
	/* .pg-ghost */
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		text-decoration: none;
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 720px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.filter {
			max-width: 100%;
			overflow-x: auto;
		}
	}
	@media (max-width: 640px) {
		.ghost {
			justify-content: center;
		}
	}
</style>
