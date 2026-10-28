<!--
  "Datenweg" (.si-path): Funkzähler → Fernablesung → Heidi → Ihr ERP / CRM,
  then what arrives (.si-what). While the path is in view the nodes light up
  in turn every 900 ms and dots run along the links; with reduced motion
  every node is lit and nothing moves.
-->
<script lang="ts">
	import { onMount } from "svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { dataPath as t } from "../content";

	let lit = $state(-1);
	let all = $state(false);
	let running = $state(false);

	onMount(() => {
		all = prefersReducedMotion();
	});

	const cycle = loopInView({
		run: () => {
			running = true;
			lit = (lit + 1) % t.nodes.length;
			return () => (running = false);
		},
		every: 900,
	});
</script>

<section class="pg-sec" aria-labelledby="fl-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="fl-h" eyebrow={t.pill} heading={t.h2} center>
				{#snippet icon()}
					<path
						d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
					/><circle cx="10" cy="16" r=".8" fill="currentColor" />
				{/snippet}
			</SectionHead>
		</div>
		<div
			class={["path", "rv", running && "on"]}
			role="list"
			aria-label={t.label}
			{@attach cycle}
		>
			{#each t.nodes as node, i (node.title)}
				{#if i > 0}<div class="lk" aria-hidden="true"><i></i></div>{/if}
				<div
					class={["node", node.kind, (all || lit === i) && "lit"]}
					role="listitem"
				>
					<span class="ni"><Icon name={node.icon} /></span>
					<b>{node.title}</b><small>{node.sub}</small>
				</div>
			{/each}
		</div>
		<div class="what">
			{#each t.cards as card (card.title)}
				<article class="rv">
					<span class="wi"><Icon name={card.icon} /></span>
					<h3>{card.title}</h3>
					<p>
						{card.text}
						{#if card.link}
							<a href={card.link.href}
								>{card.link.text} <span aria-hidden="true">→</span></a
							>
						{/if}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.path {
		display: grid;
		grid-template-columns: auto 1fr auto 1fr auto 1fr auto;
		align-items: start;
		margin-top: 56px;
	}
	.node {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		width: 150px;
	}
	.ni {
		width: 64px;
		height: 64px;
		border-radius: 18px;
		background: #fff;
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 0.3s,
			border-color 0.3s;
	}
	.ni :global(svg) {
		width: 24px;
		height: 24px;
	}
	.hub .ni {
		background: var(--bg);
	}
	.hub .ni :global(svg) {
		width: 30px;
		height: 26px;
	}
	.end .ni {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--accent);
	}
	.node b {
		font-size: 16px;
		font-weight: 600;
		margin-top: 16px;
	}
	.node small {
		font-size: 13.5px;
		color: var(--muted);
		margin-top: 4px;
	}
	.node.lit .ni {
		transform: translateY(-3px);
		border-color: var(--accent-deep);
	}
	.lk {
		position: relative;
		height: 2px;
		margin-top: 31px;
		background: repeating-linear-gradient(
			90deg,
			#cfd8d3 0 6px,
			transparent 6px 12px
		);
	}
	.lk i {
		position: absolute;
		left: 0;
		top: -3px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-deep);
		opacity: 0;
	}
	.path.on .lk i {
		animation: lk 2.4s linear infinite;
	}
	.path.on .lk:nth-of-type(4) i {
		animation-delay: 0.8s;
	}
	.path.on .lk:nth-of-type(6) i {
		animation-delay: 1.6s;
	}
	@keyframes lk {
		0% {
			left: 0;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 8px);
			opacity: 0;
		}
	}
	.what {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 64px;
	}
	.what article {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px;
	}
	.wi {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.wi :global(svg) {
		width: 19px;
		height: 19px;
	}
	/* `.what h3`: beats the landing reset of heading margins. */
	.what h3 {
		font-size: 18px;
		font-weight: 600;
		margin-top: 18px;
		letter-spacing: -0.01em;
	}
	.what p {
		font-size: 15px;
		color: var(--muted);
		margin-top: 8px;
		line-height: 1.5;
	}
	.what a {
		color: var(--ink);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-underline-offset: 3px;
		text-decoration-thickness: 2px;
	}
	@media (max-width: 1040px) {
		.node {
			width: 120px;
		}
	}
	@media (max-width: 860px) {
		.what {
			grid-template-columns: minmax(0, 1fr);
		}
		.path {
			grid-template-columns: minmax(0, 1fr);
			justify-items: center;
		}
		.node {
			width: auto;
		}
		.lk {
			width: 2px;
			height: 34px;
			margin: 12px 0;
			background: repeating-linear-gradient(
				180deg,
				#cfd8d3 0 6px,
				transparent 6px 12px
			);
		}
		.lk i {
			left: -3px;
			top: 0;
		}
		.path.on .lk i {
			animation-name: lk-v;
		}
	}
	@keyframes lk-v {
		0% {
			top: 0;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			top: calc(100% - 8px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lk i {
			animation: none !important;
			opacity: 0 !important;
		}
	}
</style>
