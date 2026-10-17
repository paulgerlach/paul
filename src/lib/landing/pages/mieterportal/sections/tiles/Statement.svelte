<!--
  Row 3's tile: a Verbrauchsinformation with its four comparisons and the
  "Alle Pflichtangaben enthalten" check. Every 7 s in view the rows come in
  one by one, then the check.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "../../components/Tick.svelte";
	import { statementTile } from "../../content";

	const count = statementTile.rows.length;
	/** Rows shown so far; all of them and the check on the server. */
	let shown = $state(count);
	let ok = $state(true);

	function run() {
		shown = 0;
		ok = false;
		const timers = [
			...statementTile.rows.map((_, i) =>
				setTimeout(() => (shown = i + 1), 120 + i * 520),
			),
			setTimeout(() => (ok = true), 120 + count * 520 + 500),
		];
		return () => timers.forEach(clearTimeout);
	}
</script>

<div class={["doc", ok && "ok"]} {@attach loopInView({ run, every: 7000 })}>
	<div class="dh">
		<b>{statementTile.title}</b>
		<small>{statementTile.sub}</small>
	</div>
	{#each statementTile.rows as row, i (row.label)}
		<div class={["dr", i < shown && "on"]} style:--w="{row.share}%">
			<span>{row.label}</span><i></i><b>{row.value}</b>
		</div>
	{/each}
	<div class="dok"><span class="ck"><Tick /></span>{statementTile.result}</div>
</div>

<style>
	.doc {
		width: 100%;
		max-width: 440px;
		background: #fff;
		border-radius: 16px;
		padding: 22px 22px 18px;
		box-shadow: 0 24px 50px -34px rgba(30, 50, 45, 0.55);
	}
	.dh b {
		display: block;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.dh small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		margin-top: 2px;
	}
	.dr {
		display: grid;
		grid-template-columns: 132px minmax(0, 1fr) 40px;
		align-items: center;
		gap: 10px;
		margin-top: 14px;
		font-size: 13px;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.dr span {
		color: var(--muted);
	}
	.dr i {
		height: 10px;
		border-radius: 5px;
		background: #d7e3da;
		position: relative;
		overflow: hidden;
	}
	.dr i::after {
		content: "";
		position: absolute;
		inset: 0 auto 0 0;
		width: 0;
		background: #9dbfa6;
		border-radius: 5px;
		transition: width 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s;
	}
	.dh + .dr i::after {
		background: var(--ok);
	}
	.dr b {
		text-align: right;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.dr.on {
		opacity: 1;
		transform: none;
	}
	.dr.on i::after {
		width: var(--w);
	}
	.dok {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 18px;
		padding-top: 14px;
		border-top: 1px solid var(--hair);
		font-size: 13px;
		font-weight: 600;
		color: #2f7a3c;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.ck {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #e6f5e7;
		color: var(--ink);
		display: grid;
		place-items: center;
	}
	.ck :global(svg) {
		width: 10px;
		height: 10px;
	}
	.ok .dok {
		opacity: 1;
	}
	@media (max-width: 620px) {
		.dr {
			grid-template-columns: 104px minmax(0, 1fr) 34px;
			font-size: 12px;
		}
	}
</style>
