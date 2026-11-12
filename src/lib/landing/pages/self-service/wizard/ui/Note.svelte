<!--
  A note under a question (`.ss-note`): `warn` in amber, `tone` "y" yellow
  (`.ss-ynote`, a recommendation) or "b" blue (`.ss-bnote`).
-->
<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		warn = false,
		tone,
		class: cls = "",
		top,
		children,
	}: {
		warn?: boolean;
		tone?: "y" | "b";
		class?: string;
		/** The design's inline top margin, px. */
		top?: number;
		children: Snippet;
	} = $props();
</script>

<p
	class={[
		"ss-note",
		warn && "warn",
		tone === "y" && "ss-ynote",
		tone === "b" && "ss-bnote",
		cls,
	]}
	style:margin-top={top ? `${top}px` : undefined}
>
	{@render children()}
</p>
