<!--
  The hero's featured story (.bl-feat): the photo on the left, the badge, the
  topic, the title, the text and the "more" line. A link only while the story's
  page exists (plan README, Links); without one it doesn't lift on hover and
  has no "more" line.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { TOPIC_LABELS, type Story } from "../content";
	import { photos } from "../photos";

	let { badge, story }: { badge: string; story: Story } = $props();
</script>

<svelte:element
	this={story.more ? "a" : "div"}
	class={["feat rv", story.more && "link"]}
	href={story.more?.href}
>
	<figure>
		<Image
			src={photos[story.photo]}
			alt=""
			sizes="(max-width: 1040px) 100vw, 680px"
			priority
		/>
	</figure>
	<div class="body">
		<span class="meta"
			><b>{badge}</b><span>{TOPIC_LABELS[story.topic]}</span></span
		>
		<h2>{story.title}</h2>
		{#if story.text}<p>{story.text}</p>{/if}
		{#if story.more}
			<span class="more"
				>{story.more.text} <span class="ar" aria-hidden="true">→</span></span
			>
		{/if}
	</div>
</svelte:element>

<style>
	.feat {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: 40px;
		align-items: center;
		margin-top: 52px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 24px;
		padding: 18px;
		color: var(--ink);
		text-decoration: none;
		transition:
			box-shadow 0.35s,
			transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.link:hover {
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.45);
		transform: translateY(-3px);
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
	.body {
		padding: 12px 22px 12px 0;
	}
	/* .bl-meta */
	.meta {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		font-size: 13px;
		color: var(--muted);
	}
	.meta b {
		background: var(--accent);
		color: var(--ink);
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 10px;
	}
	.meta > span {
		background: #eef1ef;
		color: var(--ink);
		font-weight: 500;
		border-radius: 999px;
		padding: 3px 10px;
		font-size: 12.5px;
	}
	/* `.body h2` beats the landing reset of heading margins. */
	.body h2 {
		font-size: clamp(26px, 2.6vw, 38px);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 1.12;
		margin-top: 16px;
	}
	p {
		color: var(--muted);
		font-size: 16.5px;
		line-height: 1.5;
		margin-top: 14px;
	}
	.more {
		display: inline-flex;
		gap: 6px;
		margin-top: 22px;
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
		.link:hover,
		.link:hover figure :global(img),
		.link:hover .ar {
			transform: none;
		}
	}
	@media (max-width: 1040px) {
		.feat {
			grid-template-columns: 1fr;
			gap: 8px;
		}
		.body {
			padding: 14px 8px 8px;
		}
	}
</style>
