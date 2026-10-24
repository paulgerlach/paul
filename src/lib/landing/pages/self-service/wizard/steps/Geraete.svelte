<!-- Step "Welche Geräte benötigen Sie?" (several). -->
<script lang="ts">
	import { DEVICE_PHOTOS } from "../../photos";
	import { DEVICES, ORDER } from "../data";
	import { ICONS } from "../svg";
	import Note from "../ui/Note.svelte";
	import Nudge from "../ui/Nudge.svelte";
	import Options from "../ui/Options.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const options = [
		...ORDER.map((k) => ({
			v: k,
			label: DEVICES[k].name,
			img: DEVICE_PHOTOS[k],
			small: k === "weitere" ? "z. B. Stromzähler oder Gaszähler" : undefined,
		})),
		{
			v: "unsicher",
			label: "Ich bin mir nicht ganz sicher",
			icon: ICONS.q,
			small: "Heidi hilft Ihnen bei der Auswahl",
		},
	];
</script>

<Options
	{options}
	value={w.s.devs}
	onpick={(v) =>
		w.setDevices(
			w.s.devs.includes(v) ? w.s.devs.filter((x) => x !== v) : [...w.s.devs, v],
		)}
/>
<Note
	>Für jeden ausgewählten Gerätetyp fragen wir danach nur die technisch
	relevanten Angaben ab. Baugleiche Zähler erfassen Sie einmal als Gruppe.</Note
>
{#if w.s.devs.includes("unsicher")}
	<div class="ss-cond"><Nudge /></div>
{/if}
