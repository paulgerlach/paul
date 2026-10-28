<!-- A note under a question (`.ss-note`, `warn` in amber). -->
<script lang="ts">
	import type { Snippet } from "svelte";

	let { warn = false, children }: { warn?: boolean; children: Snippet } =
		$props();
</script>

<p class={["ss-note", warn && "warn"]}>{@render children()}</p>
