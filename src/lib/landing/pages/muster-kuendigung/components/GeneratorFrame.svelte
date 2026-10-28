<!--
  The design's letter generator (.kd-gen): the page's form in `form`, beside
  the sticky preview with "Word herunterladen", "PDF" and "Text kopieren",
  the status line and the legal note. Shared by
  /messdienst-wechseln/muster-kuendigung (the Kündigung) and
  /messdienst-wechseln (the Vollmacht). The form's fields are the page's;
  every field style (.kd-form) is a `:global` rule under `.form` here.
  Nothing is stored or sent: the page passes the letter derived from its
  fields and `make`, which loads its Word or PDF writer on the first click.
  A page may pass `onaction`, called after a download starts or a copy
  works (the Kündigung reports the button, never the letter).
  Without JS the buttons are hidden.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { onDestroy } from "svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import { plainText, type Paragraph } from "../letter";
	import Preview from "./Preview.svelte";
	import type { FileKind, GeneratorAction, GeneratorTexts } from "./types";

	let {
		letter,
		texts,
		fileName,
		make,
		form,
		onaction,
	}: {
		letter: Paragraph[];
		texts: GeneratorTexts;
		fileName: (kind: FileKind) => string;
		/** The file's contents (loads its writer with `import()`). */
		make: (kind: FileKind) => Promise<Blob>;
		/** The fieldsets. */
		form: Snippet;
		/** After a download started or the copy worked. */
		onaction?: (action: GeneratorAction) => void;
	} = $props();

	const text = $derived(plainText(letter));

	let busy = $state<FileKind | null>(null);
	let copied = $state(false);
	let status = $state({ text: "", error: false });

	let timers: ReturnType<typeof setTimeout>[] = [];
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	let stopConfetti = () => {};
	onDestroy(() => {
		for (const t of timers) clearTimeout(t);
		clearTimeout(copyTimer);
		stopConfetti();
	});

	function say(t: string, error = false) {
		status = { text: t, error };
	}

	async function save(kind: FileKind, button: HTMLButtonElement) {
		if (busy) return;
		busy = kind;
		say("");
		try {
			const name = fileName(kind);
			const url = URL.createObjectURL(await make(kind));
			const a = document.createElement("a");
			a.href = url;
			a.download = name;
			document.body.append(a);
			a.click();
			const timer = setTimeout(() => {
				URL.revokeObjectURL(url);
				a.remove();
				timers = timers.filter((t) => t !== timer);
			}, 1500);
			timers.push(timer);
			say(texts.messages.started + name);
			onaction?.(kind);
			stopConfetti();
			stopConfetti = confettiFrom(button);
		} catch {
			say(texts.messages.failed, true);
		} finally {
			busy = null;
		}
	}

	/** The design's way: a hidden textarea and `execCommand("copy")`. */
	function copyByCommand(value: string) {
		const area = document.createElement("textarea");
		area.value = value;
		area.style.cssText = "position:fixed;opacity:0";
		document.body.append(area);
		area.select();
		try {
			return document.execCommand("copy");
		} catch {
			return false;
		} finally {
			area.remove();
		}
	}

	async function copy() {
		let ok: boolean;
		try {
			await navigator.clipboard.writeText(text);
			ok = true;
		} catch {
			ok = copyByCommand(text);
		}
		if (!ok) {
			say(texts.messages.copyFailed, true);
			return;
		}
		copied = true;
		onaction?.("copy");
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

{#snippet download()}
	<StrokeIcon><path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M4 17h12" /></StrokeIcon>
{/snippet}

<div class="gen">
	<form
		class="form"
		autocomplete="on"
		novalidate
		onsubmit={(e) => e.preventDefault()}
	>
		{@render form()}
	</form>

	<div class="pv-w">
		<Preview {letter} label={texts.previewLabel} signature={texts.signature} />
		<div class="dl">
			<button
				type="button"
				class="bk"
				disabled={busy === "docx"}
				onclick={(e) => save("docx", e.currentTarget)}
				>{@render download()}<span
					>{busy === "docx" ? texts.buttons.busy : texts.buttons.docx}</span
				></button
			>
			<button
				type="button"
				class="ghost"
				disabled={busy === "pdf"}
				onclick={(e) => save("pdf", e.currentTarget)}
				>{@render download()}<span
					>{busy === "pdf" ? texts.buttons.busy : texts.buttons.pdf}</span
				></button
			>
			<button type="button" class="ghost" onclick={copy}
				><StrokeIcon
					><rect x="4.5" y="3.5" width="11" height="14" rx="2" /><path
						d="M7.5 3.5V2.5h5v1M7.5 9l1.8 1.8L13 7.5M7.5 14h5"
					/></StrokeIcon
				><span>{copied ? texts.buttons.copied : texts.buttons.copy}</span
				></button
			>
		</div>
		<p class={["msg", status.error && "err"]} role="status">
			{status.text}
		</p>
		<p class="legal">{texts.legal}</p>
	</div>
</div>

<style>
	.gen {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 24px;
		margin-top: 44px;
		align-items: start;
	}

	/* The form (.kd-form) */
	.form {
		display: grid;
		gap: 14px;
	}
	.form :global(fieldset) {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 18px;
		padding: 20px;
		margin: 0;
		display: grid;
		gap: 12px;
		min-width: 0;
	}
	.form :global(legend) {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 15px;
		font-weight: 600;
		padding: 0;
		float: left;
		width: 100%;
		margin-bottom: 4px;
	}
	.form :global(legend i) {
		font-style: normal;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		font-size: 12.5px;
	}
	.form :global(label) {
		display: grid;
		gap: 6px;
		min-width: 0;
	}
	.form :global(label > span) {
		font-size: 13px;
		font-weight: 600;
	}
	.form :global(small) {
		font-weight: 400;
		color: var(--faint);
	}
	.form :global(input[type="text"]),
	.form :global(input[type="date"]),
	.form :global(textarea) {
		font: inherit;
		font-size: 14.5px;
		color: var(--ink);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 10px 12px;
		width: 100%;
		min-width: 0;
	}
	.form :global(textarea) {
		resize: vertical;
		min-height: 76px;
	}
	.form :global(input:focus),
	.form :global(textarea:focus) {
		outline: 0;
		border-color: var(--ink);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	/* Two fields side by side (.kd-2) */
	.form :global(.two) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	/* The checkboxes (.kd-opts, .kd-opt) */
	.form :global(.opts) {
		display: grid;
		gap: 8px;
	}
	.form :global(label.opt) {
		grid-template-columns: 22px 1fr;
		align-items: start;
		gap: 12px;
		padding: 11px 12px;
		border: 1px solid var(--hair);
		border-radius: 12px;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.form :global(label.opt:has(input:checked)) {
		border-color: #c9d8cd;
		background: #f4faf5;
	}
	.form :global(.opt input) {
		appearance: none;
		width: 20px;
		height: 20px;
		border: 1.5px solid #c9d2ce;
		border-radius: 6px;
		margin: 1px 0 0;
		display: grid;
		place-items: center;
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.form :global(.opt input:checked) {
		background: var(--ink);
		border-color: var(--ink);
	}
	.form :global(.opt input:checked::after) {
		content: "";
		width: 9px;
		height: 5px;
		border: 2px solid var(--accent);
		border-top: 0;
		border-right: 0;
		transform: rotate(-45deg) translate(1px, -1px);
	}
	.form :global(.opt input:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	.form :global(.opt b) {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.form :global(.opt small) {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 1px;
	}

	/* The preview's column (.kd-pv-w) */
	.pv-w {
		position: sticky;
		top: 88px;
	}
	.dl {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr;
		gap: 8px;
		margin-top: 14px;
	}
	.dl button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font: inherit;
		font-weight: 600;
		border-radius: 11px;
		cursor: pointer;
	}
	.dl button :global(svg) {
		width: 16px;
		height: 16px;
		flex: none;
	}
	/* .bk-next */
	.dl .bk {
		border: 0;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		padding: 13px 14px;
		transition:
			background 0.2s,
			transform 0.15s,
			opacity 0.2s;
	}
	.bk:hover:not(:disabled) {
		background: #2a443d;
	}
	.bk:active:not(:disabled) {
		transform: scale(0.98);
	}
	.bk:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	/* .pg-ghost */
	.dl .ghost {
		border: 1px solid var(--hair);
		background: #fff;
		color: var(--ink);
		font-size: 14.5px;
		padding: 12px 10px;
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.ghost:disabled {
		cursor: progress;
	}
	.msg {
		font-size: 13.5px;
		margin-top: 10px;
		min-height: 1.4em;
		color: #2f7a3c;
		font-weight: 500;
	}
	.msg.err {
		color: #b5471a;
	}
	.legal {
		font-size: 12.5px;
		color: var(--faint);
		margin-top: 4px;
	}
	/* Without JS the buttons can't make anything. */
	@media (scripting: none) {
		.dl {
			display: none;
		}
	}

	@media (max-width: 1040px) {
		.gen {
			grid-template-columns: minmax(0, 1fr);
		}
		.pv-w {
			position: static;
		}
	}
	@media (max-width: 640px) {
		.form :global(.two) {
			grid-template-columns: minmax(0, 1fr);
		}
		.dl {
			grid-template-columns: 1fr 1fr;
		}
		.dl .bk {
			grid-column: 1 / -1;
		}
	}
</style>
