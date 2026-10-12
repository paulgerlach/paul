<!-- One article: a native <details> (deep-linkable as #q-<id>), the question with the search's matches marked, the answer, its link and the vote. -->
<script lang="ts">
	import type { Question } from "../content";
	import { highlight } from "../search";
	import { getHelpSearch } from "../search.svelte";
	import Feedback from "./Feedback.svelte";

	let { question }: { question: Question } = $props();
	const search = getHelpSearch();

	const match = $derived(search.results.ids.has(question.id));
	const segments = $derived(
		match ? highlight(question.question, search.results.terms) : [],
	);

	function ontoggle(event: Event) {
		const { open } = event.currentTarget as HTMLDetailsElement;
		if (open) search.open.add(question.id);
		else search.open.delete(question.id);
	}
</script>

<details
	class="q"
	id="q-{question.id}"
	hidden={!match}
	open={search.open.has(question.id)}
	{ontoggle}
>
	<summary>
		<span
			>{#each segments as segment, i (i)}{#if segment.hit}<mark
						>{segment.text}</mark
					>{:else}{segment.text}{/if}{:else}{question.question}{/each}</span
		>
		<i aria-hidden="true"></i>
	</summary>
	<p>
		{question.answer}
		{#if question.more?.href}
			<a class="more" href={question.more.href}
				>{question.more.text} <span aria-hidden="true">→</span></a
			>
		{/if}
	</p>
	<Feedback id={question.id} />
</details>

<style>
	.q {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 14px;
		margin-top: 8px;
		scroll-margin-top: 96px;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.q[open] {
		border-color: #cfe3d3;
		box-shadow: 0 14px 30px -24px rgba(30, 50, 45, 0.35);
	}
	.q[hidden] {
		display: none;
	}
	/* Set by a popular question's link (the design names it, without CSS). */
	.q:global(.flash) {
		animation: flash 1.2s ease-out;
	}
	@keyframes flash {
		from {
			background: #f2faf3;
		}
		to {
			background: #fff;
		}
	}
	summary {
		list-style: none;
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		padding: 17px 20px;
		font-size: 16px;
		font-weight: 500;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary:focus-visible {
		border-radius: 14px;
	}
	/* The + that turns into − on a dark fill */
	i {
		flex: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 1px solid var(--hair);
		position: relative;
		transition:
			transform 0.3s,
			background 0.2s;
	}
	i::before,
	i::after {
		content: "";
		position: absolute;
		left: 50%;
		top: 50%;
		width: 10px;
		height: 1.6px;
		background: var(--ink);
		transform: translate(-50%, -50%);
	}
	i::after {
		transform: translate(-50%, -50%) rotate(90deg);
		transition: transform 0.3s;
	}
	.q[open] i {
		background: var(--ink);
	}
	.q[open] i::before,
	.q[open] i::after {
		background: #fff;
	}
	.q[open] i::after {
		transform: translate(-50%, -50%) rotate(0);
	}
	mark {
		background: #e4f3e6;
		color: inherit;
		border-radius: 3px;
		padding: 0 2px;
	}
	p {
		padding: 0 20px;
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.6;
		max-width: 70ch;
	}
	.more {
		color: var(--ok);
		font-weight: 600;
		white-space: nowrap;
	}
	.more:hover {
		text-decoration: underline;
	}
	@media (prefers-reduced-motion: reduce) {
		.q,
		i,
		i::after {
			transition: none;
		}
		.q:global(.flash) {
			animation: none;
		}
	}
</style>
