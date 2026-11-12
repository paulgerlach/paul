<!--
  A group's size selects from the catalog (the design's `casHTML`): each
  offers only the values that fit the ones before it; a change clears the
  later ones that no longer fit and fills in those with one value left
  (flashed, "✓ Automatisch ergänzt: …"). "Anderer Wert" opens a free input,
  a value outside the catalog shows the "Sondermaß" note. Keyed on the
  catalog by its parent, so a new heat meter type starts it again.
-->
<script lang="ts">
	import { onMount, tick } from "svelte";
	import { fieldTip, fieldTipImage } from "../data";
	import {
		FIELD_LABELS,
		FIELDS,
		fieldOptions,
		fitFields,
		FREE_PLACEHOLDERS,
		moveOutsideValues,
		specialSizes,
		type CatId,
		type CatKey,
	} from "../catalog";
	import type { Group } from "../model";
	import Note from "./Note.svelte";
	import Select from "./Select.svelte";
	import Text from "./Text.svelte";

	let { d, id, g }: { d: string; id: CatId; g: Group } = $props();
	const order = $derived(FIELDS[id]);
	const special = $derived(specialSizes(d, g));
	let filled = $state<CatKey[]>([]);
	let flashN = $state<Record<string, number>>({});
	let box: HTMLDivElement;

	onMount(() => moveOutsideValues(id, g));

	async function changed(k: CatKey, v: string) {
		const set = fitFields(id, g, k);
		filled = set;
		for (const f of set) flashN[f] = (flashN[f] ?? 0) + 1;
		if (v !== "andere") return;
		await tick();
		box.querySelector<HTMLInputElement>(`[data-x="${k}"] input`)?.focus();
	}
</script>

<div bind:this={box}>
	<div class={order.length === 4 ? "f2" : "ss-f3"}>
		{#each order as k (k)}
			<div class="ss-sx">
				{#key flashN[k]}
					<Select
						label={FIELD_LABELS[k]}
						req
						bind:value={g[k]}
						options={fieldOptions(d, id, g, k)}
						tip={fieldTip(d, k)}
						tipImg={fieldTipImage(d, k)}
						flash={(flashN[k] ?? 0) > 0}
						onchange={(v) => changed(k, v)}
					/>
				{/key}
				{#if g[k] === "andere"}
					<div class="ss-cond" data-x={k}>
						<Text
							label=""
							bind:value={g[`${k}x`]}
							placeholder={FREE_PLACEHOLDERS[k]}
							type={k === "bl" ? "number" : "text"}
							class="ss-xin"
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<p class="ss-hint">
		Die Auswahl zeigt nur passende Werte. Gibt es nur eine passende Ausführung,
		ergänzen wir die übrigen Angaben automatisch.
	</p>
	{#if filled.length}
		<p class="ss-hint ss-af">
			✓ Automatisch ergänzt: {filled.map((k) => FIELD_LABELS[k]).join(", ")}.
		</p>
	{/if}
	{#if special.length}
		<Note tone="y"
			><b>Sondermaß:</b>
			{special.join(", ")} gehört nicht zu unseren Standardzählern. Solche Maße sind
			ungewöhnlich. Wir prüfen Ihre Angabe und melden uns bei Rückfragen. Ein Foto
			des Typenschilds hilft uns dabei.</Note
		>
	{/if}
</div>
