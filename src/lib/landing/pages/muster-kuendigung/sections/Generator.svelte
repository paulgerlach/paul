<!--
  "Ihre Kündigung. Live in der Vorschau." (.pg-sec.alt#vorlage, .kd-gen): the
  form in four fieldsets and the sticky preview with its three buttons. The
  fields are plain state (no `name`, no action): nothing is stored or sent,
  the letter is derived from them (`letter.ts`), and the Word and PDF writers
  load on the first click. Without JS the preview shows the template with its
  placeholders and the buttons are hidden.
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import {
		FIELD_KEYS,
		generator as G,
		GENERATOR_ID,
		type ClauseKey,
		type Field,
		type FieldKey,
		type Term,
	} from "../content";
	import { buildLetter, fileName, germanDay, plainText } from "../letter";
	import Preview from "./Preview.svelte";

	const clock = getDeadlineClock();

	const fields = $state(
		Object.fromEntries(FIELD_KEYS.map((k) => [k, ""])) as Record<
			FieldKey,
			string
		>,
	);
	const clauses = $state(
		Object.fromEntries(
			G.clauses.items.map((c) => [c.key, c.checked]),
		) as Record<ClauseKey, boolean>,
	);
	let term = $state<Term>("next");

	const letter = $derived(
		buildLetter({ fields, clauses, term, today: germanDay(clock.today) }),
	);
	const text = $derived(plainText(letter));

	let busy = $state<"docx" | "pdf" | null>(null);
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

	async function save(kind: "docx" | "pdf", button: HTMLButtonElement) {
		if (busy) return;
		busy = kind;
		say("");
		try {
			const name = fileName(fields.mName, kind);
			const blob =
				kind === "docx"
					? await import("../docx").then(
							({ makeDocx, DOCX_TYPE }) =>
								new Blob([makeDocx(letter, clock.now)], { type: DOCX_TYPE }),
						)
					: await import("../pdf").then(
							({ makePdf, PDF_TYPE }) =>
								new Blob([makePdf(letter)], { type: PDF_TYPE }),
						);
			const url = URL.createObjectURL(blob);
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
			say(G.messages.started + name);
			stopConfetti();
			stopConfetti = confettiFrom(button);
		} catch {
			say(G.messages.failed, true);
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
			say(G.messages.copyFailed, true);
			return;
		}
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 2000);
	}
</script>

{#snippet list()}
	<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
{/snippet}

{#snippet download()}
	<StrokeIcon><path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M4 17h12" /></StrokeIcon>
{/snippet}

{#snippet input(field: Field)}
	<label>
		<span
			>{field.optional || field.hint
				? `${field.label} `
				: field.label}{#if field.optional}<small>{G.optional}</small
				>{:else if field.hint}<small>{field.hint}</small>{/if}</span
		>
		{#if field.multiline}
			<textarea
				bind:value={fields[field.key]}
				rows="3"
				placeholder={field.placeholder}></textarea>
		{:else}
			<input
				type="text"
				bind:value={fields[field.key]}
				placeholder={field.placeholder}
			/>
		{/if}
	</label>
{/snippet}

{#snippet legend(n: number, text: string)}
	<legend><i>{n}</i>{text}</legend>
{/snippet}

<section class="pg-sec alt" id={GENERATOR_ID} aria-labelledby="mk-gen-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="mk-gen-h" eyebrow={G.pill} icon={list} heading={G.h2} />
		</div>
		<div class="gen">
			<form
				class="form"
				autocomplete="on"
				novalidate
				onsubmit={(e) => e.preventDefault()}
			>
				<fieldset>
					{@render legend(1, G.sender.legend)}
					{#each G.sender.fields as field (field.key)}{@render input(
							field,
						)}{/each}
					<div class="two">
						{#each G.sender.pair as field (field.key)}{@render input(
								field,
							)}{/each}
					</div>
				</fieldset>
				<fieldset>
					{@render legend(2, G.provider.legend)}
					{#each G.provider.fields as field (field.key)}{@render input(
							field,
						)}{/each}
				</fieldset>
				<fieldset>
					{@render legend(3, G.properties.legend)}
					{@render input(G.properties.field)}
					<Segmented
						class="term"
						options={G.properties.terms}
						bind:value={term}
						label={G.properties.termLabel}
					/>
					{#if term === "date"}
						<label>
							<span>{G.properties.dateLabel}</span>
							<input type="date" bind:value={fields.datum} />
						</label>
					{/if}
				</fieldset>
				<fieldset>
					{@render legend(4, G.clauses.legend)}
					<div class="opts">
						{#each G.clauses.items as clause (clause.key)}
							<label class="opt">
								<input type="checkbox" bind:checked={clauses[clause.key]} />
								<span><b>{clause.title}</b><small>{clause.text}</small></span>
							</label>
						{/each}
					</div>
				</fieldset>
			</form>

			<div class="pv-w">
				<Preview {letter} />
				<div class="dl">
					<button
						type="button"
						class="bk"
						disabled={busy === "docx"}
						onclick={(e) => save("docx", e.currentTarget)}
						>{@render download()}<span
							>{busy === "docx" ? G.buttons.busy : G.buttons.docx}</span
						></button
					>
					<button
						type="button"
						class="ghost"
						disabled={busy === "pdf"}
						onclick={(e) => save("pdf", e.currentTarget)}
						>{@render download()}<span
							>{busy === "pdf" ? G.buttons.busy : G.buttons.pdf}</span
						></button
					>
					<button type="button" class="ghost" onclick={copy}
						><StrokeIcon
							><rect x="4.5" y="3.5" width="11" height="14" rx="2" /><path
								d="M7.5 3.5V2.5h5v1M7.5 9l1.8 1.8L13 7.5M7.5 14h5"
							/></StrokeIcon
						><span>{copied ? G.buttons.copied : G.buttons.copy}</span></button
					>
				</div>
				<p class={["msg", status.error && "err"]} role="status">
					{status.text}
				</p>
				<p class="legal">{G.legal}</p>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		scroll-margin-top: 72px;
	}
	.head {
		max-width: 760px;
	}
	/* .dm-h2's 18 px, which the landing heading reset takes away */
	.head :global(h2) {
		margin-top: 18px;
	}
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
	fieldset {
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 18px;
		padding: 20px;
		margin: 0;
		display: grid;
		gap: 12px;
		min-width: 0;
	}
	legend {
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
	legend i {
		font-style: normal;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		font-size: 12.5px;
	}
	label {
		display: grid;
		gap: 6px;
		min-width: 0;
	}
	label > span {
		font-size: 13px;
		font-weight: 600;
	}
	small {
		font-weight: 400;
		color: var(--faint);
	}
	input[type="text"],
	input[type="date"],
	textarea {
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
	textarea {
		resize: vertical;
		min-height: 76px;
	}
	input:focus,
	textarea:focus {
		outline: 0;
		border-color: var(--ink);
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.35);
	}
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	/* The switch (.kd-term) */
	.form :global(.seg.term) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		background: #eef1ef;
		border-radius: 11px;
		padding: 4px;
	}
	.form :global(.seg.term button) {
		white-space: normal;
		font-size: 13.5px;
		font-weight: 500;
		padding: 9px 6px;
		border-radius: 8px;
	}
	.form :global(.seg.term button.on) {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.12);
	}
	/* The clauses (.kd-opt) */
	.opts {
		display: grid;
		gap: 8px;
	}
	label.opt {
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
	label.opt:has(input:checked) {
		border-color: #c9d8cd;
		background: #f4faf5;
	}
	.opt input {
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
	.opt input:checked {
		background: var(--ink);
		border-color: var(--ink);
	}
	.opt input:checked::after {
		content: "";
		width: 9px;
		height: 5px;
		border: 2px solid var(--accent);
		border-top: 0;
		border-right: 0;
		transform: rotate(-45deg) translate(1px, -1px);
	}
	.opt input:focus-visible {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}
	.opt b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.opt small {
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
		.two {
			grid-template-columns: minmax(0, 1fr);
		}
		.dl {
			grid-template-columns: 1fr 1fr;
		}
		.dl .bk {
			grid-column: 1 / -1;
		}
		.form :global(.seg.term) {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
