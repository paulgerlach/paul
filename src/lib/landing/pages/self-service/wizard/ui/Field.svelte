<!--
  A labelled field (`label.fd`) with an optional tooltip (`.tip.l`, opened by
  its "?"). The control comes as `children`, with the id the label points at
  (the "?" button inside the label would otherwise be its control).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { getSelfService } from "../wizard.svelte";
	import Tip from "./Tip.svelte";
	import TipBox from "./TipBox.svelte";

	let {
		label,
		tip,
		tipImg,
		req = false,
		class: cls = "",
		flash = false,
		children,
	}: {
		label: string;
		tip?: string;
		/** The tooltip's sketch (an SVG's URL). */
		tipImg?: string;
		/** Mark it required (`.rq`, hidden once a photo stands in). */
		req?: boolean;
		class?: string;
		/** Flash the control once (a value set by another answer). */
		flash?: boolean;
		children: Snippet<[string]>;
	} = $props();
	const w = getSelfService();
	const id = $props.id();
	const open = $derived(w.openTip === id);
</script>

<label
	for="{id}-f"
	class={["fd", tip && "tip l", open && "open", flash && "flash", cls]}
	><span
		>{label}{#if req}<i class="rq">*</i>{/if}{#if tip}
			<Tip {id} {open} />{/if}</span
	>{@render children(`${id}-f`)}{#if tip}<TipBox
			{id}
			text={tip}
			svg={tipImg}
		/>{/if}</label
>
