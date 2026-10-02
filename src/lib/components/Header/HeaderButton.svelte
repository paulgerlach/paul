<script lang="ts">
	import { menu } from "./menu.svelte";

	let { scrolled }: { scrolled: boolean } = $props();
</script>

<button
	onclick={() => menu.toggle()}
	aria-label="Menü öffnen"
	class={[
		"burger z-10 hidden size-9 flex-col items-center justify-center gap-1 rounded-halfbase border duration-300 hover:opacity-80 max-large:flex [.active_&]:hidden",
		menu.open && "active",
		scrolled ? "border-dark_text bg-white/50" : "border-border_base",
	]}
>
	<span class={["burger-line top-line", scrolled && "!bg-dark_text"]}></span>
	<span class={["burger-line mid-line", scrolled && "!bg-dark_text"]}></span>
	<span class={["burger-line bot-line", scrolled && "!bg-dark_text"]}></span>
</button>
