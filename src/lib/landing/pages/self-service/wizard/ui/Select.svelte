<!-- A select field with "Bitte wählen" (the design's `sel`). -->
<script lang="ts">
	import type { Option } from "../data";
	import Field from "./Field.svelte";

	let {
		label,
		value = $bindable(),
		options,
		tip,
		class: cls = "",
		flash = false,
		onchange,
	}: {
		label: string;
		value: string;
		options: readonly Option[];
		tip?: string;
		class?: string;
		flash?: boolean;
		onchange?: (value: string) => void;
	} = $props();
</script>

<Field {label} {tip} {flash} class={cls}>
	{#snippet children(id)}
		<select {id} bind:value onchange={() => onchange?.(value)}>
			<option value="">Bitte wählen</option>
			{#each options as [v, text] (v)}
				<option value={v}>{text}</option>
			{/each}
		</select>
	{/snippet}
</Field>
