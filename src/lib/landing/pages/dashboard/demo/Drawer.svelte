<!--
  The preview's side panel (`.hd-drawer`): a status type's meters or one
  meter's facts. A non-modal dialog; focus moves to its heading on open and
  back to the opener on close (plan 03, 3A.5).
-->
<script lang="ts">
	import { de } from "../chart";
	import Icon from "../components/Icon.svelte";
	import { METER_TYPES, MONTHS } from "./data";
	import { getDemo } from "./demo.svelte";
	import { meterHistory, metersFor } from "./model";

	const demo = getDemo();
	const d = $derived(demo.drawer);
	const meter = $derived(
		d?.kind === "meter" ? demo.meters.find((m) => m.id === d.id) : undefined,
	);

	function focusOnOpen(el: HTMLElement) {
		el.focus();
	}
</script>

{#if d}
	<div
		class="drawer"
		role="dialog"
		aria-modal="false"
		aria-labelledby="hd-drawer-h"
	>
		<button
			type="button"
			class="x"
			aria-label="Schließen"
			onclick={() => demo.closeLayer()}><Icon name="close" /></button
		>
		{#if d.kind === "alert"}
			{@const type = METER_TYPES[d.type]}
			{@const list = metersFor(
				demo.meters,
				demo.objects,
				d.type,
				demo.scope,
				"",
			)}
			<p class="dk">{type.label}</p>
			{#key d.type}
				<h4 id="hd-drawer-h" tabindex="-1" {@attach focusOnOpen}>
					Alle {de(demo.counts[d.type])} in Ordnung
				</h4>
			{/key}
			<p class="mut">
				Alle Geräte haben heute per Funk übertragen · {demo.scoped
					? demo.scoped.name
					: "alle Objekte"}. Auszug:
			</p>
			<div class="dl">
				{#each list.slice(0, 6) as m (m.id)}
					<button
						type="button"
						class="dli"
						onclick={() => demo.openMeter(m.id)}
					>
						<span class="i2"><Icon name="check" /></span>
						<span
							><b>{m.id}</b><small
								>{demo.objectName(m.object)} · {m.label} · {m.reading}</small
							></span
						>
						<Icon name="arrow" />
					</button>
				{/each}
			</div>
			<button
				type="button"
				class="btn2"
				onclick={() => {
					const t = d.type;
					demo.closeLayer();
					demo.meterType = t;
					demo.meterQuery = "";
					demo.go("mtr");
				}}>Alle im Bereich Zähler ansehen</button
			>
		{:else if meter}
			{@const history = meterHistory(meter)}
			{@const max = Math.max(...history)}
			<p class="dk">{METER_TYPES[meter.type].label}</p>
			{#key meter.id}
				<h4 id="hd-drawer-h" tabindex="-1" {@attach focusOnOpen}>{meter.id}</h4>
			{/key}
			<dl class="kv">
				<dt>Objekt</dt>
				<dd>{demo.objectName(meter.object)}</dd>
				<dt>Einheit</dt>
				<dd>{meter.label}</dd>
				<dt>Stand</dt>
				<dd>{meter.reading}</dd>
				<dt>Übertragung</dt>
				<dd>
					{#if meter.radio}<span class="badge f">Heidi-Funk</span>{:else}<span
							class="badge b">Bestand</span
						>{/if}
				</dd>
				<dt>Letzter Wert</dt>
				<dd>{meter.last}</dd>
				<dt>Status</dt>
				<dd><span class="badge f">In Ordnung</span></dd>
			</dl>
			<p class="dk sp">Verbrauch Jan–Sep</p>
			<div class="mbars" aria-hidden="true">
				{#each history as v, i (i)}<i
						style:height="{(v / max) * 100}%"
						title="{MONTHS[i]}: {de(v)}"
					></i>{/each}
			</div>
			<div class="mlab" aria-hidden="true">
				{#each MONTHS.slice(0, 9) as m (m)}<span>{m}</span>{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.drawer {
		position: absolute;
		top: 58px;
		right: 0;
		bottom: 0;
		width: min(360px, 100%);
		background: #fff;
		border-left: 1px solid var(--hair);
		box-shadow: -24px 0 50px -30px rgba(30, 50, 45, 0.45);
		padding: 22px 22px 24px;
		z-index: 25;
		overflow: auto;
		border-bottom-right-radius: 16px;
		animation: slide 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes slide {
		from {
			transform: translateX(105%);
		}
	}
	.x {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 30px;
		height: 30px;
		border: 0;
		border-radius: 8px;
		background: #f2f4f2;
		display: grid;
		place-items: center;
		cursor: pointer;
	}
	.x :global(svg) {
		width: 14px;
		height: 14px;
	}
	.dk {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--faint);
		margin: 0;
	}
	.dk.sp {
		margin-top: 16px;
	}
	.drawer h4 {
		font-size: 19px;
		font-weight: 500;
		margin: 4px 40px 8px 0;
		line-height: 1.25;
		outline: none;
	}
	.dl {
		display: grid;
		gap: 6px;
		margin: 12px 0;
	}
	.dli {
		display: flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--hair);
		background: #fafbfa;
		border-radius: 10px;
		padding: 8px 10px;
		text-align: left;
		cursor: pointer;
		transition: border-color 0.2s;
	}
	.dli:hover {
		border-color: var(--accent-deep);
	}
	.i2 {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		background: #ddf0de;
		color: #3e9a57;
		display: grid;
		place-items: center;
		flex: none;
	}
	.i2 :global(svg) {
		width: 14px;
		height: 14px;
	}
	.dli b {
		display: block;
		font-size: 13px;
	}
	.dli small {
		font-size: 11.5px;
		color: var(--muted);
	}
	.dli > :global(svg) {
		width: 14px;
		margin-left: auto;
		color: var(--faint);
	}
	.kv {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 9px 10px;
		font-size: 13px;
		margin: 14px 0 0;
	}
	.kv dt {
		color: var(--muted);
	}
	.kv dd {
		margin: 0;
		font-weight: 500;
	}
	.mbars {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 90px;
		margin-top: 10px;
	}
	.mbars i {
		flex: 1;
		background: #afbde3;
		border-radius: 4px 4px 0 0;
		min-height: 4px;
	}
	.mlab {
		display: flex;
		gap: 6px;
		margin-top: 4px;
	}
	.mlab span {
		flex: 1;
		text-align: center;
		font-size: 10px;
		color: var(--faint);
	}
	@media (max-width: 640px) {
		.drawer {
			top: 0;
			border-radius: 16px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.drawer {
			animation: none;
		}
	}
</style>
