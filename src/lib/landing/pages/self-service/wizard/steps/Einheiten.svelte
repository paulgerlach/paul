<!-- Step "Wie viele Einheiten hat die Liegenschaft?" with − / +. -->
<script lang="ts">
	import { gateways, num } from "../model";
	import Note from "../ui/Note.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const u = $derived(num(w.s.units));
	const gw = $derived(gateways(w.s));

	function step(d: number) {
		const v = Math.max(0, num(w.s.units) + d);
		w.s.units = v ? String(v) : "";
		w.error = "";
	}
</script>

<div class="ss-units">
	<button
		type="button"
		class="ss-ub"
		aria-label="Weniger"
		onclick={() => step(-1)}>−</button
	>
	<Text
		label="Anzahl der Wohn- und Gewerbeeinheiten"
		bind:value={w.s.units}
		placeholder="z. B. 6"
		type="number"
		class="ss-uin"
	/>
	<button type="button" class="ss-ub" aria-label="Mehr" onclick={() => step(1)}
		>+</button
	>
</div>
{#if u}
	<div class="u-gw">
		<Note
			>Für <b>{u}{u === 1 ? " Einheit" : " Einheiten"}</b> planen wir vorläufig
			<b>{gw}{gw === 1 ? " Funk-Gateway" : " Funk-Gateways"}</b>.{#if u > 30}
				Bei größeren Gebäuden prüft Heidi die Planung technisch.{/if}</Note
		>
	</div>
{/if}
