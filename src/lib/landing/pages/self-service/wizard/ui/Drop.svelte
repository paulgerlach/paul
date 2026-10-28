<!--
  A drop zone (`.ss-drop`, `sm` for photos): a native file picker inside the
  label, drag and drop, and the chosen files as thumbnails with a remove
  button. Nothing is read or uploaded (the wizard keeps names and previews).
-->
<script lang="ts">
	import Markup from "./Markup.svelte";
	import { getSelfService } from "../wizard.svelte";
	import { ICONS } from "../svg";

	let {
		id,
		label,
		hint,
		small = false,
		accept = "image/*",
		max,
	}: {
		id: string;
		label: string;
		hint: string;
		small?: boolean;
		accept?: string;
		max: number;
	} = $props();
	const w = getSelfService();
	let over = $state(false);
	const files = $derived(w.files[id] ?? []);

	function drag(e: DragEvent, on: boolean) {
		e.preventDefault();
		over = on;
	}
</script>

<div>
	<label
		class={["ss-drop", small && "sm", over && "over"]}
		ondragenter={(e) => drag(e, true)}
		ondragover={(e) => drag(e, true)}
		ondragleave={(e) => drag(e, false)}
		ondrop={(e) => {
			drag(e, false);
			if (e.dataTransfer?.files) w.addFiles(id, e.dataTransfer.files, max);
		}}
	>
		<input
			type="file"
			multiple
			{accept}
			onchange={(e) => {
				const input = e.currentTarget;
				if (input.files) w.addFiles(id, input.files, max);
				input.value = "";
			}}
		/>
		<span class="up"><Markup html={small ? ICONS.cam : ICONS.up} /></span>
		<span
			><b>{label}</b>{#if !small}<br />{/if}<small>{hint}</small></span
		>
	</label>
	{#if files.length}
		<div class="ss-thumbs">
			{#each files as f, i (f)}
				<span class="ss-th" title={f.name}
					>{#if f.url}<img src={f.url} alt="" />{:else}PDF{/if}<button
						type="button"
						aria-label="Entfernen"
						onclick={() => w.removeFile(id, i)}>×</button
					></span
				>
			{/each}
		</div>
	{/if}
</div>
