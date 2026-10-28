<!--
  Card 1's picture (the design's #iq-a1, "Funkablesung"): five devices of
  three manufacturers are read one after another (waves and dots, then the
  value counts up), with the count and the bar. A pass every 8.8 s while
  30 % of it is in view; stopping leaves every value read. Server-rendered
  read (the design's reduced-motion state). Hidden from screen readers.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { tweenNumber } from "$lib/landing/motion";
	import BrandMark from "../components/BrandMark.svelte";
	import PhoneFrame from "../components/PhoneFrame.svelte";
	import { reading } from "../content";
	import { READING, readingAt } from "../scenes";

	const n = reading.rows.length;
	const formats = reading.rows.map(
		(r) =>
			new Intl.NumberFormat("de-DE", {
				minimumFractionDigits: r.decimals,
				maximumFractionDigits: r.decimals,
			}),
	);

	let phase = $state<("" | "rd" | "dn")[]>(reading.rows.map(() => "dn"));
	/** The shown values; `null`: not read yet ("–"). */
	let values = $state<(number | null)[]>(reading.rows.map((r) => r.value));
	let count = $state(n);

	function run() {
		phase = reading.rows.map(() => "");
		values = reading.rows.map(() => null);
		count = 0;
		const timers: ReturnType<typeof setTimeout>[] = [];
		const tweens: (() => void)[] = [];
		reading.rows.forEach((row, i) => {
			const { start, done } = readingAt(i);
			timers.push(setTimeout(() => (phase[i] = "rd"), start));
			timers.push(
				setTimeout(() => {
					phase[i] = "dn";
					count = i + 1;
					tweens.push(
						tweenNumber(0, row.value, READING.count, (v) => (values[i] = v)),
					);
				}, done),
			);
		});
		return () => {
			timers.forEach(clearTimeout);
			tweens.forEach((cancel) => cancel());
			phase = reading.rows.map(() => "dn");
			values = reading.rows.map((r) => r.value);
			count = n;
		};
	}
</script>

<PhoneFrame {@attach loopInView({ run, every: READING.every, threshold: 0.3 })}>
	<div class="hd">
		<span class="tl"><b>{reading.title}</b><small>{reading.sub}</small></span>
		<span class="cnt"><b>{count}</b>&thinsp;/&thinsp;{n}</span>
	</div>
	<div class="pg"><span style:width="{(count / n) * 100}%"></span></div>
	{#each reading.rows as row, i (i)}
		<div class={["row", phase[i]]}>
			<span class="rb"
				><BrandMark brand={row.brand} size={13} class="sh" /><i class="wv"
				></i><i class="wv"></i></span
			>
			<span class="tx"><b>{row.name}</b><small>{row.sub}</small></span>
			<span class="vl"
				><i class="dots"><em></em><em></em><em></em></i><b
					>{values[i] === null ? "–" : formats[i].format(values[i])}</b
				><small>{row.unit}</small></span
			>
		</div>
	{/each}
</PhoneFrame>

<style>
	.hd {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.tl b {
		display: block;
		font-size: 13.5px;
		font-weight: 500;
	}
	.tl small {
		display: block;
		font-size: 10.5px;
		color: rgba(30, 50, 45, 0.5);
		margin-top: 1px;
	}
	.cnt {
		font-size: 11px;
		background: #eef1ef;
		color: #1e322d;
		border-radius: 20px;
		padding: 3px 8px;
		font-variant-numeric: tabular-nums;
	}
	.cnt b {
		font-weight: 600;
	}
	.pg {
		height: 4px;
		border-radius: 2px;
		background: #eef1ef;
		margin: -2px 0 8px;
		overflow: hidden;
	}
	.pg span {
		display: block;
		height: 100%;
		background: #8ad68f;
		border-radius: 2px;
		transition: width 0.6s cubic-bezier(0.3, 0.7, 0.2, 1);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 7px 6px;
		margin: 0 -6px;
		border-radius: 10px;
		transition: background 0.4s;
	}
	.row + .row {
		box-shadow: 0 -1px 0 rgba(30, 50, 45, 0.06);
	}
	.rb {
		position: relative;
		flex: none;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		background: #f3f5f4;
		display: grid;
		place-items: center;
	}
	.rb :global(.sh) {
		display: block;
		flex: none;
		position: relative;
		z-index: 1;
	}
	.tx {
		flex: 1;
		min-width: 0;
	}
	.tx b {
		display: block;
		font-size: 12.5px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tx small {
		display: block;
		font-size: 10.5px;
		color: rgba(30, 50, 45, 0.5);
	}
	.wv {
		position: absolute;
		inset: 0;
		border-radius: 9px;
		border: 1.5px solid currentColor;
		opacity: 0;
		color: #8ad68f;
	}
	.row.rd {
		background: rgba(138, 214, 143, 0.13);
	}
	.row.rd .wv {
		animation: iq-wv 1.1s cubic-bezier(0.2, 0.7, 0.3, 1) infinite;
	}
	.row.rd .wv + .wv {
		animation-delay: 0.45s;
	}
	@keyframes iq-wv {
		0% {
			opacity: 0.9;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(1.9);
		}
	}
	.vl {
		flex: none;
		min-width: 64px;
		text-align: right;
		position: relative;
		font-variant-numeric: tabular-nums;
		line-height: 1.1;
	}
	.vl > b {
		font-size: 12.5px;
		font-weight: 500;
		color: rgba(30, 50, 45, 0.3);
		transition: color 0.3s;
	}
	.vl small {
		display: block;
		font-size: 9.5px;
		color: rgba(30, 50, 45, 0.45);
	}
	.dots {
		position: absolute;
		right: 0;
		top: 3px;
		display: flex;
		gap: 2px;
		opacity: 0;
		transition: opacity 0.2s;
	}
	.dots em {
		width: 3.5px;
		height: 3.5px;
		border-radius: 50%;
		background: #1e322d;
		animation: iq-dt 1s infinite;
	}
	.dots em:nth-child(2) {
		animation-delay: 0.15s;
	}
	.dots em:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes iq-dt {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 1;
		}
	}
	.row.rd .dots {
		opacity: 1;
	}
	.row.rd .vl > b {
		opacity: 0;
	}
	.row.dn .vl > b {
		color: #1e322d;
	}
	.row.dn .rb {
		background: rgba(138, 214, 143, 0.3);
		transition: background 0.4s;
	}
	@media (max-width: 560px) {
		.vl {
			min-width: 50px;
		}
		.tx small {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
