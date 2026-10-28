<!--
  "Stimmen im Detail" (`#stimmen`, the design's `.rf-cases`): the three
  shared quotes as cards, each with its company (Werne's logo), a topic and
  two lines "Dahinter bei Heidi"; the middle card is dark.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { customerLogos } from "$lib/landing/data/logos";
	import { testimonial } from "$lib/landing/data/testimonials";
	import Icon from "../components/Icon.svelte";
	import { cases, VOICES_ID } from "../content";

	const werne = customerLogos.werne;
</script>

<section class="pg-sec alt" id={VOICES_ID} aria-labelledby="st-h">
	<div class="wrap">
		<div class="head">
			<span class="pill rv"><Icon name="people" />{cases.pill}</span>
			<h2 class="h2 rv" id="st-h">
				{cases.h2} <span>{cases.h2Accent}</span>
			</h2>
		</div>
		<div class="cases">
			{#each cases.items as item (item.key)}
				{@const quote = testimonial(item.key)}
				<article class={["case rv", item.dark && "dark"]}>
					<div class="ch">
						{#if item.name}
							<span class="name">{item.name}</span>
						{:else}
							<Image src={werne.src} alt={werne.alt} />
						{/if}
						<span class="topic">{item.topic}</span>
					</div>
					<blockquote>{quote.quote}</blockquote>
					<div class="who">
						<span class="av">{quote.initials}</span><span
							><b>{quote.name}</b>{quote.role}</span
						>
					</div>
					<div class="how">
						<span>{cases.howLabel}</span>
						<ul>
							{#each item.how as line (line)}
								<li><Check />{line}</li>
							{/each}
						</ul>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.cases {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
		margin-top: 44px;
		align-items: stretch;
	}
	.case {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	.case:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
	}
	.case.dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.ch {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		min-height: 40px;
	}
	.ch :global(img) {
		height: 36px;
		width: auto;
	}
	.name {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.topic {
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 4px 10px;
		background: #e3f3e4;
		color: #2f7a3c;
		white-space: nowrap;
	}
	.dark .topic {
		background: rgba(138, 214, 143, 0.16);
		color: var(--accent);
	}
	blockquote {
		margin: 20px 0 0;
		font-size: 18px;
		line-height: 1.45;
		letter-spacing: -0.01em;
		flex: 1;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 20px;
		font-size: 13px;
		color: var(--muted);
	}
	.dark .who {
		color: rgba(255, 255, 255, 0.65);
	}
	.who b {
		display: block;
		font-size: 14.5px;
		color: var(--ink);
	}
	.dark .who b {
		color: #fff;
	}
	.av {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: var(--ink);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 14px;
		flex: none;
	}
	.dark .av {
		background: var(--accent);
		color: var(--ink);
	}
	.how {
		margin-top: 20px;
		padding-top: 16px;
		border-top: 1px solid var(--hair);
	}
	.dark .how {
		border-color: rgba(255, 255, 255, 0.1);
	}
	.how > span {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--faint);
	}
	.dark .how > span {
		color: rgba(255, 255, 255, 0.45);
	}
	.how ul {
		list-style: none;
		padding: 0;
		margin: 10px 0 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.how li {
		display: flex;
		align-items: flex-start;
		gap: 9px;
		font-size: 14px;
		line-height: 1.4;
	}
	.how li :global(svg) {
		width: 12px;
		height: 10px;
		flex: none;
		margin-top: 5px;
	}
	.how li :global(path) {
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.dark .how li :global(path) {
		stroke: var(--accent);
	}

	@media (max-width: 1040px) {
		.cases {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.case:hover {
			transform: none;
		}
	}
</style>
