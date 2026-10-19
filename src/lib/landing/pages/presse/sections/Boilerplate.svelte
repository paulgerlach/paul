<!--
  "Über Heidi Systems." (.pr-bp): the boilerplate with "Text kopieren". The
  button writes the paragraph to the clipboard (or, without the Clipboard
  API, selects it and copies, the design's fallback) and shows "Kopiert" for
  2.2 s. Without JS it's hidden; the paragraph stays selectable.
-->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { boilerplate } from "../content";

	let copied = $state(false);
	let paragraph: HTMLParagraphElement;
	let timer: ReturnType<typeof setTimeout> | undefined;

	function done() {
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 2200);
	}

	function fallback() {
		const range = document.createRange();
		range.selectNodeContents(paragraph);
		const selection = getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
		try {
			if (document.execCommand("copy")) done();
		} catch {
			// Nothing to do: the text stays selected for the visitor to copy.
		}
	}

	function copy() {
		if (navigator.clipboard?.writeText)
			navigator.clipboard.writeText(boilerplate.text).then(done, fallback);
		else fallback();
	}

	$effect(() => () => clearTimeout(timer));
</script>

<section class="sec" aria-labelledby="pr-bh">
	<div class="wrap">
		<div class="bp rv">
			<div class="bph">
				<h2 class="pr-h" id="pr-bh">{boilerplate.h2}</h2>
				<button type="button" class={["copy", copied && "ok"]} onclick={copy}>
					<StrokeIcon
						><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
							d="M12 2.5V6h3.5M8 10h5M8 13h5"
						/></StrokeIcon
					>
					<span>{copied ? boilerplate.copied : boilerplate.copy}</span>
				</button>
			</div>
			<p class="bt" bind:this={paragraph}>{boilerplate.text}</p>
			<p class="sr-only" role="status">{copied ? boilerplate.status : ""}</p>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 56px 0;
	}
	.bp {
		border-top: 1px solid var(--hair);
		border-bottom: 1px solid var(--hair);
		padding: 36px 0;
	}
	.bph {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
	}
	.copy {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font: inherit;
		font-size: 13.5px;
		font-weight: 600;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 10px;
		padding: 9px 13px;
		cursor: pointer;
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.copy:hover {
		border-color: #c9d2ce;
	}
	.copy.ok {
		background: #eef6ef;
		border-color: #cfe3d3;
		color: #2f7a3c;
	}
	.copy :global(svg) {
		width: 15px;
		height: 15px;
	}
	.bt {
		font-size: clamp(17px, 1.5vw, 21px);
		line-height: 1.6;
		color: #3e4d49;
		margin-top: 22px;
		max-width: 70ch;
	}
	@media (scripting: none) {
		.copy {
			display: none;
		}
	}
</style>
