<!--
  The guided flow after the first file (.mc-wz): the receipt date, the two
  yes/no questions (they move on by themselves after 280 ms), the summary
  with "Ändern" and "Abrechnung prüfen →". From step 2 on, a step's first
  control takes the focus (the summary's button on the last).
-->
<script lang="ts">
	import YesNo from "../components/YesNo.svelte";
	import { getBillCheck } from "../check.svelte";
	import { ANSWERS, card } from "../content";
	import { flowDate } from "../rules";

	const check = getBillCheck();
	const t = card.flow;

	let stepEl: HTMLElement | undefined = $state();
	let goEl: HTMLButtonElement | undefined = $state();

	const label = (value: string) =>
		ANSWERS.find((a) => a.value === value)?.label ?? "";

	const summary = $derived([
		{
			label: t.summary.bill,
			value: check.files.map((f) => f.name).join(", "),
			step: -1,
		},
		{
			label: t.summary.received,
			value: flowDate(check.flowReceived) ?? t.summary.notGiven,
			step: 0,
		},
		{ label: t.summary.remote, value: label(check.values.remote), step: 1 },
		{ label: t.summary.uvi, value: label(check.values.uvi), step: 2 },
	]);

	// The design's focus on each step (a side effect of the step).
	$effect(() => {
		const step = check.step;
		if (step === 0) return;
		const timer = setTimeout(() => {
			if (step === 3) goEl?.focus();
			else
				stepEl
					?.querySelector<HTMLElement>("input, button")
					?.focus({ preventScroll: true });
		}, 50);
		return () => clearTimeout(timer);
	});
</script>

<div class="wz">
	<div class="wh">
		<span>{t.step(check.step + 2)}</span>
		<div class="wp"><i style:width="{((check.step + 2) / 5) * 100}%"></i></div>
	</div>
	{#key check.step}
		<div class="ws" bind:this={stepEl}>
			{#if check.step === 0}
				<label class="wl">
					<span>{t.received}</span>
					<input
						type="date"
						value={check.flowReceived}
						oninput={(e) => check.setFlowReceived(e.currentTarget.value)}
						onchange={(e) => check.setFlowReceived(e.currentTarget.value)}
					/>
				</label>
				<p class="wx">{t.receivedHint}</p>
				<div class="wb">
					<button
						type="button"
						class="skip"
						onclick={() => check.skipReceived()}>{t.unknown}</button
					>
					<button
						type="button"
						class="wgo"
						disabled={!check.flowReceived}
						onclick={() => check.goStep(1)}>{t.next}</button
					>
				</div>
			{:else if check.step === 1}
				<YesNo
					flow
					question={t.remote}
					value={check.values.remote}
					onpick={(v) => check.answer("remote", v, true)}
				/>
			{:else if check.step === 2}
				<YesNo
					flow
					question={t.uvi}
					value={check.values.uvi}
					onpick={(v) => check.answer("uvi", v, true)}
				/>
			{:else}
				<span class="wt">{t.ready}</span>
				<ul class="sum">
					{#each summary as row (row.label)}
						<li>
							<span>{row.label}</span><b>{row.value}</b>
							{#if row.step >= 0}
								<button type="button" onclick={() => check.goStep(row.step)}
									>{t.summary.change}</button
								>
							{/if}
						</li>
					{/each}
				</ul>
				<button
					type="button"
					class="bk-next go"
					bind:this={goEl}
					disabled={!check.files.length}
					onclick={() => check.checkFiles()}
					>{t.check} <span class="ar">→</span></button
				>
			{/if}
		</div>
	{/key}
	{#if check.step > 0}
		<button
			type="button"
			class="back"
			onclick={() => check.goStep(check.step - 1)}>{t.back}</button
		>
	{/if}
</div>

<style>
	.wz {
		margin-top: 16px;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 16px 16px 14px;
		background: #fff;
	}
	.wh {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 12.5px;
		color: var(--muted);
		margin-bottom: 14px;
	}
	.wp {
		flex: 1;
		height: 4px;
		border-radius: 2px;
		background: #eef1ef;
		overflow: hidden;
	}
	.wp i {
		display: block;
		height: 100%;
		background: var(--ok);
		border-radius: 2px;
		transition: width 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ws {
		animation: mcin 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes mcin {
		from {
			opacity: 0;
			transform: translateX(14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.wl {
		display: grid;
		gap: 8px;
	}
	.wl > span {
		font-size: 15px;
		font-weight: 600;
		line-height: 1.35;
	}
	.wx {
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 8px;
	}
	.wb {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 12px;
	}
	.wgo {
		border: 0;
		background: var(--ink);
		color: #fff;
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		border-radius: 9px;
		padding: 9px 16px;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	.wgo:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}
	.skip {
		border: 0;
		background: none;
		font: inherit;
		font-size: 13px;
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
		padding: 4px 0;
	}
	.back {
		border: 0;
		background: none;
		font: inherit;
		font-size: 13px;
		color: var(--muted);
		cursor: pointer;
		padding: 10px 0 0;
	}
	.back:hover,
	.skip:hover {
		color: var(--ink);
	}
	.wt {
		font-size: 15px;
		font-weight: 600;
	}
	.sum {
		list-style: none;
		padding: 0;
		margin: 10px 0 0;
		display: grid;
		gap: 6px;
	}
	.sum li {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 13.5px;
		padding: 8px 10px;
		background: var(--bg);
		border-radius: 8px;
	}
	.sum li span {
		color: var(--muted);
	}
	.sum li b {
		margin-left: auto;
		font-weight: 600;
		text-align: right;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 60%;
	}
	.sum li button {
		border: 0;
		background: none;
		font: inherit;
		font-size: 12px;
		color: var(--ok);
		cursor: pointer;
		padding: 0 0 0 8px;
	}
	/* .mc-go */
	.go {
		margin-top: 16px;
	}
	.go:disabled {
		opacity: 0.45;
	}
</style>
