<!--
  Step "Sind bereits Funkzähler vorhanden?"; keeping existing meters asks
  when they were installed (a swap is recommended from five years, else the
  AES key is needed).
-->
<script lang="ts">
	import { PREF_OPTIONS, STOCK_OPTIONS } from "../data";
	import { askYear, yearOld, yearOptions } from "../model";
	import { ICONS } from "../svg";
	import Note from "../ui/Note.svelte";
	import Nudge from "../ui/Nudge.svelte";
	import Options, { cards } from "../ui/Options.svelte";
	import Select from "../ui/Select.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const years = yearOptions();
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
		{#if askYear(w.s)}
			<div class="ss-cond">
				<p class="ss-sub">Wann wurden die vorhandenen Zähler eingebaut?</p>
				<p class="ss-chk-l" style:margin="0 0 10px">
					Ungefähr reicht. Bei unterschiedlichen Jahren geben Sie bitte das Jahr
					der ältesten Zähler an.
				</p>
				<Select label="Einbaujahr" bind:value={w.s.ejahr} options={years} />
				{#if w.s.ejahr && w.s.ejahr !== "unb"}
					{#if yearOld(w.s)}
						<Note tone="y"
							><b>Empfehlung: Zähler austauschen.</b> Bei Zählern, die vor 5 Jahren
							oder früher eingebaut wurden, bleibt höchstens noch etwa 1 Jahr Eichfrist.
							Im Idealfall empfehlen wir deshalb einen Austausch, statt die Zähler
							nur noch kurz weiter auszulesen.</Note
						>
					{:else}
						<Note tone="b"
							><b>AES-Schlüssel erforderlich.</b> Um Ihre Zähler auslesen zu
							können, benötigen wir zwingend den AES-Schlüssel Ihres bisherigen
							Messdienstleisters.{w.s.ejahr === "2022"
								? " Bitte beachten Sie: Auslesen können wir funkfähige Zähler, die nach dem 1.12.2022 eingebaut wurden."
								: ""}</Note
						>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
{/if}
