<!--
  "Ihre Kündigung. Live in der Vorschau." (.pg-sec.alt#vorlage, .kd-gen): the
  form in four fieldsets in the shared `GeneratorFrame` (the sticky preview
  with its three buttons). The fields are plain state (no `name`, no action):
  nothing is stored or sent, the letter is derived from them (`letter.ts`),
  and the Word and PDF writers load on the first click. Without JS the
  preview shows the template with its placeholders and the buttons are
  hidden.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import {
		FIELD_KEYS,
		generator as G,
		GENERATOR_ID,
		type ClauseKey,
		type Field,
		type FieldKey,
		type Term,
	} from "../content";
	import GeneratorFrame from "../components/GeneratorFrame.svelte";
	import type { FileKind } from "../components/types";
	import { buildLetter, fileName, germanDay } from "../letter";

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

	const make = (kind: FileKind) =>
		kind === "docx"
			? import("../docx").then(
					({ makeDocx, DOCX_TYPE }) =>
						new Blob([makeDocx(letter, clock.now)], { type: DOCX_TYPE }),
				)
			: import("../pdf").then(
					({ makePdf, PDF_TYPE }) =>
						new Blob([makePdf(letter)], { type: PDF_TYPE }),
				);
</script>

{#snippet list()}
	<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
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
		<GeneratorFrame
			{letter}
			texts={G}
			fileName={(kind) => fileName(fields.mName, kind)}
			{make}
		>
			{#snippet form()}
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
			{/snippet}
		</GeneratorFrame>
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
	/* The switch (.kd-term) */
	section :global(.seg.term) {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4px;
		background: #eef1ef;
		border-radius: 11px;
		padding: 4px;
	}
	section :global(.seg.term button) {
		white-space: normal;
		font-size: 13.5px;
		font-weight: 500;
		padding: 9px 6px;
		border-radius: 8px;
	}
	section :global(.seg.term button.on) {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.12);
	}
	@media (max-width: 640px) {
		section :global(.seg.term) {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
