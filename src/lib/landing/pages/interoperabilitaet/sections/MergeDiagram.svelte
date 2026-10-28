<!--
  Card 2's picture (the design's #iq-a2, "Datenstrom"): three manufacturers'
  devices send packets along curves into the Heidi dashboard, whose rows
  and total grow by six devices a packet until all 102 are in. A pass every
  10.1 s while 30 % of it is in view; stopping leaves it full. Server-
  rendered full (the design's reduced-motion state). The curves are fixed in
  the diagram's 470 × 224 box, so the packets move without measuring.
  Hidden from screen readers.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import BrandMark from "../components/BrandMark.svelte";
	import BrowserFrame from "../components/BrowserFrame.svelte";
	import { BRANDS, merge } from "../content";
	import {
		cubicPath,
		ease,
		MERGE,
		MERGE_CURVES,
		mergeSequence,
		mergeTimes,
		pointAtShare,
	} from "../scenes";

	const totals = merge.sources.map((s) => s.total);
	const max = Math.max(...totals);
	const keys = merge.sources.map((s) => s.key);
	const seq = mergeSequence(merge.sources, merge.step);
	const { at, every } = mergeTimes(seq, keys[keys.length - 1]);

	let counts = $state([...totals]);
	const total = $derived(counts.reduce((a, b) => a + b, 0));
	/** Per source: packets sent and received this pass (each restarts its flash). */
	let sent = $state(totals.map(() => 0));
	let received = $state(totals.map(() => 0));
	let hits = $state(0);
	let packets = $state<{ id: number; source: number; x: number; y: number }[]>(
		[],
	);

	function run() {
		counts = totals.map(() => 0);
		sent = totals.map(() => 0);
		received = totals.map(() => 0);
		packets = [];
		const timers: ReturnType<typeof setTimeout>[] = [];
		const frames: Record<number, number> = {};
		seq.forEach((key, n) => {
			const s = keys.indexOf(key);
			timers.push(
				setTimeout(() => {
					sent[s]++;
					const curve = MERGE_CURVES[s];
					packets.push({ id: n, source: s, ...curve[0] });
					const t0 = performance.now();
					const step = (now: number) => {
						const p = Math.min(1, (now - t0) / MERGE.flight);
						const pt = pointAtShare(curve, ease(p));
						const packet = packets.find((q) => q.id === n);
						if (packet) {
							packet.x = pt.x;
							packet.y = pt.y;
						}
						if (p < 1) {
							frames[n] = requestAnimationFrame(step);
							return;
						}
						delete frames[n];
						packets = packets.filter((q) => q.id !== n);
						counts[s] = Math.min(totals[s], counts[s] + merge.step);
						received[s]++;
						hits++;
					};
					frames[n] = requestAnimationFrame(step);
				}, at[n]),
			);
		});
		return () => {
			timers.forEach(clearTimeout);
			Object.values(frames).forEach(cancelAnimationFrame);
			packets = [];
			counts = [...totals];
		};
	}

	const colors = merge.sources.map((_, i) => BRANDS[i].color);
</script>

<BrowserFrame
	style="--bw-pad: 20px 58px 0 18px; --bw-pad-s: 16px 48px 0 10px"
	{@attach loopInView({ run, every, threshold: 0.3 })}
>
	<svg viewBox="0 0 470 224" class="mgs">
		{#each MERGE_CURVES as curve, i (i)}
			<path class="cv" d={cubicPath(curve)} />
		{/each}
		{#each merge.sources as source, i (source.key)}
			<g
				class={["src", sent[i] > 0 && "on"]}
				transform="translate(6,{22 + i * 68})"
			>
				<rect class="nd" width="146" height="44" rx="10" />
				{#key sent[i]}<circle
						class={["em", sent[i] > 0 && "on"]}
						cx="22"
						cy="22"
						r="11"
						fill={colors[i]}
					/>{/key}
				<g transform="translate(14,14)"><BrandMark brand={i} size={16} /></g>
				<text x="42" y="20" class="t1">{source.name}</text>
				<text x="42" y="34" class="t2">{source.device}</text>
			</g>
		{/each}
		<g transform="translate(280,22)">
			<rect class="db" width="182" height="180" rx="12" />
			<path
				class="dbh"
				d="M0 12a12 12 0 0 1 12-12h158a12 12 0 0 1 12 12v22H0z"
			/>
			<text x="14" y="22" class="th">{merge.app}</text>
			<circle cx="162" cy="17" r="4" class="lv" />
			<text x="14" y="54" class="t2">{merge.united}</text>
			<text x="14" y="78" class="big">{total}</text>
			{#key hits}<circle
					class={["hit", hits > 0 && "on"]}
					cx="0"
					cy="112"
					r="5"
				/>{/key}
			{#each merge.sources as source, i (source.key)}
				<g class="row" transform="translate(14,{96 + i * 27})">
					<BrandMark brand={i} size={11} />
					{#key received[i]}<text
							x="18"
							y="9.5"
							class={["t3", received[i] > 0 && "on"]}>{source.name}</text
						><text
							x="154"
							y="9.5"
							class={["t3 n", received[i] > 0 && "on"]}
							text-anchor="end">{counts[i]}</text
						>{/key}
					<rect class="tr" x="0" y="16" width="154" height="5" rx="2.5" />
					<rect
						class="fl"
						x="0"
						y="16"
						width="154"
						height="5"
						rx="2.5"
						fill={colors[i]}
						style:transform="scaleX({counts[i] / max})"
					/>
				</g>
			{/each}
		</g>
		<g class="pk">
			{#each packets as p (p.id)}
				<circle r="4.5" cx={p.x} cy={p.y} fill={colors[p.source]} />
			{/each}
		</g>
	</svg>
</BrowserFrame>

<style>
	.mgs {
		display: block;
		width: 100%;
		height: auto;
		max-width: 520px;
		font-family: inherit;
		overflow: visible;
	}
	.cv {
		fill: none;
		stroke: rgba(30, 50, 45, 0.14);
		stroke-width: 1.4;
		stroke-dasharray: 3 4;
	}
	.nd {
		fill: #fff;
		stroke: rgba(30, 50, 45, 0.14);
		transition: stroke 0.3s;
	}
	.src.on .nd {
		stroke: rgba(30, 50, 45, 0.4);
	}
	.em {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
	}
	.em.on {
		animation: iq-em 0.7s ease-out;
	}
	@keyframes iq-em {
		0% {
			opacity: 0.35;
			transform: scale(0.6);
		}
		100% {
			opacity: 0;
			transform: scale(2.1);
		}
	}
	.t1 {
		font-size: 12px;
		fill: #1e322d;
		font-weight: 500;
	}
	.t2 {
		font-size: 10px;
		fill: rgba(30, 50, 45, 0.55);
	}
	.t3 {
		font-size: 10.5px;
		fill: #1e322d;
	}
	.t3.n {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.t3.on {
		animation: iq-fl 0.5s;
	}
	@keyframes iq-fl {
		40% {
			fill: #2e7a45;
		}
	}
	.big {
		font-size: 26px;
		fill: #1e322d;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}
	.db {
		fill: #fff;
		stroke: rgba(30, 50, 45, 0.14);
	}
	.dbh {
		fill: #1e322d;
	}
	.th {
		font-size: 11.5px;
		fill: #fff;
		font-weight: 500;
	}
	.lv {
		fill: #8ad68f;
	}
	.hit {
		fill: #8ad68f;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
	}
	.hit.on {
		animation: iq-em 0.5s ease-out;
	}
	.tr {
		fill: #eef1ef;
	}
	.fl {
		transform-box: fill-box;
		transform-origin: left;
		transition: transform 0.45s cubic-bezier(0.3, 0.7, 0.2, 1);
	}
	.pk circle {
		filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.9));
	}
</style>
