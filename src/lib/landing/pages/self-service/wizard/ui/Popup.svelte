<!--
  The wizard's pop-up (the design's `.ss-pop`, `role="dialog"`): a hint on
  "Weiter" or "Ihr Angebot ist noch nicht fertig". The first button gets the
  focus; Escape and a click beside the box give the pop-up's `esc` answer.
-->
<script lang="ts">
	import Markup from "./Markup.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { getSelfService, type Popup } from "../wizard.svelte";

	let { p }: { p: Popup } = $props();
	const w = getSelfService();
	let on = $state(false);
	let box = $state<HTMLDivElement>();
	const id = $props.id();

	$effect(() => {
		const raf = requestAnimationFrame(() => (on = true));
		box?.querySelector("button")?.focus();
		return () => cancelAnimationFrame(raf);
	});

	function close(v: string) {
		on = false;
		setTimeout(() => w.answer(v), prefersReducedMotion() ? 0 : 220);
	}
</script>

<svelte:document
	onkeydown={(e) => {
		if (e.key === "Escape") close("");
	}}
/>

<div
	class={["ss-pop", on && "on"]}
	role="dialog"
	aria-modal="true"
	aria-labelledby="{id}-t"
	tabindex="-1"
	onclick={(e) => {
		if (e.target === e.currentTarget) close("");
	}}
	onkeydown={() => {}}
>
	<div class={["ss-pop-b", p.kind]} bind:this={box}>
		<span class="ss-pop-i"
			>{p.kind === "warn" || p.kind === "note" ? "!" : "i"}</span
		>
		<h3 id="{id}-t">{p.title}</h3>
		{#if p.paras?.length || p.items?.length}
			<div class="ss-pop-p">
				{#each p.paras ?? [] as x (x)}<p><Markup html={x} /></p>{/each}
				{#each p.items ?? [] as r (r.title)}
					<div class="ss-rec-r"><b>{r.title}</b><span>{r.text}</span></div>
				{/each}
			</div>
		{/if}
		<div class="ss-pop-a">
			{#each p.buttons as [v, label], i (v)}
				<button
					type="button"
					class={i === 0 ? "bk-next" : "pg-ghost"}
					onclick={() => close(v)}>{label}</button
				>
			{/each}
		</div>
	</div>
</div>
