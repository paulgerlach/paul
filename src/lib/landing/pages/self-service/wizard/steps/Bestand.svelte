<!-- Step "Sind bereits Funkzähler vorhanden?" -->
<script lang="ts">
	import { PREF_OPTIONS, STOCK_OPTIONS } from "../data";
	import { ICONS } from "../svg";
	import Nudge from "../ui/Nudge.svelte";
	import Options, { cards } from "../ui/Options.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
</script>

<Options
	options={cards(STOCK_OPTIONS, {
		funk: { icon: ICONS.radio },
		ohne: { icon: ICONS.meter },
		teils: { icon: ICONS.half },
		nein: { icon: ICONS.plus },
		unbekannt: { icon: ICONS.q },
	})}
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
			options={cards(PREF_OPTIONS, {
				neu: { icon: ICONS.swap },
				behalten: { icon: ICONS.keep },
				empfehlung: { icon: ICONS.spark },
			})}
			value={w.s.pref}
			onpick={(v) => (w.s.pref = v)}
		/>
	</div>
{/if}
