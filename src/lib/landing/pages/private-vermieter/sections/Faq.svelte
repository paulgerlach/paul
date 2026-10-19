<!-- "Echte Fragen. Klare Antworten." (.pv-faq): six dark <details>, all closed, and the FAQPage JSON-LD. -->
<script lang="ts">
	import { faqJsonLd, type FaqItem } from "$lib/landing/faqJsonLd";
	import Head from "../components/Head.svelte";
	import { faq } from "../content";

	let { items }: { items: FaqItem[] } = $props();

	const jsonLdTag = $derived(faqJsonLd(items));
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- built from trusted content -->
	{@html jsonLdTag}
</svelte:head>

<section class="faq" id={faq.id} aria-labelledby="pv-fqh">
	<div class="wrap">
		<Head id="pv-fqh" eyebrow={faq.eyebrow} lines={faq.h2} center />
		<div class="fq">
			{#each items as item (item.question)}
				<details class="rv">
					<summary>{item.question}</summary>
					<p>
						{item.answer}{#if item.more?.href}
							<a href={item.more.href}>{item.more.text}</a>{/if}
					</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.faq {
		padding: 40px 0 120px;
	}
	.fq {
		max-width: 880px;
		margin: 48px auto 0;
		display: grid;
		gap: 10px;
	}
	details {
		background: var(--card);
		border-radius: 14px;
		padding: 0 22px;
		transition: background 0.3s;
	}
	details[open] {
		background: var(--card2);
	}
	summary {
		cursor: pointer;
		list-style: none;
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 0;
		font-size: 16.5px;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary::after {
		content: "+";
		font-size: 22px;
		line-height: 1;
		color: var(--accent);
		transition: transform 0.3s;
	}
	details[open] summary::after {
		transform: rotate(45deg);
	}
	p {
		color: var(--mute);
		font-size: 15.5px;
		line-height: 1.55;
		padding-bottom: 20px;
		max-width: 72ch;
	}
	a {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	@media (prefers-reduced-motion: reduce) {
		details,
		summary::after {
			transition: none;
		}
	}
</style>
