<!--
  "Eine Vollmacht. Den Wechsel übernehmen wir." (the design's .pg-sec.avm
  #vollmacht): the form in three fieldsets in /messdienst-wechseln/muster-kuendigung's
  `GeneratorFrame`, beside the live preview of the Vollmacht (`vollmacht.ts`).
  The fields are plain state (no `name`, no action): nothing is stored or
  sent; the Word and PDF writers load on the first click, in the design's
  layout for the Vollmacht. Without JS the preview shows the template with
  its placeholders and the buttons are hidden.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import GeneratorFrame from "$lib/landing/pages/muster-kuendigung/components/GeneratorFrame.svelte";
	import type { FileKind } from "$lib/landing/pages/muster-kuendigung/components/types";
	import { germanDay } from "$lib/landing/pages/muster-kuendigung/letter";
	import {
		POWER_KEYS,
		VOLLMACHT_FIELD_KEYS,
		VOLLMACHT_ID,
		vollmacht as T,
		type PowerKey,
		type VollmachtField,
		type VollmachtFieldKey,
	} from "../content";
	import {
		buildVollmacht,
		VOLLMACHT_DOCX,
		VOLLMACHT_PDF,
		vollmachtFileName,
	} from "../vollmacht";

	const clock = getDeadlineClock();

	const fields = $state(
		Object.fromEntries(VOLLMACHT_FIELD_KEYS.map((k) => [k, ""])) as Record<
			VollmachtFieldKey,
			string
		>,
	);
	// Every power is granted at first, as in the design.
	const powers = $state(
		Object.fromEntries(POWER_KEYS.map((k) => [k, true])) as Record<
			PowerKey,
			boolean
		>,
	);

	const letter = $derived(
		buildVollmacht({ fields, powers, today: germanDay(clock.today) }),
	);

	const make = (kind: FileKind) =>
		kind === "docx"
			? import("$lib/landing/pages/muster-kuendigung/docx").then(
					({ makeDocx, DOCX_TYPE }) =>
						new Blob([makeDocx(letter, clock.now, VOLLMACHT_DOCX)], {
							type: DOCX_TYPE,
						}),
				)
			: import("$lib/landing/pages/muster-kuendigung/pdf").then(
					({ makePdf, PDF_TYPE }) =>
						new Blob([makePdf(letter, VOLLMACHT_PDF)], { type: PDF_TYPE }),
				);
</script>

{#snippet doc()}
	<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M8 10h5M8 13h5" />
{/snippet}

{#snippet input(field: VollmachtField)}
	<label>
		<span
			>{field.optional || field.hint
				? `${field.label} `
				: field.label}{#if field.optional}<small>{T.optional}</small
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

<section class="avm" id={VOLLMACHT_ID} aria-labelledby="mw-vm-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="mw-vm-h" eyebrow={T.pill} icon={doc} heading={T.h2} />
			<p class="lead rv">{T.lead}</p>
		</div>
		<GeneratorFrame
			{letter}
			texts={T}
			fileName={(kind) => vollmachtFileName(fields.sName, kind)}
			{make}
		>
			{#snippet form()}
				<fieldset>
					{@render legend(1, T.principal.legend)}
					{#each T.principal.fields as field (field.key)}{@render input(
							field,
						)}{/each}
					<div class="two">
						{#each T.principal.pair as field (field.key)}{@render input(
								field,
							)}{/each}
					</div>
				</fieldset>
				<fieldset>
					{@render legend(2, T.provider.legend)}
					{#each T.provider.fields as field (field.key)}{@render input(
							field,
						)}{/each}
				</fieldset>
				<fieldset>
					{@render legend(3, T.powers.legend)}
					<div class="opts">
						{#each T.powers.items as power (power.key)}
							<label class="opt">
								<input type="checkbox" bind:checked={powers[power.key]} />
								<span><b>{power.title}</b><small>{power.text}</small></span>
							</label>
						{/each}
					</div>
				</fieldset>
			{/snippet}
		</GeneratorFrame>
	</div>
</section>

<style>
	/* .pg-sec.avm: white, on the dark page */
	.avm {
		padding: 104px 0 110px;
		border-top: 1px solid var(--hair);
		background: #fff;
		color: var(--ink);
		scroll-margin-top: 72px;
	}
	/* .avm + .uv-faq: the FAQ after the white block gets its top padding */
	.avm + :global(.uv-faq section.faq) {
		padding-top: 110px;
	}
	.head {
		max-width: 760px;
	}
	/* .dm-h2's 18 px, which the landing heading reset takes away */
	.head :global(h2) {
		margin-top: 18px;
	}
	.lead {
		color: var(--muted);
		font-size: 17px;
		line-height: 1.55;
		margin-top: 16px;
		max-width: 60ch;
	}
	/* The preview's title (.kd-pv .bt) */
	.avm :global(.pv .bt) {
		font-size: 17px;
	}
	@media (max-width: 640px) {
		.avm {
			padding-top: 72px;
		}
	}
</style>
