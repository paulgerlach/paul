<!--
  The hero's example check (`.ss-hv`, decorative): three device photos and
  the card "Ihr Zählercheck". Server-rendered finished; in view it fills the
  rows one by one, pings the photo each row counts into, counts the photos'
  badges up and fills the bar, then starts over (the design's loop, through
  `loopInView`, nothing with reduced motion).
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { DEVICE_PHOTOS } from "../photos";
	import { heroCheck } from "../content";

	type Photo = "kwz" | "hkv" | "wmz";
	/** The photos as the design places them (d1, d2, d3). */
	const PHOTOS: { key: Photo; cls: string; w: number; h: number }[] = [
		{ key: "kwz", cls: "d1", w: 753, h: 818 },
		{ key: "hkv", cls: "d2", w: 239, h: 591 },
		{ key: "wmz", cls: "d3", w: 816, h: 596 },
	];
	const END = Object.fromEntries(
		heroCheck.rows.flatMap((r) => ("photo" in r ? [[r.photo, r.n]] : [])),
	) as Record<Photo, number>;
	/** The design's schedule, ms: first row, row to row, a row's steps, rest. */
	const START = 700;
	const STEP = 950;
	const ROWS = heroCheck.rows.length;
	const PASS = START + ROWS * STEP + 5200;

	let anim = $state(false);
	let rows = $state(
		heroCheck.rows.map(() => ({ on: false, done: false, wait: false })),
	);
	let badges = $state(
		PHOTOS.map((p) => ({
			key: p.key,
			n: END[p.key],
			on: true,
			pop: 0,
			ping: false,
		})),
	);
	let foot = $state(false);
	let bar = $state(100);

	function run() {
		const timers: ReturnType<typeof setTimeout>[] = [];
		const later = (f: () => void, ms: number) => timers.push(setTimeout(f, ms));
		anim = true;
		for (const b of badges)
			Object.assign(b, { n: 0, on: false, pop: 0, ping: false });
		for (const r of rows)
			Object.assign(r, { on: false, done: false, wait: true });
		foot = false;
		bar = 0;
		heroCheck.rows.forEach((row, i) => {
			const badge =
				"photo" in row ? badges.find((b) => b.key === row.photo) : undefined;
			later(
				() => {
					rows[i].on = true;
					if (!badge) return;
					badge.ping = true;
					later(() => (badge.ping = false), 800);
				},
				START + i * STEP,
			);
			later(
				() => {
					Object.assign(rows[i], { wait: false, done: true });
					if (badge) {
						badge.n += row.n;
						badge.on = true;
						badge.pop++;
					}
					bar = ((i + 1) / (ROWS + 1)) * 100;
				},
				START + i * STEP + 520,
			);
			later(() => (rows[i].on = false), START + i * STEP + 900);
		});
		later(
			() => {
				foot = true;
				bar = 100;
			},
			START + ROWS * STEP + 200,
		);
		return () => timers.forEach(clearTimeout);
	}
</script>

<div
	class={["hv rv", anim && "anim"]}
	aria-hidden="true"
	{@attach loopInView({ run, every: PASS, threshold: 0.35 })}
>
	<div class="devs">
		{#each PHOTOS as p, i (p.key)}
			{@const b = badges[i]}
			<figure class={[p.cls, b.ping && "ping"]}>
				<Image
					src={DEVICE_PHOTOS[p.key]}
					alt=""
					width={p.w}
					height={p.h}
					sizes="260px"
				/>
				{#key b.pop}
					<span class={["n", b.on && "on", b.pop && "pop"]}>{b.n} ×</span>
				{/key}
			</figure>
		{/each}
	</div>
	<div class="card">
		<div class="h">
			<b>{heroCheck.title}</b><span class="demo">{heroCheck.badge}</span>
		</div>
		<div class="bar"><i style:width="{bar}%"></i></div>
		{#each heroCheck.rows as row, i (row.label)}
			{@const s = rows[i]}
			<div
				class={[
					"r",
					"gateway" in row && "g",
					s.on && "on",
					s.done && "done",
					s.wait && "wait",
				]}
			>
				<span>{row.label}</span><b>{s.wait ? "–" : `${row.n} ×`}</b>
			</div>
		{/each}
		<div class={["f", foot && "on"]}>
			<span class="okb"><Check /></span>{heroCheck.done}
		</div>
	</div>
</div>

<style>
	.hv {
		position: relative;
		min-height: 440px;
		display: grid;
		place-items: center;
	}
	.devs {
		position: absolute;
		inset: 0;
	}
	.devs figure {
		position: absolute;
		margin: 0;
		display: grid;
		place-items: center;
		background: #eff2f0;
		border-radius: 22px;
		border: 1px solid var(--hair);
		transition:
			border-color 0.35s,
			box-shadow 0.35s;
	}
	.devs :global(img) {
		max-width: 78%;
		max-height: 78%;
		width: auto;
		height: auto;
		object-fit: contain;
		filter: drop-shadow(0 16px 20px rgba(30, 50, 45, 0.2));
		transition: transform 0.45s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.devs .d1 {
		left: 0;
		top: 6%;
		width: 44%;
		aspect-ratio: 1;
		animation: ss-fl 7s ease-in-out infinite;
	}
	.devs .d2 {
		right: 4%;
		top: 0;
		width: 26%;
		aspect-ratio: 0.62;
		animation: ss-fl 8s ease-in-out 0.6s infinite;
	}
	.devs .d3 {
		right: 0;
		bottom: 2%;
		width: 40%;
		aspect-ratio: 1.25;
		animation: ss-fl 7.5s ease-in-out 1.2s infinite;
	}
	@keyframes ss-fl {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -7px;
		}
	}
	.devs figure.ping {
		border-color: #8ad68f;
		box-shadow: 0 0 0 5px rgba(138, 214, 143, 0.28);
	}
	.devs figure.ping :global(img) {
		transform: scale(1.04);
	}
	.n {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 3;
		min-width: 38px;
		height: 30px;
		padding: 0 10px;
		border-radius: 999px;
		background: var(--ink);
		color: #fff;
		font-size: 13.5px;
		font-weight: 600;
		display: grid;
		place-items: center;
		box-shadow: 0 8px 18px -8px rgba(30, 50, 45, 0.55);
		font-variant-numeric: tabular-nums;
		transition:
			opacity 0.3s,
			transform 0.3s;
	}
	.anim .n {
		opacity: 0;
		transform: scale(0.6);
	}
	.anim .n.on {
		opacity: 1;
		transform: none;
	}
	.n.pop {
		animation: ss-hvpop 0.42s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.card {
		position: relative;
		z-index: 2;
		width: min(330px, 88%);
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 18px 18px 16px;
		box-shadow: 0 34px 70px -34px rgba(30, 50, 45, 0.45);
	}
	.h {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}
	.h b {
		font-size: 15px;
		font-weight: 600;
	}
	/* .dbm-demo */
	.demo {
		display: inline-flex;
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
		white-space: nowrap;
	}
	.bar {
		height: 3px;
		background: #eef1ef;
		border-radius: 3px;
		margin: 4px 0 6px;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: #8ad68f;
		border-radius: 3px;
		transition: width 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.r {
		position: relative;
		display: flex;
		justify-content: space-between;
		font-size: 13.5px;
		padding: 8px 0;
		border-top: 1px solid #eef1ef;
		color: var(--muted);
	}
	.r::before {
		content: "";
		position: absolute;
		inset: 1px -10px;
		border-radius: 9px;
		background: #eef7ef;
		opacity: 0;
		transition: opacity 0.35s;
		z-index: -1;
	}
	.r.on::before {
		opacity: 1;
	}
	.r.on span,
	.r.g span {
		color: var(--ink);
	}
	.r b {
		display: inline-block;
		min-width: 28px;
		text-align: right;
		color: var(--ink);
		font-weight: 600;
		transition: color 0.3s;
	}
	.r.wait b {
		color: #b7c2bd;
		font-weight: 500;
	}
	.r.done b {
		animation: ss-hvpop 0.42s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	@keyframes ss-hvpop {
		0% {
			transform: scale(0.6);
			opacity: 0;
		}
		100% {
			transform: none;
			opacity: 1;
		}
	}
	.f {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 8px;
		font-size: 13px;
		font-weight: 600;
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.f .okb {
		width: 20px;
		height: 20px;
	}
	.anim .f {
		opacity: 0;
		transform: translateY(6px);
	}
	.anim .f.on {
		opacity: 1;
		transform: none;
	}
	.f.on .okb {
		animation: ss-hvpop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	@media (max-width: 1040px) {
		.hv {
			min-height: 380px;
		}
	}
	@media (max-width: 640px) {
		.hv {
			min-height: 320px;
		}
		.n {
			top: 8px;
			right: 8px;
			height: 26px;
			min-width: 32px;
			font-size: 12.5px;
			padding: 0 8px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.devs figure {
			animation: none;
		}
	}
</style>
