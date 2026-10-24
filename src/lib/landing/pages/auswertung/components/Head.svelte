<!--
  The centred head of the steps and the heatmap (`.db-c`): the pill with its
  icon, the H2 and the lead.
-->
<script lang="ts">
	import type { IconName } from "$lib/landing/pages/dashboard/icons";
	import Pill from "$lib/landing/pages/dashboard/components/Pill.svelte";

	let {
		id,
		pill,
		h2,
		lead,
	}: {
		id: string;
		pill: { text: string; icon: IconName };
		h2: string;
		lead: string;
	} = $props();
</script>

<div class="wrap db-c">
	<Pill text={pill.text} icon={pill.icon} class="rv" />
	<h2 class="db-h2 rv" {id}>{h2}</h2>
	<p class="db-lead rv">{lead}</p>
</div>
