<!--
  A story card (.bl-card): the photo, the topic, the title and the "more"
  line at the bottom. A link only while the story's page exists (plan README,
  Links). `hidden` while the filter leaves it out (the design's `.hide`).
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { TOPIC_LABELS, type Story } from "../content";
	import { photos } from "../photos";

	let { story, hidden = false }: { story: Story; hidden?: boolean } = $props();
</script>

<svelte:element
	this={story.more ? "a" : "article"}
	class={["card rv", story.more && "link"]}
	href={story.more?.href}
	{hidden}
>
	<figure>
		<Image
			src={photos[story.photo]}
			alt=""
			sizes="(max-width: 720px) 100vw, (max-width: 1040px) 50vw, 400px"
		/>
	</figure>
	<span class="meta"><span>{TOPIC_LABELS[story.topic]}</span></span>
	<h3>{story.title}</h3>
	{#if story.more}
		<span class="more"
			>{story.more.text} <span class="ar" aria-hidden="true">→</span></span
		>
	{/if}
</svelte:element>

<style>
	.card {
		display: flex;
		flex-direction: column;
		color: var(--ink);
		text-decoration: none;
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	.card[hidden] {
		display: none;
	}
	figure {
		margin: 0;
		border-radius: 16px;
		overflow: hidden;
		aspect-ratio: 16/10;
		background: #e9ecea;
	}
	figure :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.link:hover figure :global(img) {
		transform: scale(1.04);
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 18px;
		font-size: 13px;
		color: var(--muted);
	}
	.meta > span {
		background: #eef1ef;
		color: var(--ink);
		font-weight: 500;
		border-radius: 999px;
		padding: 3px 10px;
		font-size: 12.5px;
	}
	/* `.card h3` beats the landing reset of heading margins. */
	.card h3 {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.02em;
		line-height: 1.3;
		margin-top: 12px;
	}
	.more {
		display: inline-flex;
		gap: 6px;
		margin-top: auto;
		padding-top: 16px;
		font-weight: 600;
		font-size: 15px;
	}
	.ar {
		transition: transform 0.25s;
	}
	.link:hover .ar {
		transform: translateX(3px);
	}
	@media (prefers-reduced-motion: reduce) {
		.link:hover figure :global(img),
		.link:hover .ar {
			transform: none;
		}
	}
</style>
