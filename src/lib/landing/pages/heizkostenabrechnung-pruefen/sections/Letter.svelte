<!--
  The letter section (.mc-letter-sec, #schreiben): only once "Musterschreiben
  erstellen" made the letter; a new result hides it again. The text stays
  editable; "Text kopieren" selects it and copies (the Clipboard API, with
  the design's execCommand fallback), then reads "Kopiert" or "Text
  markiert, bitte mit Strg+C kopieren" for 2.4 s.
-->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import Head from "../components/Head.svelte";
	import { getBillCheck } from "../check.svelte";
	import { letter, LETTER_ID } from "../content";

	const check = getBillCheck();

	let area: HTMLTextAreaElement | undefined = $state();
	let label = $state(letter.copy);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function show(ok: boolean) {
		label = ok ? letter.copied : letter.selected;
		clearTimeout(timer);
		timer = setTimeout(() => (label = letter.copy), 2400);
	}

	function copy() {
		if (!area) return;
		area.select();
		let ok = false;
		try {
			ok = document.execCommand("copy");
		} catch {
			// The text stays selected for the visitor to copy.
		}
		if (navigator.clipboard?.writeText)
			navigator.clipboard.writeText(area.value).then(
				() => show(true),
				() => show(ok),
			);
		else show(ok);
	}

	$effect(() => () => clearTimeout(timer));
</script>

{#if check.letter !== null}
	<section class="pg-sec alt" id={LETTER_ID} aria-labelledby="ls-h">
		<div class="wrap lw">
			<div>
				<Head id="ls-h" pill={letter.pill} symbol="doc" heading={letter.h2} />
				<p class="lead">{letter.lead}</p>
				<p class="lnote">{letter.note}</p>
			</div>
			<div class="paper">
				<textarea
					bind:this={area}
					rows="18"
					aria-label={letter.label}
					bind:value={() => check.letter ?? "", (v) => (check.letter = v)}
				></textarea>
				<button type="button" class="bk-next copy" onclick={copy}
					><Icon name="clipboard" /><span aria-live="polite">{label}</span
					></button
				>
			</div>
		</div>
	</section>
{/if}

<style>
	.lw {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: 56px;
		align-items: start;
	}
	/* .dm-lead */
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.lnote {
		font-size: 13px;
		color: var(--faint);
		margin-top: 18px;
	}
	.paper {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 18px;
		box-shadow: 0 24px 48px -36px rgba(30, 50, 45, 0.4);
	}
	textarea {
		width: 100%;
		border: 0;
		resize: vertical;
		font: inherit;
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--ink);
		background: transparent;
		min-height: 380px;
		/* The browser's padding (Tailwind's preflight zeroes it). */
		padding: 2px;
	}
	textarea:focus {
		outline: 0;
	}
	.copy {
		margin-top: 12px;
	}
	.copy :global(svg) {
		width: 16px;
		height: 16px;
	}
	@media (max-width: 1040px) {
		.lw {
			grid-template-columns: minmax(0, 1fr);
			gap: 32px;
		}
	}
</style>
