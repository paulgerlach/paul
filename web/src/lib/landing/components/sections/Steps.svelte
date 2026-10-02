<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import thumb1 from "$lib/assets/landing/steps/thumb-1.jpg?enhanced";
	import thumb2 from "$lib/assets/landing/steps/thumb-2.jpg?enhanced";
	import thumb3 from "$lib/assets/landing/steps/thumb-3.jpg?enhanced";
	import { equalHeights } from "../../attachments/equalHeights";
	import { steps } from "../../data";
	import CheckBadge from "../icons/CheckBadge.svelte";

	const visuals = [analyse, contracts, sign, billing, sync];
</script>

<!-- One mini visual per step. They're decoration: the step text says it all. -->
{#snippet analyse()}
	<div class="mini">
		<div class="thumbs">
			{#each [thumb1, thumb2, thumb3] as thumb, i (i)}
				<Image src={thumb} alt="" width={40} height={40} />
			{/each}
		</div>
		<div class="t">41 Objekte analysiert</div>
		<div class="bar-s"><b></b></div>
	</div>
{/snippet}

{#snippet contracts()}
	<div class="mini rows">
		<div><span>Gartenweg 3</span><em class="tag-w">Wechsel 12/2026</em></div>
		<div><span>Lindenallee 8</span><em class="tag-a">Nur Abrechnung</em></div>
		<div><span>Hofstraße 21</span><em class="tag-w">Wechsel 06/2027</em></div>
	</div>
{/snippet}

{#snippet sign()}
	<div class="mini">
		<div class="s">Vollmacht</div>
		<div class="sigbox">
			<svg class="sigsvg" width="160" height="40" viewBox="0 0 160 40">
				<path
					pathLength="1"
					d="M4 30 C 9 18 12 6 15 9 C 18 12 15 28 18 30 C 21 20 26 6 29 9 C 32 12 28 28 33 29 C 38 30 40 18 44 12 C 46 9 47 20 46 30 C 45 22 52 14 56 12 C 52 18 50 22 58 30 C 62 33 64 22 70 22 C 74 22 72 28 68 28 C 64 28 66 20 72 20 C 78 20 78 29 82 29 C 86 29 86 8 89 8 C 92 8 88 30 92 30 C 96 30 96 8 99 8 C 102 8 98 30 102 30 C 106 30 108 22 112 22 C 116 22 114 28 110 28 C 106 28 108 20 116 21 C 120 22 120 30 124 28 C 128 26 128 20 132 21 C 136 22 128 36 156 25"
				/>
			</svg>
		</div>
		<div class="pill-s"><CheckBadge />Kündigung raus</div>
	</div>
{/snippet}

{#snippet billing()}
	<div class="mini">
		<div class="s">Heizkostenabrechnung 2026</div>
		<div class="btn-s">Abrechnung erstellen</div>
		<div class="pill-s"><CheckBadge />36 Einheiten fertig</div>
	</div>
{/snippet}

{#snippet sync()}
	<div class="mini sync">
		<div class="node dk">Heidi</div>
		<div class="link"></div>
		<div class="node">ERP / CRM</div>
		<div class="pill-s wide"><CheckBadge />Synchronisiert</div>
	</div>
{/snippet}

<section class="steps wrap" aria-labelledby="steps-h">
	<div class="shead">
		<div class="eyebrow">Heidi Portfolio-Checker</div>
		<h2 id="steps-h">Wir kümmern uns komplett um den Wechsel.</h2>
		<p>
			Der Portfolio-Checker prüft automatisch, wann Ihre Messdienstverträge
			enden. Den Rest übernimmt Heidi, in fünf Schritten.
		</p>
	</div>
	<ol class="step-row" {@attach equalHeights("h3")}>
		{#each steps as step, i (step.title)}
			<li class="step">
				<div class="step-vis" aria-hidden="true">{@render visuals[i]()}</div>
				<div class="num" aria-hidden="true">{i + 1}</div>
				<h3>{step.title}</h3>
				<p>{step.text}</p>
			</li>
		{/each}
	</ol>
</section>

<style>
	.steps {
		padding-block: 40px;
	}
	.step-row {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 20px;
		margin: 56px 0 0;
	}
	.step {
		cursor: default;
	}
	.step-vis {
		background: var(--stone);
		border-radius: 18px;
		height: 220px;
		display: grid;
		place-items: center;
		padding: 16px;
	}
	.num {
		margin-top: 22px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--ink);
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 14px;
		transition:
			background 0.3s,
			color 0.3s;
	}
	h3 {
		font-size: 20px;
		margin-top: 12px;
		line-height: 1.2;
	}
	.step p {
		color: var(--muted);
		font-size: 15px;
		margin-top: 8px;
	}

	.mini {
		background: #fff;
		border-radius: 12px;
		padding: 14px;
		width: 100%;
		box-shadow: 0 8px 24px rgba(30, 50, 45, 0.08);
		font-size: 13px;
		transition:
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
			box-shadow 0.35s;
	}
	.mini .s {
		font-size: 12px;
		color: var(--muted);
	}
	.mini .t {
		font-weight: 500;
		margin-top: 10px;
	}
	.thumbs {
		display: flex;
	}
	.thumbs :global(img) {
		width: 40px;
		height: 40px;
		border-radius: 8px;
		object-fit: cover;
		border: 2px solid #fff;
		margin-right: -8px;
		box-shadow: 0 2px 6px rgba(30, 50, 45, 0.15);
	}
	.bar-s {
		height: 6px;
		background: #edeeed;
		border-radius: 3px;
		margin-top: 8px;
		overflow: hidden;
	}
	.bar-s b {
		display: block;
		height: 100%;
		width: 100%;
		background: var(--accent);
	}
	.mini.rows {
		display: grid;
		gap: 6px;
		padding: 10px 12px;
	}
	.mini.rows div {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 3px;
		border-bottom: 1px solid var(--line);
		padding-bottom: 6px;
		font-size: 12px;
		white-space: nowrap;
	}
	.mini.rows div:last-child {
		border: 0;
		padding-bottom: 0;
	}
	.mini.rows em {
		font-style: normal;
		font-size: 10.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 2px 7px;
		white-space: nowrap;
	}
	.tag-w {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.tag-a {
		background: #eef1ef;
		color: var(--ink);
	}
	.btn-s {
		margin-top: 10px;
		background: var(--accent);
		color: var(--ink);
		border-radius: 8px;
		padding: 9px;
		text-align: center;
		font-weight: 600;
	}
	.mini.sync {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 6px;
	}
	.node {
		border: 1px solid var(--line);
		border-radius: 8px;
		padding: 10px 4px;
		text-align: center;
		font-weight: 600;
		font-size: 12px;
	}
	.node.dk {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.link {
		width: 22px;
		height: 2px;
		background: repeating-linear-gradient(
			90deg,
			var(--accent-deep) 0 4px,
			transparent 4px 7px
		);
	}
	.wide {
		grid-column: 1 / -1;
		justify-self: center;
	}
	.sigbox {
		position: relative;
		width: 160px;
		max-width: 100%;
		height: 40px;
		margin-top: 8px;
		border-bottom: 1.5px solid var(--ink);
	}
	.sigsvg {
		display: block;
		overflow: visible;
	}
	.sigsvg path {
		fill: none;
		stroke: #2b4a8c;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
	}

	/* Hover: each mini visual plays its own small animation */
	.step:hover .mini {
		box-shadow: 0 14px 34px rgba(30, 50, 45, 0.14);
	}
	.step:hover .num {
		background: var(--accent);
		color: var(--ink);
	}
	.step:hover .sigsvg path {
		animation: h-draw 1.6s cubic-bezier(0.45, 0.1, 0.55, 0.9) 0.15s both;
	}
	.step:hover .thumbs :global(img) {
		animation: h-spread 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.step:hover .bar-s b {
		animation: h-fill 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s both;
	}
	.step:hover .mini.rows > div {
		animation: h-in 0.4s both;
	}
	.step:hover .mini.rows > div:nth-child(2) {
		animation-delay: 0.15s;
	}
	.step:hover .mini.rows > div:nth-child(3) {
		animation-delay: 0.3s;
	}
	.step:hover .mini.rows em {
		animation: h-pop 0.4s 0.5s both;
	}
	.step:hover .sigbox ~ .pill-s {
		animation: h-pop 0.45s 1.9s both;
	}
	.step:hover .btn-s {
		animation: h-press 0.5s 0.15s both;
	}
	.step:hover .btn-s ~ .pill-s {
		animation: h-pop 0.45s 0.7s both;
	}
	.step:hover .link {
		animation: h-flow 0.5s linear infinite;
	}
	.step:hover .sync .pill-s {
		animation: h-pop 0.45s 0.4s both;
	}

	@media (max-width: 1180px) and (min-width: 981px) {
		.step-row {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (max-width: 980px) {
		.step-row {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.step-row {
			grid-template-columns: 1fr;
		}
	}
</style>
