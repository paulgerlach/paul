<!--
  "Vier Grundsätze": four buttons pick the principle shown in the panel below.
  Principle 01 is open in the server markup; switching needs JS.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { principles } from "../content";

	let active = $state(0);
	const current = $derived(principles.items[active]);
	const number = (i: number) => String(i + 1).padStart(2, "0");
</script>

<section class="gs" aria-labelledby="gs-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="gs-h"
				eyebrow={principles.eyebrow}
				heading={principles.h2}
			>
				{#snippet icon()}
					<path
						d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"
					/>
				{/snippet}
			</SectionHead>
		</div>
		<div class="val">
			{#each principles.items as item, i (item.title)}
				<button
					type="button"
					class={["v rv", i === active && "on"]}
					aria-pressed={i === active}
					aria-controls="gs-panel"
					onclick={() => (active = i)}
				>
					<span class="vn">{number(i)}</span>
					<b>{item.title}</b>
					<small>{item.sub}</small>
				</button>
			{/each}
		</div>
		<div class="vd rv" id="gs-panel" aria-live="polite">
			{#key active}
				<p class="in">
					{current.text}
					{#if current.link}
						<a href={current.link.href}>{current.link.text} →</a>
					{/if}
				</p>
				<ul class="in">
					{#each current.points as point (point)}
						<li><i><Check /></i>{point}</li>
					{/each}
				</ul>
			{/key}
		</div>
	</div>
</section>

<style>
	.gs {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		background: var(--bg);
	}
	.head {
		max-width: 760px;
	}
	.val {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
		margin-top: 48px;
	}
	.v {
		text-align: left;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 18px;
		padding: 20px;
		color: var(--ink);
		cursor: pointer;
		transition:
			background 0.3s,
			color 0.3s,
			border-color 0.3s,
			transform 0.3s;
	}
	.v:hover {
		transform: translateY(-2px);
	}
	.v.on {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.vn {
		display: block;
		font-size: 13px;
		font-weight: 600;
		color: var(--ok);
		font-variant-numeric: tabular-nums;
	}
	.v.on .vn {
		color: var(--accent);
	}
	.v b {
		display: block;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 16px;
	}
	.v small {
		display: block;
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 4px;
	}
	.v.on small {
		color: rgba(255, 255, 255, 0.66);
	}
	.vd {
		margin-top: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 26px 28px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 28px;
		min-height: 150px;
	}
	.vd p {
		font-size: 16.5px;
		line-height: 1.55;
		color: var(--ink);
	}
	.vd ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
		align-content: start;
	}
	.vd li {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		font-size: 14.5px;
		color: var(--muted);
	}
	.vd li i {
		flex: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #e3f3e4;
		display: grid;
		place-items: center;
		margin-top: 1px;
	}
	.vd li i :global(svg) {
		width: 10px;
	}
	.vd .in {
		animation: in 0.4s both;
	}
	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	.vd a {
		color: var(--ink);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	@media (max-width: 1040px) {
		.val {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.gs {
			padding: 72px 0;
		}
		.vd {
			grid-template-columns: minmax(0, 1fr);
			padding: 22px;
		}
		.v b {
			font-size: 19px;
		}
	}
</style>
