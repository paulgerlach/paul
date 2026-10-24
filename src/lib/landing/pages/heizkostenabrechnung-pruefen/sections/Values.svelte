<!--
  The values pane (#mc-man): heating costs, the result with "Nachzahlung" /
  "Guthaben", the period, the receipt date, the share by consumption, three
  yes/no questions and "Ergebnis anzeigen →". The fields are plain state
  without `name` or action: nothing is sent.
-->
<script lang="ts">
	import YesNo from "../components/YesNo.svelte";
	import { getBillCheck } from "../check.svelte";
	import { card } from "../content";

	const check = getBillCheck();
	const t = card.values;
	const id = $props.id();
</script>

{#if check.valuesNote}
	<p class="note" role="status">{check.valuesNote}</p>
{/if}
<div class="f2">
	<label>
		<span>{t.heating} <small>{t.heatingNote}</small></span>
		<div class="eur">
			<input
				type="text"
				inputmode="decimal"
				placeholder={t.heatingPlaceholder}
				bind:value={check.values.heating}
			/><i>€</i>
		</div>
	</label>
	<div class="field">
		<label for="{id}-result"><span>{t.result}</span></label>
		<div class="eur">
			<input
				id="{id}-result"
				type="text"
				inputmode="decimal"
				placeholder={t.resultPlaceholder}
				bind:value={check.values.result}
			/><i>€</i>
		</div>
		<div class="seg2" role="group" aria-label={t.result}>
			<button
				type="button"
				class={[check.values.sign === 1 && "on"]}
				aria-pressed={check.values.sign === 1}
				onclick={() => (check.values.sign = 1)}>{t.backPayment}</button
			>
			<button
				type="button"
				class={[check.values.sign === -1 && "on"]}
				aria-pressed={check.values.sign === -1}
				onclick={() => (check.values.sign = -1)}>{t.credit}</button
			>
		</div>
	</div>
</div>
<div class="f2">
	<label>
		<span>{t.from}</span>
		<input type="date" bind:value={check.values.from} />
	</label>
	<label>
		<span>{t.to}</span>
		<input type="date" bind:value={check.values.to} />
	</label>
</div>
<div class="f2">
	<label>
		<span>{t.received}</span>
		<input type="date" bind:value={check.values.received} />
	</label>
	<label>
		<span>{t.share} <small>{t.shareNote}</small></span>
		<select bind:value={check.values.share}>
			{#each t.shares as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</label>
</div>
<YesNo
	question={t.co2}
	value={check.values.co2}
	onpick={(v) => check.answer("co2", v)}
/>
<YesNo
	question={t.remote}
	value={check.values.remote}
	onpick={(v) => check.answer("remote", v)}
/>
<YesNo
	question={t.uvi}
	value={check.values.uvi}
	onpick={(v) => check.answer("uvi", v)}
/>
<button type="button" class="bk-next go" onclick={() => check.compute()}
	>{t.show} <span class="ar">→</span></button
>

<style>
	.note {
		font-size: 13px;
		line-height: 1.45;
		background: #fff4e5;
		color: #7a4a00;
		border-radius: 10px;
		padding: 10px 12px;
		margin-top: 12px;
	}
	.f2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 10px;
	}
	.f2:first-of-type {
		margin-top: 0;
	}
	.f2 label,
	.field {
		display: grid;
		gap: 6px;
	}
	.field label {
		display: contents;
	}
	.f2 span {
		font-size: 13px;
		font-weight: 600;
		line-height: 1.35;
	}
	.f2 small {
		font-weight: 400;
		color: var(--faint);
	}
	.eur {
		position: relative;
	}
	/* Beats the card's field rule (Checker). */
	.f2 .eur input[type="text"] {
		padding-right: 28px;
	}
	.eur i {
		position: absolute;
		right: 11px;
		top: 50%;
		transform: translateY(-50%);
		font-style: normal;
		color: var(--faint);
		font-size: 14px;
	}
	.seg2 {
		display: flex;
		gap: 4px;
		margin-top: 2px;
	}
	.seg2 button {
		flex: 1;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 8px;
		font: inherit;
		font-size: 12px;
		padding: 5px 4px;
		cursor: pointer;
		color: var(--muted);
	}
	.seg2 button.on {
		background: var(--bg);
		color: var(--ink);
		font-weight: 600;
		border-color: #c9d2ce;
	}
	.go {
		margin-top: 16px;
	}
	@media (max-width: 640px) {
		.f2 {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
