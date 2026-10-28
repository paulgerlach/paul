<!--
  The scan pane (#mc-run) the example passes through: a drawn bill under a
  moving beam and the three steps, ticked off by the page's `BillCheck`;
  "Abbrechen" goes back to the upload pane.
-->
<script lang="ts">
	import { getBillCheck } from "../check.svelte";
	import { card } from "../content";

	const check = getBillCheck();
	const t = card.run;
</script>

<div class="scan" aria-hidden="true">
	<div class="doc">
		<b>{t.doc}</b><i></i><i></i><i></i><i></i><i></i><i></i>
	</div>
	<span class="beam"></span>
</div>
<ol class="steps" aria-live="polite">
	{#each t.steps as label, i (label)}
		<li class={[i < check.runStep && "ok", i === check.runStep && "on"]}>
			{label}
		</li>
	{/each}
</ol>
<button type="button" class="demo" onclick={() => check.cancelExample()}
	>{t.cancel}</button
>

<style>
	.scan {
		position: relative;
		height: 150px;
		display: grid;
		place-items: center;
		overflow: hidden;
		border-radius: 14px;
		background: var(--bg);
	}
	.doc {
		width: 96px;
		height: 124px;
		background: #fff;
		border-radius: 6px;
		box-shadow: 0 8px 20px -10px rgba(30, 50, 45, 0.35);
		padding: 14px 12px;
		display: grid;
		gap: 7px;
		align-content: start;
	}
	/* .mc-dt */
	.doc b {
		display: block;
		font-size: 7.5px;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.15;
		margin-bottom: 3px;
		hyphens: manual;
	}
	.doc i {
		display: block;
		height: 5px;
		border-radius: 3px;
		background: #e3e8e5;
	}
	.doc i:nth-child(2) {
		width: 70%;
	}
	.doc i:nth-child(4) {
		width: 84%;
	}
	.doc i:nth-child(6) {
		width: 50%;
		background: var(--accent);
	}
	.beam {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 3px;
		background: var(--accent-deep, #5db864);
		box-shadow: 0 0 18px 6px rgba(138, 214, 143, 0.45);
		animation: beam 1.8s ease-in-out infinite alternate;
	}
	@keyframes beam {
		from {
			transform: translateY(12px);
		}
		to {
			transform: translateY(136px);
		}
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 16px 0 0;
		display: grid;
		gap: 8px;
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 14px;
		color: var(--faint);
		transition: color 0.3s;
	}
	.steps li::before {
		content: "";
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid #d5dcd9;
		flex: none;
		box-sizing: border-box;
	}
	.steps li.on {
		color: var(--ink);
		font-weight: 500;
	}
	.steps li.on::before {
		border-color: var(--accent-deep, #5db864);
		border-top-color: transparent;
		animation: spin 0.8s linear infinite;
	}
	.steps li.ok {
		color: var(--ink);
	}
	.steps li.ok::before {
		border: 0;
		background: #3e9a57
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 10'%3E%3Cpath d='M1 5l3.5 3.5L11 1' stroke='%23fff' stroke-width='2' fill='none'/%3E%3C/svg%3E")
			center/9px no-repeat;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	/* .mc-demo */
	.demo {
		display: block;
		margin: 12px auto 0;
		border: 0;
		background: none;
		font: inherit;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
		cursor: pointer;
		/* The browser's button padding (Tailwind's preflight zeroes it). */
		padding: 1px 6px;
	}
	@media (prefers-reduced-motion: reduce) {
		.beam,
		.steps li.on::before {
			animation: none;
		}
	}
</style>
