<script lang="ts">
	import { faqItems } from "../../data";
	import Chevron from "../icons/Chevron.svelte";

	// FAQPage structured data. Answers may contain <b>, which schema.org allows.
	const jsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqItems.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: { "@type": "Answer", text: item.answer },
		})),
	}).replace(/</g, "\\u003c");
	// Split so the closing tag doesn't end this <script> block.
	const jsonLdTag =
		`<script type="application/ld+json">${jsonLd}<` + "/script>";
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static data, "<" escaped -->
	{@html jsonLdTag}
</svelte:head>

<section class="sec wrap faq" id="faq">
	<h2>FAQ</h2>
	<div class="faq-list">
		{#each faqItems as item, i (item.question)}
			<details open={i === 0}>
				<summary>
					{item.question}
					<span class="tg" aria-hidden="true"><Chevron width={14} /></span>
				</summary>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- static copy from data.ts -->
				<div class="ans">{@html item.answer}</div>
			</details>
		{/each}
	</div>
</section>

<style>
	.faq {
		scroll-margin-top: 64px;
	}
	h2 {
		font-size: clamp(44px, 5vw, 72px);
	}
	.faq-list {
		margin-top: 64px;
	}
	details {
		border-top: 1px solid var(--line);
	}
	details:last-child {
		border-bottom: 1px solid var(--line);
	}
	summary {
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 26px 0;
		font-size: clamp(17px, 1.6vw, 21px);
		cursor: pointer;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.tg {
		width: 42px;
		height: 42px;
		border: 1px solid #d5dad8;
		border-radius: 6px;
		display: grid;
		place-items: center;
		flex: none;
		transition: transform 0.2s;
	}
	details[open] .tg {
		transform: rotate(180deg);
	}
	.ans {
		color: var(--muted);
		padding-bottom: 26px;
		max-width: 70ch;
		font-size: 17px;
	}
	.ans :global(b) {
		font-weight: 600;
	}
	/* Animated open/close where the browser supports it */
	details::details-content {
		block-size: 0;
		overflow-y: clip;
		transition:
			block-size 0.25s,
			content-visibility 0.25s allow-discrete;
	}
	details[open]::details-content {
		block-size: auto;
	}
	@supports (interpolate-size: allow-keywords) {
		.faq-list {
			interpolate-size: allow-keywords;
		}
	}
</style>
