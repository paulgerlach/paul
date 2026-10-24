<!--
  The Media Kit card (#pr-kit): four download links in the design's button
  look. They're plain links with `download` (the files are in
  static/landing/presse/), so they work without JS; a click also marks the
  row and writes "Gespeichert: <file>" in the polite line below, as the
  design does.
-->
<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { DOWNLOAD_BASE, kit } from "../content";

	const saved = new SvelteSet<string>();
	let message = $state("");

	function onsave(file: string) {
		saved.add(file);
		message = `${kit.saved}${file}`;
	}
</script>

<article class="card rv" id="pr-kit">
	<span class="tag">{kit.tag}</span>
	<h2>{kit.h2}</h2>
	<p>{kit.text}</p>
	<div class="dl">
		{#each kit.downloads as item (item.file)}
			<a
				class={[saved.has(item.file) && "ok"]}
				href={`${DOWNLOAD_BASE}${item.file}`}
				download={item.file}
				onclick={() => onsave(item.file)}
			>
				<span><b>{item.title}</b><small>{item.note}</small></span>
				<StrokeIcon
					><path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M4 17h12" /></StrokeIcon
				>
			</a>
		{/each}
	</div>
	<p class="msg" aria-live="polite">{message}</p>
</article>

<style>
	.dl {
		display: grid;
		gap: 8px;
		margin-top: 22px;
	}
	.dl a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		width: 100%;
		text-align: left;
		background: #fff;
		border: 1px solid transparent;
		border-radius: 12px;
		padding: 12px 14px;
		cursor: pointer;
		color: var(--ink);
		transition:
			border-color 0.2s,
			transform 0.2s;
	}
	.dl a:hover {
		border-color: #c9d2ce;
	}
	.dl a:active {
		transform: scale(0.99);
	}
	.dl b {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
	}
	.dl small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 1px;
	}
	.dl :global(svg) {
		width: 16px;
		height: 16px;
		flex: none;
		transition: transform 0.25s;
	}
	.dl a:hover :global(svg) {
		transform: translateY(2px);
	}
	.dl a.ok :global(svg) {
		color: var(--ok);
	}
	/* .pr-msg; the card's `> p` rule (Contact) sets its size and margin, as in the design. */
	.msg {
		font-size: 13px;
		color: var(--muted);
		margin-top: 10px;
		min-height: 18px;
	}
</style>
