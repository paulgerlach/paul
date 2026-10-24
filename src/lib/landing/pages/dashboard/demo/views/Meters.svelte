<!--
  The preview's "Zähler" view: type chips, search and the first ten matching
  meters; a meter's number opens its drawer (plan 03, 3A.4).
-->
<script lang="ts">
	import Icon from "../../components/Icon.svelte";
	import { METER_TYPE_KEYS, METER_TYPES } from "../data";
	import { getDemo } from "../demo.svelte";
	import { metersFor } from "../model";

	const demo = getDemo();
	const list = $derived(
		metersFor(
			demo.meters,
			demo.objects,
			demo.meterType,
			demo.scope,
			demo.meterQuery,
		),
	);
	const chips = [
		{ key: "all" as const, label: "Alle" },
		...METER_TYPE_KEYS.map((key) => ({ key, label: METER_TYPES[key].label })),
	];
</script>

<div class="vh">
	<h3>Zähler</h3>
	<span class="mut"
		>{list.length} Zähler im Auszug{demo.scoped
			? ` · ${demo.scoped.name}`
			: ""}</span
	>
	<div class="vt">
		<label class="sr">
			<Icon name="search" />
			<input
				type="search"
				placeholder="Nummer, Objekt oder WE"
				aria-label="Zähler suchen: Nummer, Objekt oder WE"
				bind:value={demo.meterQuery}
			/>
		</label>
	</div>
</div>
<div class="chips" role="group" aria-label="Zählertyp">
	{#each chips as chip (chip.key)}
		<button
			type="button"
			class={["chip2", demo.meterType === chip.key && "on"]}
			aria-pressed={demo.meterType === chip.key}
			onclick={() => (demo.meterType = chip.key)}>{chip.label}</button
		>
	{/each}
</div>
<div class="tw">
	<table class="tb">
		<thead>
			<tr>
				<th scope="col">Zähler-Nr.</th>
				<th scope="col">Typ</th>
				<th scope="col">Objekt</th>
				<th scope="col">Einheit</th>
				<th scope="col">Stand</th>
				<th scope="col">Übertragung</th>
				<th scope="col">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each list.slice(0, 10) as m (m.id)}
				<tr>
					<th scope="row">
						<button
							type="button"
							class="link"
							onclick={(event) => demo.openMeter(m.id, event.currentTarget)}
							><b>{m.id}</b></button
						>
					</th>
					<td
						><span class="ti2"><Icon name={METER_TYPES[m.type].icon} /></span
						>{METER_TYPES[m.type].short}</td
					>
					<td>{demo.objectName(m.object)}</td>
					<td>{m.label}</td>
					<td>{m.reading}</td>
					<td
						>{#if m.radio}<span class="badge f">Heidi-Funk</span>{:else}<span
								class="badge b">Bestand</span
							>{/if}</td
					>
					<td><span class="ok2"><Icon name="check" />In Ordnung</span></td>
				</tr>
			{:else}
				<tr><td colspan="7" class="mut">Keine Zähler für diese Auswahl.</td></tr
				>
			{/each}
		</tbody>
	</table>
</div>
{#if list.length > 10}
	<p class="mut sm">
		{list.length - 10} weitere Zähler. Filtern Sie nach Typ oder suchen Sie nach einer
		Nummer.
	</p>
{/if}

<style>
	.link {
		border: 0;
		background: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
	}
	.link:hover b {
		text-decoration: underline;
	}
</style>
