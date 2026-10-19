<!-- The dark "1000+" card (.sg-k): the figure, pill, H2, text and the CTAs (the light second one only once its page exists). -->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import Icon from "./Icon.svelte";
	import type { LargeStock } from "./types";

	let { large }: { large: LargeStock } = $props();

	const format = (n: number) => Math.round(n).toLocaleString("de-DE");
</script>

<section class="pg-sec" aria-labelledby="sg-k-h">
	<div class="wrap">
		<div class="k rv">
			<div class="n" aria-hidden="true">
				<b>{format(large.figure)}</b><i>{large.plus}</i><small
					>{large.unit}</small
				>
			</div>
			<div>
				<span class="pill"
					><Icon name={large.pill.icon} />{large.pill.text}</span
				>
				<h2 id="sg-k-h">
					{large.h2.text}{#if large.h2.muted}<span>{large.h2.muted}</span>{/if}
				</h2>
				<p>{large.text}</p>
				<div class="b">
					<ArrowLink href={large.cta.href} label={large.cta.text} />
					{#if large.secondary?.href}
						<a class="ghost" href={large.secondary.href}
							>{large.secondary.text}</a
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.k {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: 48px;
		align-items: center;
		background: var(--ink);
		color: #fff;
		border-radius: 26px;
		padding: 56px;
		position: relative;
		overflow: hidden;
	}
	.k :global(:focus-visible) {
		outline-color: var(--accent);
	}
	.n {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 0 6px;
	}
	.n b {
		font-size: clamp(76px, 10vw, 140px);
		font-weight: 500;
		letter-spacing: -0.06em;
		line-height: 0.9;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}
	.n i {
		font-style: normal;
		font-size: clamp(48px, 6vw, 84px);
		color: var(--accent);
		font-weight: 500;
		line-height: 1;
	}
	.n small {
		flex-basis: 100%;
		font-size: 18px;
		color: rgba(255, 255, 255, 0.7);
		margin-top: 10px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.06);
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.86);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--accent);
	}
	/* The size stays plain `h2`, so #hs-css's sizes (SgMain) win below 1040 px
	   as in the design. */
	h2 {
		font-size: clamp(28px, 3.2vw, 42px);
		line-height: 1.1;
	}
	/* `.k h2`: beats the landing reset of heading margins. */
	.k h2 {
		letter-spacing: -0.03em;
		margin-top: 16px;
	}
	h2 span {
		color: rgba(255, 255, 255, 0.6);
	}
	p {
		color: rgba(255, 255, 255, 0.72);
		margin-top: 14px;
		line-height: 1.55;
		max-width: 56ch;
	}
	.b {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 26px;
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: transparent;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: #fff;
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	@media (max-width: 1040px) {
		.k {
			grid-template-columns: minmax(0, 1fr);
			padding: 40px;
			gap: 24px;
		}
	}
	@media (max-width: 640px) {
		.k {
			padding: 28px;
		}
		.ghost {
			justify-content: center;
		}
	}
</style>
