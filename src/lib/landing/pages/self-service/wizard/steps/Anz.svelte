<!--
  Step "Wie viele Zähler sind es?" (with a device list or bill): the count
  per device type only, the configuration comes from the documents.
-->
<script lang="ts">
	import { COUNT_LABELS, ORDER } from "../data";
	import Note from "../ui/Note.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
</script>

<div class="ss-anz">
	{#each ORDER as d (d)}
		<Text
			label={COUNT_LABELS[d]}
			bind:value={w.s.anz[d]}
			placeholder="0"
			type="number"
		/>
	{/each}
</div>
<Note
	>Die genaue Konfiguration Ihrer Zähler entnehmen wir den hochgeladenen
	Unterlagen. Sie müssen keine technischen Angaben machen.</Note
>
