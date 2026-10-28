<!--
  The preview's "Abrechnung" view: the five functions and the panel of the
  chosen one. Everything only changes the preview's local state (plan 03,
  3A.4).
-->
<script lang="ts">
	import { onDestroy } from "svelte";
	import { burst } from "$lib/landing/confetti";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { de } from "../../chart";
	import Icon from "../../components/Icon.svelte";
	import {
		BILLING_FUNCTIONS,
		BILLING_STEPS,
		EXTINGUISHER_PLACES,
		OPERATING_COSTS,
		SMOKE_ROOMS,
		UVI_MONTHS,
	} from "../data";
	import { getDemo } from "../demo.svelte";

	const demo = getDemo();

	let objectId = $state(demo.scope ?? "bm");
	const object = $derived(
		demo.objects.find((o) => o.id === objectId) ?? demo.objects[0],
	);

	// Heizkostenabrechnung
	let steps = $state<("" | "run" | "ok")[]>(BILLING_STEPS.map(() => ""));
	let running = $state(false);
	let result = $state<{ units: number; name: string } | null>(null);
	let uviResult = $state<{ units: number; name: string } | null>(null);
	let unit = $state("WE 01");
	let room = $state("");
	let host = $state<HTMLElement>();
	let canvas = $state<HTMLCanvasElement>();
	let timers: ReturnType<typeof setTimeout>[] = [];
	let stopConfetti = () => {};

	const later = (ms: number, fn: () => void) => {
		const t = setTimeout(() => {
			timers = timers.filter((x) => x !== t);
			fn();
		}, ms);
		timers.push(t);
	};

	onDestroy(() => {
		for (const t of timers) clearTimeout(t);
		stopConfetti();
	});

	function runBilling(button: HTMLElement) {
		const target = object;
		running = true;
		result = null;
		steps = BILLING_STEPS.map(() => "");
		const finish = () => {
			running = false;
			demo.addDocument({
				category: "abr",
				title: "Heizkostenabrechnung 2025",
				object: target.id,
				detail: `PDF · ${target.units} Einzelabrechnungen`,
			});
			result = { units: target.units, name: target.name };
			if (host && canvas) {
				const r = host.getBoundingClientRect();
				const b = button.getBoundingClientRect();
				stopConfetti();
				stopConfetti = burst(
					canvas,
					{ width: r.width, height: r.height },
					{
						x: b.left - r.left + b.width / 2,
						y: b.top - r.top + 6,
						width: b.width,
					},
					{ count: 80 },
				);
			}
		};
		if (prefersReducedMotion()) {
			steps = BILLING_STEPS.map(() => "ok");
			finish();
			return;
		}
		BILLING_STEPS.forEach((_, i) => {
			later(i * 650, () => (steps[i] = "run"));
			later(i * 650 + 600, () => (steps[i] = "ok"));
		});
		later(BILLING_STEPS.length * 650 + 300, finish);
	}

	function addUvi() {
		demo.addDocument({
			category: "uvi",
			title: "Verbrauchsinformation September",
			object: object.id,
			detail: `${object.units} Mietparteien`,
		});
		uviResult = { units: object.units, name: object.name };
	}

	function addDevice(kind: "rm" | "fl") {
		const what = kind === "rm" ? "Rauchmelder" : "Feuerlöscher";
		const where =
			kind === "rm"
				? `${unit} · ${room || SMOKE_ROOMS[0]}`
				: room || EXTINGUISHER_PLACES[0];
		demo.added[kind].unshift([`${what} · ${where}`, object.name]);
		demo.notify(`${what} hinzugefügt`);
	}

	const costTotal = OPERATING_COSTS.reduce((s, [, v]) => s + v, 0);
	const costMax = Math.max(...OPERATING_COSTS.map(([, v]) => v));
</script>

<div class="vh">
	<h3>Abrechnung</h3>
	<span class="mut">Funktionen auf Knopfdruck</span>
</div>
<div class="abr" bind:this={host}>
	<div class="fxl" role="group" aria-label="Funktionen">
		{#each BILLING_FUNCTIONS as f (f.key)}
			<button
				type="button"
				class={["fxi", demo.billingFunction === f.key && "on"]}
				aria-pressed={demo.billingFunction === f.key}
				onclick={() => {
					demo.billingFunction = f.key;
					room = "";
				}}
				><Icon name={f.icon} /><span>{f.label}</span><Icon
					name="arrow"
				/></button
			>
		{/each}
	</div>
	<div class="fxp">
		{#snippet objectSelect()}
			<label class="fl"
				><span>Objekt</span>
				<select bind:value={objectId}>
					{#each demo.objects as o (o.id)}
						<option value={o.id}>{o.name} ({o.units} WE)</option>
					{/each}
				</select>
			</label>
		{/snippet}

		{#if demo.billingFunction === "hk"}
			<h4>Heizkostenabrechnung erstellen</h4>
			<p class="mut">
				Die Verbräuche liegen per Funk vor. Heidi prüft sie auf Plausibilität,
				verteilt die Kosten nach HKVO und erstellt alle Einzelabrechnungen.
			</p>
			{@render objectSelect()}
			<label class="fl"
				><span>Abrechnungszeitraum</span>
				<select><option>01.01.2025 – 31.12.2025</option></select>
			</label>
			<button
				type="button"
				class="btn2 big"
				disabled={running}
				onclick={(event) => runBilling(event.currentTarget)}
				><Icon name="bolt" />Abrechnung erstellen</button
			>
			<ol class="steps">
				{#each BILLING_STEPS as step, i (step)}
					<li class={steps[i]}>{step}</li>
				{/each}
			</ol>
			<div role="status">
				{#if result}
					<div class="done">
						<Icon name="check" />
						<span
							><b>{result.units} Einzelabrechnungen erstellt</b><small
								>{result.name} · rechtssicher nach HKVO</small
							></span
						>
						<button
							type="button"
							class="lnk"
							onclick={() => {
								demo.docCategory = "all";
								demo.go("doc");
							}}>In Dokumenten ansehen</button
						>
					</div>
				{/if}
			</div>
		{:else if demo.billingFunction === "uvi"}
			<h4>Verbrauchsinformation hinzufügen</h4>
			<p class="mut">
				Die monatliche uVI nach HKVO für alle Mietparteien eines Objekts.
			</p>
			{@render objectSelect()}
			<label class="fl"
				><span>Monat</span>
				<select>
					{#each UVI_MONTHS as m (m)}<option>{m}</option>{/each}
				</select>
			</label>
			<button type="button" class="btn2 big" onclick={addUvi}
				><Icon name="plus" />uVI hinzufügen</button
			>
			<div role="status">
				{#if uviResult}
					<div class="done">
						<Icon name="check" />
						<span
							><b>uVI für {uviResult.units} Mietparteien hinzugefügt</b><small
								>{uviResult.name}</small
							></span
						>
					</div>
				{/if}
			</div>
		{:else if demo.billingFunction === "bk"}
			<h4>Betriebskosten</h4>
			<p class="mut">Kostenarten des Objekts im Überblick (Beispielwerte).</p>
			{@render objectSelect()}
			<div class="bk">
				{#each OPERATING_COSTS as [label, value] (label)}
					<div>
						<span>{label}</span><i style:width="{(value / costMax) * 100}%"
						></i><b>{de(value)}&nbsp;€</b>
					</div>
				{/each}
				<div class="tot"><span>Summe</span><b>{de(costTotal)}&nbsp;€</b></div>
			</div>
		{:else}
			{@const kind = demo.billingFunction as "rm" | "fl"}
			{@const smoke = kind === "rm"}
			<h4>{smoke ? "Rauchmelder" : "Feuerlöscher"} hinzufügen</h4>
			<p class="mut">
				{smoke
					? "Erfassen Sie Rauchmelder je Wohnung und Raum."
					: "Erfassen Sie Feuerlöscher mit Standort."}
			</p>
			{@render objectSelect()}
			{#if smoke}
				<label class="fl"
					><span>Wohnung</span>
					<select bind:value={unit}>
						{#each [1, 2, 3, 4, 5, 6, 7, 8] as n (n)}
							<option>WE {String(n).padStart(2, "0")}</option>
						{/each}
					</select>
				</label>
			{/if}
			<label class="fl"
				><span>{smoke ? "Raum" : "Standort"}</span>
				<select bind:value={room}>
					{#each smoke ? SMOKE_ROOMS : EXTINGUISHER_PLACES as r (r)}<option
							>{r}</option
						>{/each}
				</select>
			</label>
			<button type="button" class="btn2 big" onclick={() => addDevice(kind)}
				><Icon name="plus" />Hinzufügen</button
			>
			<div class="added">
				{#each demo.added[kind] as [title, place], i (i)}
					<div>
						<Icon name={smoke ? "smoke" : "extinguisher"} />
						<span><b>{title}</b><small>{place}</small></span>
						<span class="badge f">erfasst</span>
					</div>
				{:else}
					<p class="mut sm">Noch nichts erfasst.</p>
				{/each}
			</div>
		{/if}
	</div>
	<canvas class="cf" bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
	.abr {
		position: relative;
		display: grid;
		grid-template-columns: 260px minmax(0, 1fr);
		gap: 14px;
		align-items: start;
	}
	.cf {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 60;
	}
	.fxl {
		display: grid;
		gap: 6px;
	}
	.fxi {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 10px;
		padding: 11px 12px;
		font-size: 13.5px;
		cursor: pointer;
		text-align: left;
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.fxi > :global(svg:first-child) {
		width: 17px;
		height: 17px;
		color: var(--muted);
	}
	.fxi > :global(svg:last-child) {
		width: 13px;
		margin-left: auto;
		color: var(--faint);
	}
	.fxi:hover {
		border-color: #c9d3ce;
	}
	.fxi.on {
		border-color: var(--ink);
		background: #f4f7f5;
		font-weight: 600;
	}
	.fxp {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 20px 22px;
		min-height: 340px;
	}
	.fxp h4 {
		font-size: 18px;
		font-weight: 500;
		margin: 0 0 6px;
	}
	.fl {
		display: grid;
		gap: 4px;
		margin-top: 12px;
		font-size: 12px;
		color: var(--muted);
		max-width: 340px;
	}
	.fl select {
		border: 1px solid var(--hair);
		border-radius: 8px;
		padding: 8px 10px;
		font-size: 13px;
		color: var(--ink);
		background: #fff;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
		display: grid;
		gap: 8px;
		font-size: 13px;
		color: var(--faint);
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.steps li::before {
		content: "";
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid #dde3e0;
		flex: none;
		box-sizing: border-box;
	}
	.steps li.run,
	.steps li.ok {
		color: var(--ink);
	}
	.steps li.run::before {
		border-color: var(--accent-deep);
		border-right-color: transparent;
		animation: spin 0.7s linear infinite;
	}
	.steps li.ok::before {
		background: var(--accent)
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10'%3E%3Cpath d='M1 5l3.5 3.5L11 1' stroke='%231E322D' stroke-width='2' fill='none'/%3E%3C/svg%3E")
			center/9px no-repeat;
		border-color: var(--accent);
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.done {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 14px;
		background: #f2faf3;
		border: 1px solid #cdebd0;
		border-radius: 10px;
		padding: 10px 12px;
	}
	.done > :global(svg) {
		width: 18px;
		height: 18px;
		color: #2f7a3c;
		flex: none;
	}
	.done b {
		display: block;
		font-size: 13.5px;
	}
	.done small {
		font-size: 12px;
		color: var(--muted);
	}
	.done :global(.lnk) {
		margin-left: auto;
	}
	.bk {
		display: grid;
		gap: 8px;
		margin-top: 14px;
		max-width: 520px;
	}
	.bk div {
		display: grid;
		grid-template-columns: 150px 1fr 80px;
		align-items: center;
		gap: 10px;
		font-size: 13px;
	}
	.bk i {
		height: 8px;
		border-radius: 4px;
		background: #afbde3;
		display: block;
	}
	.bk b {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.bk .tot {
		border-top: 1px solid var(--hair);
		padding-top: 8px;
		grid-template-columns: 1fr 80px;
	}
	.bk .tot b {
		font-size: 15px;
	}
	.added {
		display: grid;
		gap: 6px;
		margin-top: 14px;
		max-width: 420px;
	}
	.added div {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 8px 10px;
		font-size: 13px;
	}
	.added :global(svg) {
		width: 16px;
		height: 16px;
		color: var(--muted);
		flex: none;
	}
	.added b {
		display: block;
		font-weight: 600;
		font-size: 13px;
	}
	.added small {
		font-size: 11.5px;
		color: var(--muted);
	}
	.added :global(.badge) {
		margin-left: auto;
	}
	@media (max-width: 900px) {
		.abr {
			grid-template-columns: minmax(0, 1fr);
		}
		.fxl {
			grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		}
	}
	@media (max-width: 640px) {
		.bk div {
			grid-template-columns: 110px 1fr 70px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.steps li.run::before {
			animation: none;
		}
	}
</style>
