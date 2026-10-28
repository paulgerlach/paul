<!--
  The design's split sections (`.aw-sec` + `.aw-2`): the text column (pill,
  H2, text, a ticked list or a snippet) beside the visual; `reverse` puts the
  visual first (the text still first below 1080 px).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { IconName } from "$lib/landing/pages/dashboard/icons";
	import Pill from "$lib/landing/pages/dashboard/components/Pill.svelte";
	import Tick from "./Tick.svelte";

	let {
		id,
		pill,
		h2,
		text,
		list = [],
		extra,
		reverse = false,
		visual,
	}: {
		id: string;
		pill: { text: string; icon: IconName };
		h2: string;
		text: string;
		list?: string[];
		/** Below the text, in place of the list. */
		extra?: Snippet;
		reverse?: boolean;
		visual: Snippet;
	} = $props();
</script>

<section class="sec aw-sec" aria-labelledby={id}>
	<div class="wrap">
		<div class={["aw-2", reverse && "rev"]}>
			{#if reverse}{@render visual()}{/if}
			<div class="aw-tx">
				<Pill text={pill.text} icon={pill.icon} class="rv" />
				<h2 class="db-h2 rv" {id}>{h2}</h2>
				<p class="aw-p rv">{text}</p>
				{#if list.length}
					<ul class="aw-ul rv">
						{#each list as item (item)}
							<li><span class="tk"><Tick /></span>{item}</li>
						{/each}
					</ul>
				{/if}
				{@render extra?.()}
			</div>
			{#if !reverse}{@render visual()}{/if}
		</div>
	</div>
</section>

<style>
	.aw-sec {
		padding: clamp(80px, 9vw, 120px) 0;
	}
	.aw-2 {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 5vw, 72px);
		align-items: center;
		text-align: left;
	}
	.aw-2.rev {
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
	}
	.aw-tx :global(.db-h2) {
		text-align: left;
	}
	.aw-p {
		color: var(--muted);
		font-size: 17px;
		line-height: 1.6;
		margin-top: 16px;
		max-width: 46ch;
	}
	.aw-ul {
		list-style: none;
		margin: 22px 0 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	.aw-ul li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 15.5px;
	}
	.tk {
		width: 20px;
		height: 20px;
		padding: 4px;
		border-radius: 50%;
		background: var(--accent);
		flex: none;
		display: grid;
		place-items: center;
	}
	.tk :global(svg) {
		width: 12px;
		height: 10px;
	}
	@media (max-width: 1080px) {
		.aw-2,
		.aw-2.rev {
			grid-template-columns: 1fr;
		}
		.aw-2.rev .aw-tx {
			order: -1;
		}
	}
</style>
