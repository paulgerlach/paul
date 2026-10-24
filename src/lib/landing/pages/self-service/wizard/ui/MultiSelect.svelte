<!--
  A multiple choice as a dropdown (the design's `.hzm`): the button shows the
  chosen values as chips and their count; the list's options toggle
  ("Unbekannt" clears the others and is cleared by them), "Zurücksetzen"
  empties it, "Übernehmen" or Escape or a click outside closes it.
-->
<script lang="ts">
	import Markup from "./Markup.svelte";
	import { tick } from "svelte";
	import type { Option } from "../data";
	import { CHECK } from "../svg";

	let {
		options,
		value,
		placeholder,
		onchange,
		label,
	}: {
		options: readonly Option[];
		value: string[];
		placeholder: string;
		onchange: (value: string[]) => void;
		label: string;
	} = $props();

	let open = $state(false);
	let root: HTMLDivElement;
	let button: HTMLButtonElement;
	let pop = $state<HTMLDivElement>();
	const chosen = $derived(options.filter(([v]) => value.includes(v)));

	async function toggle(to: boolean) {
		open = to;
		if (to) {
			await tick();
			pop?.querySelector<HTMLButtonElement>(".hzm-o")?.focus({
				preventScroll: true,
			});
		}
	}

	function pick(v: string) {
		let next = [...value];
		const i = next.indexOf(v);
		if (i > -1) next.splice(i, 1);
		else if (v === "unbekannt") next = [v];
		else next = [...next.filter((x) => x !== "unbekannt"), v];
		onchange(options.map(([k]) => k).filter((k) => next.includes(k)));
	}

	function close() {
		open = false;
		button.focus();
	}
</script>

<svelte:document
	onclick={(e) => {
		if (open && !root.contains(e.target as Node)) open = false;
	}}
/>

<div
	class={["hzm", open && "open"]}
	bind:this={root}
	onkeydown={(e) => {
		if (e.key === "Escape" && open) close();
	}}
	role="presentation"
>
	<button
		type="button"
		class="hzm-btn"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-label="{label}: {chosen.length
			? chosen.map(([, t]) => t).join(', ')
			: placeholder}"
		bind:this={button}
		onclick={(e) => {
			e.stopPropagation();
			toggle(!open);
		}}
	>
		<span class="hzm-val"
			>{#each chosen as [v, t] (v)}<span class="hzm-chip">{t}</span>{:else}<span
					class="hzm-ph">{placeholder}</span
				>{/each}</span
		>{#if chosen.length}<span class="hzm-n">{chosen.length}</span>{/if}<svg
			class="hzm-ar"
			viewBox="0 0 12 8"
			aria-hidden="true"
			><path
				d="M1 1.5l5 5 5-5"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			/></svg
		>
	</button>
	{#if open}
		<div
			class="hzm-pop"
			role="listbox"
			aria-multiselectable="true"
			aria-label={label}
			bind:this={pop}
		>
			{#each options as [v, t] (v)}
				<button
					type="button"
					class={["hzm-o", value.includes(v) && "on"]}
					role="option"
					aria-selected={value.includes(v)}
					onclick={(e) => {
						e.stopPropagation();
						pick(v);
					}}><i><Markup html={CHECK} /></i><span>{t}</span></button
				>
			{/each}
			<div class="hzm-ft">
				<button
					type="button"
					class="hzm-clr"
					onclick={(e) => {
						e.stopPropagation();
						onchange([]);
					}}>Zurücksetzen</button
				><button
					type="button"
					class="hzm-ok"
					onclick={(e) => {
						e.stopPropagation();
						close();
					}}>Übernehmen</button
				>
			</div>
		</div>
	{/if}
</div>
