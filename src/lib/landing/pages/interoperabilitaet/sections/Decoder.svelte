<!--
  Row 1's tile (the design's .ip-dec, "Funktelegramme"): five radio
  telegrams come in one after another, flicker as hex and decode into the
  device, its place and its value; then the done line. A pass every 10.1 s
  while in view; stopping leaves it decoded. Server-rendered decoded (the
  design's reduced-motion state). The tile is hidden from screen readers
  (Rows).
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "$lib/landing/sections/uv/Tick.svelte";
	import DevicePhoto from "../components/DevicePhoto.svelte";
	import { decoder } from "../content";
	import { DECODER, telegram } from "../scenes";

	const n = decoder.rows.length;
	/** Rows shown and decoded so far. */
	let shown = $state(n);
	let decoded = $state(n);
	let done = $state(true);
	let hex = $state(decoder.rows.map(() => ""));

	function run() {
		shown = 0;
		decoded = 0;
		done = false;
		hex = decoder.rows.map(() => telegram());
		const timers: ReturnType<typeof setTimeout>[] = [];
		decoder.rows.forEach((_, i) => {
			const t = DECODER.first + i * DECODER.row;
			timers.push(setTimeout(() => (shown = i + 1), t));
			for (let j = 1; j <= DECODER.flickers; j++)
				timers.push(
					setTimeout(() => (hex[i] = telegram()), t + j * DECODER.flicker),
				);
			timers.push(setTimeout(() => (decoded = i + 1), t + DECODER.decode));
		});
		timers.push(
			setTimeout(
				() => (done = true),
				DECODER.first + n * DECODER.row + DECODER.doneAfter,
			),
		);
		return () => {
			timers.forEach(clearTimeout);
			shown = n;
			decoded = n;
			done = true;
		};
	}
</script>

<div
	class={["dec", done && "done"]}
	{@attach loopInView({ run, every: DECODER.every })}
>
	<div class="dh">
		<b>{decoder.title}</b><small>{decoder.sub}</small>
	</div>
	<div class="dl">
		{#each decoder.rows as row, i (i)}
			<div class={["dr", i < shown && "in", i < decoded && "dn"]}>
				<span class="di"><DevicePhoto image={row.image} size={26} /></span>
				<span class="hex">{hex[i]}</span>
				<span class="dn-t"><b>{row.name}</b><small>{row.place}</small></span>
				<em>{row.value}</em>
			</div>
		{/each}
	</div>
	<div class="ok">
		<span class="ck"><Tick /></span><span
			>{decoder.done[0]} <b>{decoder.done[1]}</b></span
		>
	</div>
</div>

<style>
	.dec {
		background: #fff;
		border-radius: 20px;
		width: 100%;
		max-width: 440px;
		padding: 18px 18px 16px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.45);
		color: var(--ink);
	}
	.dh {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
		white-space: nowrap;
		padding: 2px 4px 12px;
		border-bottom: 1px solid #eef1ef;
	}
	.dh b {
		font-size: 15px;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.dh small {
		font-size: 12px;
		color: var(--muted);
	}
	.dl {
		display: grid;
		gap: 6px;
		padding: 12px 0;
	}
	.dr {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) auto;
		align-items: center;
		gap: 10px;
		padding: 8px;
		border-radius: 12px;
		position: relative;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.4s,
			transform 0.4s,
			background 0.4s;
	}
	.dr.in {
		opacity: 1;
		transform: none;
	}
	.dr.dn {
		background: #f4f8f5;
	}
	.di {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: #f2f6f3;
		display: grid;
		place-items: center;
	}
	.hex {
		grid-column: 2/4;
		grid-row: 1;
		font:
			500 12px/1.2 ui-monospace,
			SFMono-Regular,
			Menlo,
			monospace;
		color: #8a9792;
		letter-spacing: 0.04em;
		white-space: nowrap;
		overflow: hidden;
		transition: opacity 0.3s;
	}
	.dn-t,
	.dr em {
		grid-row: 1;
		opacity: 0;
		transition: opacity 0.35s;
	}
	.dn-t {
		grid-column: 2;
	}
	.dr em {
		grid-column: 3;
		font-style: normal;
		font-size: 13.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.dr.dn .hex {
		opacity: 0;
	}
	.dr.dn .dn-t,
	.dr.dn em {
		opacity: 1;
	}
	.dn-t b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.dn-t small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.ok {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13.5px;
		color: var(--muted);
		padding: 12px 4px 2px;
		border-top: 1px solid #eef1ef;
		opacity: 0.35;
		transition: opacity 0.4s;
	}
	.ok b {
		color: var(--ink);
		font-weight: 600;
	}
	.done .ok {
		opacity: 1;
	}
	.ck {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #8ad68f;
		color: #1e322d;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ck :global(svg) {
		width: 12px;
		height: 12px;
	}
	@media (prefers-reduced-motion: reduce) {
		.dr {
			transition: none;
		}
	}
</style>
