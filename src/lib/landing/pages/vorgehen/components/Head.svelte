<!-- A section head of /vorgehen (the design's .ar-head): eyebrow pill and H2, left or centred. -->
<script lang="ts">
	import Eyebrow from "$lib/landing/components/Eyebrow.svelte";

	let {
		id,
		eyebrow,
		title,
		center = false,
	}: {
		/** Id of the H2, for the section's aria-labelledby. */
		id: string;
		eyebrow: string;
		/** One string, or lines joined with a line break. */
		title: string | string[];
		center?: boolean;
	} = $props();

	const lines = $derived(typeof title === "string" ? [title] : title);
</script>

<div class={["head", center && "c"]}>
	<Eyebrow text={eyebrow} {center} class="rv" />
	<h2 class="rv" {id}>
		{#each lines as line, i (i)}{#if i > 0}<br />{/if}{line}{/each}
	</h2>
</div>

<style>
	.head {
		max-width: 760px;
	}
	.c {
		margin: 0 auto;
		text-align: center;
	}
	h2 {
		font-size: clamp(30px, 3.6vw, 50px);
		line-height: 1.06;
		letter-spacing: -0.035em;
		font-weight: 500;
		text-wrap: balance;
	}
</style>
