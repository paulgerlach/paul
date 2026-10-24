<!-- Step "Liegenschafts- und Rechnungsadresse". -->
<script lang="ts">
	import Markup from "../ui/Markup.svelte";
	import { fieldTip, QUESTION_TIPS } from "../data";
	import { CHECK } from "../svg";
	import Question from "../ui/Question.svelte";
	import Text from "../ui/Text.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const a = $derived(w.s.adr);
</script>

<Question text="Liegenschaftsadresse" tip={QUESTION_TIPS.property} />
<div>
	<div class="ss-f21">
		<Text
			label="Straße und Hausnummer*"
			bind:value={a.l.str}
			placeholder="z. B. Hauptstraße 12a"
			autocomplete="address-line1"
		/>
		<Text
			label="Adresszusatz"
			bind:value={a.l.zus}
			placeholder="z. B. Hinterhaus"
		/>
	</div>
	<div class="ss-f12">
		<Text
			label="PLZ*"
			bind:value={a.l.plz}
			placeholder="12345"
			autocomplete="postal-code"
		/>
		<Text label="Ort*" bind:value={a.l.ort} autocomplete="address-level2" />
	</div>
	<Text
		area
		label="Hinweise zur Lieferung (optional)"
		bind:value={a.l.hin}
		placeholder="z. B. Lieferung an den Hausmeister, Zugang über den Hof"
		tip={fieldTip("adr", "hin")}
	/>
</div>
<Question text="Rechnungsadresse" top={26} tip={QUESTION_TIPS.billing} />
<div class="adr-s">
	<label class="cb">
		<input type="checkbox" bind:checked={a.same} /><i><Markup html={CHECK} /></i
		><span>Die Rechnungsadresse entspricht der Liegenschaftsadresse.</span>
	</label>
</div>
{#if !a.same}
	<div class="ss-cond">
		<div style:margin-top="14px">
			<div class="f2">
				<Text label="Firma oder Hausverwaltung" bind:value={a.r.firma} />
				<Text label="Ansprechpartner" bind:value={a.r.name} />
			</div>
			<div class="ss-f21">
				<Text label="Straße und Hausnummer*" bind:value={a.r.str} />
				<Text
					label="Adresszusatz"
					bind:value={a.r.zus}
					placeholder="z. B. Postfach"
				/>
			</div>
			<div class="ss-f12">
				<Text label="PLZ*" bind:value={a.r.plz} placeholder="12345" />
				<Text label="Ort*" bind:value={a.r.ort} />
			</div>
			<Text
				label="USt-IdNr. (optional)"
				bind:value={a.r.ust}
				placeholder="z. B. DE123456789"
				tip={fieldTip("adr", "ust")}
			/>
		</div>
	</div>
{/if}
