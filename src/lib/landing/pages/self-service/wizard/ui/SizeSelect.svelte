<!--
  A standard size with a free value (the design's `selN`): "Anderer Wert"
  opens an input below and focuses it; `unknown` adds "Unbekannt".
-->
<script lang="ts">
	import { tick } from "svelte";
	import { fieldTip, SIZES, type SizeKey } from "../data";
	import type { Group } from "../model";
	import Select from "./Select.svelte";
	import Text from "./Text.svelte";

	let {
		k,
		label,
		g,
		step,
		unknown = false,
	}: {
		k: SizeKey;
		label: string;
		g: Group;
		/** The step, for the tooltip. */
		step: string;
		unknown?: boolean;
	} = $props();

	const options = $derived([
		...SIZES[k].options,
		["andere", "Anderer Wert"] as const,
		...(unknown ? [["unbekannt", "Unbekannt"] as const] : []),
	]);
	const free = $derived(`${k}x` as const);
	let box = $state<HTMLDivElement>();
</script>

<div class="ss-sx">
	<Select
		{label}
		bind:value={g[k]}
		{options}
		tip={fieldTip(step, k)}
		onchange={async (v) => {
			if (v !== "andere") return;
			await tick();
			box?.querySelector("input")?.focus();
		}}
	/>
	{#if g[k] === "andere"}
		<div class="ss-cond" bind:this={box}>
			<Text
				label=""
				bind:value={g[free]}
				placeholder={SIZES[k].placeholder}
				type={k === "bl" ? "number" : "text"}
				class="ss-xin"
			/>
		</div>
	{/if}
</div>
