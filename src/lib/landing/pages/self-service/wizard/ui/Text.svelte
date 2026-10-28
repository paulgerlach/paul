<!-- An input or textarea field (the design's `inp` / `area`). -->
<script lang="ts">
	import Field from "./Field.svelte";

	let {
		label,
		value = $bindable(),
		placeholder,
		type = "text",
		tip,
		area = false,
		class: cls = "",
		autocomplete,
		inputmode,
	}: {
		label: string;
		value: string;
		placeholder?: string;
		type?: "text" | "number" | "email" | "tel" | "date";
		tip?: string;
		area?: boolean;
		class?: string;
		autocomplete?: HTMLInputElement["autocomplete"];
		inputmode?: "numeric" | "text" | "email" | "tel";
	} = $props();
</script>

<Field {label} {tip} class={cls}>
	{#snippet children(id)}
		{#if area}
			<textarea {id} bind:value rows="2" placeholder={placeholder ?? ""}
			></textarea>
		{:else if type === "number"}
			<!-- Not `bind:value`, which would store a number: the state keeps the
		     raw text, as every other field. -->
			<input
				{id}
				{value}
				oninput={(e) => (value = e.currentTarget.value)}
				{placeholder}
				type="number"
				min="0"
				inputmode="numeric"
				aria-label={label ? undefined : placeholder}
			/>
		{:else}
			<input
				{id}
				bind:value
				{placeholder}
				{type}
				{autocomplete}
				{inputmode}
				aria-label={label ? undefined : placeholder}
			/>
		{/if}
	{/snippet}
</Field>
