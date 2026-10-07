<script lang="ts" module>
	/** `answer` may contain <b> and <a>; it comes from trusted content modules. */
	export type FaqItem = { question: string; answer: string };
</script>

<!--
  FAQ of the landing pages, with its FAQPage JSON-LD. `split` is the
  two-column variant of the /upgrade-now design (title and lead on the left,
  plus icons, all closed).
-->
<script lang="ts">
	import Chevron from "$lib/landing/components/icons/Chevron.svelte";

	let {
		items,
		title = "FAQ",
		lead,
		variant = "default",
	}: {
		items: FaqItem[];
		title?: string;
		/** Text under the title (split variant). */
		lead?: string;
		variant?: "default" | "split";
	} = $props();

	// FAQPage structured data. Answers may contain <b>, which schema.org allows.
	const jsonLd = $derived(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: items.map((item) => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: { "@type": "Answer", text: item.answer },
			})),
		}).replace(/</g, "\\u003c"),
	);
	// Split so the closing tag doesn't end this <script> block.
	const jsonLdTag = $derived(
		`<script type="application/ld+json">${jsonLd}<` + "/script>",
	);
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static data, "<" escaped -->
	{@html jsonLdTag}
</svelte:head>

{#if variant === "split"}
	<section class="split" id="faq" aria-labelledby="faq-h2">
		<div class="wrap split-g">
			<div>
				<h2 id="faq-h2">{title}</h2>
				{#if lead}<p class="lead">{lead}</p>{/if}
			</div>
			<div class="faq-list">
				{#each items as item (item.question)}
					<details>
						<summary>
							{item.question}
							<i aria-hidden="true">
								<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
									<path
										d="M10 4v12M4 10h12"
										stroke="currentColor"
										stroke-width="1.6"
										stroke-linecap="round"
									/>
								</svg>
							</i>
						</summary>
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted content data -->
						<div class="ans">{@html item.answer}</div>
					</details>
				{/each}
			</div>
		</div>
	</section>
{:else}
	<section class="sec wrap faq" id="faq">
		<h2>{title}</h2>
		<div class="faq-list">
			{#each items as item, i (item.question)}
				<details open={i === 0}>
					<summary>
						{item.question}
						<span class="tg" aria-hidden="true"><Chevron width={14} /></span>
					</summary>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted content data -->
					<div class="ans">{@html item.answer}</div>
				</details>
			{/each}
		</div>
	</section>
{/if}

<style>
	.faq,
	.split {
		scroll-margin-top: 64px;
	}
	.faq h2 {
		font-size: clamp(44px, 5vw, 72px);
	}
	.faq .faq-list {
		margin-top: 64px;
	}
	.faq details {
		border-top: 1px solid var(--line);
	}
	.faq details:last-child {
		border-bottom: 1px solid var(--line);
	}
	.faq summary {
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
	.faq .ans {
		color: var(--muted);
		padding-bottom: 26px;
		max-width: 70ch;
		font-size: 17px;
	}

	/* Split variant (the design's .dm-faq) */
	.split {
		padding: 104px 0;
		border-top: 1px solid var(--hair, var(--line));
	}
	.split-g {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: 64px;
		align-items: start;
	}
	.split h2 {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.split details {
		border-bottom: 1px solid var(--hair, var(--line));
	}
	.split details:first-child {
		border-top: 1px solid var(--hair, var(--line));
	}
	.split summary {
		list-style: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 22px 0;
		font-size: 18px;
		font-weight: 500;
		cursor: pointer;
	}
	.split summary i {
		width: 34px;
		height: 34px;
		border: 1px solid var(--hair, var(--line));
		border-radius: 8px;
		display: grid;
		place-items: center;
		flex: none;
		transition:
			transform 0.25s,
			background 0.2s;
	}
	.split summary svg {
		width: 14px;
		height: 14px;
	}
	.split details[open] summary i {
		transform: rotate(45deg);
		background: #f2f5f3;
	}
	.split .ans {
		color: var(--muted);
		font-size: 16px;
		margin: 0 0 22px;
		max-width: 60ch;
	}
	@media (max-width: 1040px) {
		.split-g {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
	.ans :global(b) {
		font-weight: 600;
	}
	.ans :global(a) {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
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
