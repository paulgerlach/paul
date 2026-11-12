<!--
  A question's heading (`p.ss-q`, `p.ss-sub` or `p.ss-lab`), with an optional
  hint (`em`) and tooltip (`.fd.tip.l.qh`, the "?" before the hint).
-->
<script lang="ts">
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import { getSelfService } from "../wizard.svelte";
	import Tip from "./Tip.svelte";
	import TipBox from "./TipBox.svelte";

	let {
		text,
		hint,
		kind = "q",
		tip,
		img,
		top,
		req = false,
	}: {
		text: string;
		hint?: string;
		kind?: "q" | "sub" | "lab";
		tip?: string;
		img?: ImageAsset;
		/** The design's inline top margin, px. */
		top?: number;
		/** Mark it required (`.rq`, hidden once a photo stands in). */
		req?: boolean;
	} = $props();
	const w = getSelfService();
	const id = $props.id();
	const open = $derived(w.openTip === id);
</script>

{#snippet heading()}
	<p class="ss-{kind}" style:margin-top={top ? `${top}px` : undefined}>
		{text}{#if req}<i class="rq">*</i>{/if}{#if tip}
			<Tip {id} {open} />{/if}{#if hint}
			<em>{hint}</em>{/if}
	</p>
{/snippet}

{#if tip}
	<div class={["fd tip l qh", open && "open"]}>
		{@render heading()}<TipBox {id} text={tip} {img} />
	</div>
{:else}
	{@render heading()}
{/if}
