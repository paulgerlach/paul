<!--
  The preview's "Objekte" view: search, "Objekt anlegen" (local only) and the
  objects table; an object's name scopes the dashboard (plan 03, 3A.4).
-->
<script lang="ts">
	import { de } from "../../chart";
	import Icon from "../../components/Icon.svelte";
	import { getDemo } from "../demo.svelte";
	import { deltaText, objectsMatching } from "../model";

	const demo = getDemo();
	const list = $derived(objectsMatching(demo.objects, demo.objectQuery));

	let adding = $state(false);
	let name = $state("");
	let units = $state<number | undefined>();
	let nameInput = $state<HTMLInputElement>();

	function open() {
		adding = true;
		queueMicrotask(() => nameInput?.focus());
	}

	function save(event: SubmitEvent) {
		event.preventDefault();
		const n = name.trim();
		if (!n || !units || units < 1) return;
		demo.addObject(n, Math.min(500, Math.round(units)));
		name = "";
		units = undefined;
		adding = false;
	}
</script>

<div class="vh">
	<h3>Objekte</h3>
	<span class="mut"
		>{demo.objects.length} Objekte · {de(demo.totalUnits)} Wohnungen</span
	>
	<div class="vt">
		<label class="sr">
			<Icon name="search" />
			<input
				type="search"
				placeholder="Objekt suchen"
				aria-label="Objekt suchen"
				bind:value={demo.objectQuery}
			/>
		</label>
		<button type="button" class="btn2" onclick={open}
			><Icon name="plus" />Objekt anlegen</button
		>
	</div>
</div>

{#if adding}
	<form class="o-form" onsubmit={save}>
		<input
			bind:this={nameInput}
			bind:value={name}
			placeholder="Adresse, z. B. Rosenweg 21"
			aria-label="Adresse"
			required
		/>
		<input
			class="we"
			type="number"
			min="1"
			max="500"
			placeholder="Wohnungen"
			aria-label="Wohnungen"
			bind:value={units}
			required
		/>
		<button type="submit" class="btn2">Speichern</button>
		<button type="button" class="lnk" onclick={() => (adding = false)}
			>Abbrechen</button
		>
	</form>
{/if}

<div class="tw">
	<table class="tb">
		<thead>
			<tr>
				<th scope="col">Objekt</th>
				<th scope="col">Wohnungen</th>
				<th scope="col">Zähler</th>
				<th scope="col">Funk-Anteil</th>
				<th scope="col">Status</th>
				<th scope="col">Verbrauch zum Vorjahr</th>
			</tr>
		</thead>
		<tbody>
			{#each list as o (o.id)}
				<tr>
					<th scope="row">
						<button
							type="button"
							class="link"
							onclick={() => demo.setScope(o.id)}><b>{o.name}</b></button
						>
						{#if o.isNew}<span class="badge f">neu</span>{/if}
					</th>
					<td>{o.units}</td>
					<td>{o.isNew ? "–" : o.units * 4 + 1}</td>
					<td
						><span class="fb"><i style:width="{o.radio}%"></i></span
						>{o.radio}&nbsp;%</td
					>
					<td>
						{#if o.isNew}<span class="mut">Montage geplant</span>{:else}<span
								class="ok2"><Icon name="check" />In Ordnung</span
							>{/if}
					</td>
					<td class={o.delta < 0 ? "dn" : "up"}>{deltaText(o.delta)}</td>
				</tr>
			{:else}
				<tr><td colspan="6" class="mut">Kein Objekt gefunden.</td></tr>
			{/each}
		</tbody>
	</table>
</div>
<p class="mut sm">
	Klicken Sie auf ein Objekt, um das Dashboard darauf zu filtern.
</p>

<style>
	.o-form {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		background: #fff;
		border: 1px dashed #cfe0d4;
		border-radius: 12px;
		padding: 12px;
		margin-bottom: 12px;
	}
	.o-form input {
		border: 1px solid var(--hair);
		border-radius: 8px;
		padding: 8px 10px;
		font-size: 13px;
		flex: 1;
		min-width: 120px;
	}
	.o-form input.we {
		flex: 0 0 120px;
	}
	.link {
		border: 0;
		background: none;
		padding: 0;
		cursor: pointer;
		color: inherit;
		text-align: left;
	}
	.link:hover b {
		text-decoration: underline;
	}
	.fb {
		display: inline-block;
		width: 56px;
		height: 6px;
		border-radius: 3px;
		background: #eef1ef;
		margin-right: 8px;
		vertical-align: middle;
		overflow: hidden;
	}
	.fb i {
		display: block;
		height: 100%;
		background: var(--accent-deep);
	}
</style>
