<!-- Step "Sind bereits Funkzähler vorhanden?" -->
<script lang="ts">
	import { ICONS } from "../svg";
	import Nudge from "../ui/Nudge.svelte";
	import Options from "../ui/Options.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
</script>

<Options
	options={[
		{ v: "funk", label: "Ja, es gibt Funkzähler", icon: ICONS.radio },
		{ v: "ohne", label: "Ja, aber ohne Funk", icon: ICONS.meter },
		{ v: "teils", label: "Teils mit Funk, teils ohne", icon: ICONS.half },
		{
			v: "nein",
			label: "Nein, es müssen Zähler eingebaut werden",
			icon: ICONS.plus,
		},
		{ v: "unbekannt", label: "Das weiß ich nicht", icon: ICONS.q },
	]}
	value={w.s.bestand}
	onpick={(v) => (w.s.bestand = v)}
/>
{#if w.s.bestand === "unbekannt"}
	<div class="ss-cond"><Nudge /></div>
{/if}
{#if w.s.bestand && w.s.bestand !== "nein"}
	<div class="ss-cond">
		<p class="ss-sub">Was möchten Sie vorzugsweise?</p>
		<Options
			class="pref"
			options={[
				{
					v: "neu",
					label: "Alle benötigten Zähler erneuern",
					icon: ICONS.swap,
				},
				{
					v: "behalten",
					label: "Bestehende Funkzähler möglichst weiterverwenden",
					icon: ICONS.keep,
				},
				{
					v: "empfehlung",
					label: "Heidi soll die beste Lösung empfehlen",
					icon: ICONS.spark,
				},
			]}
			value={w.s.pref}
			onpick={(v) => (w.s.pref = v)}
		/>
	</div>
{/if}
