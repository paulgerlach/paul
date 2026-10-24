<!--
  The "?" of a question and its tooltip (the design's `.ss-qm` and
  `.ss-tipb`): it opens on click only, one at a time; a click elsewhere or
  Escape closes it (the wizard's `openTip`, closed by `Check`).
-->
<script lang="ts">
	import { getSelfService } from "../wizard.svelte";

	let { id, open }: { id: string; open: boolean } = $props();
	const w = getSelfService();
</script>

<button
	type="button"
	class="ss-qm"
	aria-label="Mehr Informationen"
	aria-expanded={open}
	aria-controls="{id}-tip"
	onclick={(e) => {
		e.preventDefault();
		w.openTip = open ? null : id;
	}}>?</button
>
