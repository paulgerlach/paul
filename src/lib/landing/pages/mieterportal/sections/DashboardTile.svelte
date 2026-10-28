<!--
  The bento's mini dashboard (the design's .md-tile / #md-js): a 640×340
  dashboard scaled to fit the tile. Every 10.4 s in view it replays a
  reading: the tab pill slides to "Monatlich", the lines draw, the bars grow,
  the four meter groups turn green one by one and the toast appears. The
  server renders the finished state; the scale is set in the browser (it's
  layout, so also with reduced motion). The tile is one labelled image.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { dashboard } from "../content";
	import { curvePath } from "../curve";

	const MONTHLY = dashboard.tabs.length - 1;
	const curves = dashboard.charts.map((c) => ({
		...c,
		path: curvePath(c.values, c.max),
	}));

	let tab = $state(MONTHLY);
	let go = $state(true);
	let rowsOk = $state(dashboard.status.rows.length);
	let headOk = $state(true);
	let toast = $state(true);
	let out = $state(false);

	/** Scale and inner size; unset on the server (the tile clips at 1). */
	let fit = $state<{ s: number; w: number; h: number }>();
	let pill = $state<{ left: number; width: number }>();
	let tabEls: HTMLElement[] = $state([]);

	function place() {
		const el = tabEls[tab];
		if (el) pill = { left: el.offsetLeft, width: el.offsetWidth };
	}
	$effect(() => {
		// Re-place on tab change and once the scaled size is known.
		void tab;
		void fit;
		place();
	});

	function measure(box: HTMLElement) {
		const update = () => {
			const s = Math.min(1.25, Math.max(0.6, box.clientHeight / 340));
			fit = { s, w: box.clientWidth / s, h: box.clientHeight / s };
		};
		const observer = new ResizeObserver(update);
		observer.observe(box);
		update();
		return () => observer.disconnect();
	}

	function run() {
		go = false;
		out = false;
		rowsOk = 0;
		headOk = false;
		toast = false;
		tab = 1;
		const n = dashboard.status.rows.length;
		const timers = [
			setTimeout(() => (tab = MONTHLY), 500),
			setTimeout(() => (go = true), 1000),
			...dashboard.status.rows.map((_, i) =>
				setTimeout(() => (rowsOk = i + 1), 1500 + i * 550),
			),
			setTimeout(() => (headOk = true), 1500 + n * 550 + 150),
			setTimeout(() => (toast = true), 1500 + n * 550 + 600),
			setTimeout(() => (out = true), 9600),
		];
		return () => timers.forEach(clearTimeout);
	}
</script>

{#snippet check()}
	<svg viewBox="0 0 12 12"
		><path
			d="M2.5 6.2l2.3 2.3 4.7-4.9"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
		/></svg
	>
{/snippet}

<div
	class="box"
	role="img"
	aria-label={dashboard.label}
	{@attach measure}
	{@attach loopInView({ run, every: 10400 })}
>
	<div
		class={["md", go && "go", out && "out"]}
		aria-hidden="true"
		style:width={fit ? `${fit.w}px` : undefined}
		style:height={fit ? `${fit.h}px` : undefined}
		style:transform={fit ? `scale(${fit.s})` : undefined}
	>
		<div class="top">
			<div class="pf">
				<b>{dashboard.portfolio.title}</b><small
					>{dashboard.portfolio.sub}</small
				>
			</div>
			<div class="pf">
				<b>{dashboard.period.title}</b><small>{dashboard.period.sub}</small>
			</div>
			<div class="tg"><i></i>{dashboard.toggle}</div>
			<div class="share">{dashboard.share}</div>
			<div class="acc">{dashboard.account}</div>
		</div>
		<div class={["tabs", pill && "placed"]}>
			{#each dashboard.tabs as label, i (label)}
				<span class={[i === tab && "on"]} bind:this={tabEls[i]}>{label}</span>
			{/each}
			<em
				class="pill"
				style:left={pill ? `${pill.left}px` : undefined}
				style:width={pill ? `${pill.width}px` : undefined}
			></em>
		</div>
		<div class={["toast", toast && "on"]}>
			<span class="ic ok">{@render check()}</span>
			<div>
				<b>{dashboard.toast.title}</b><small>{dashboard.toast.sub}</small>
			</div>
		</div>
		<div class="cards">
			{#each curves as c (c.key)}
				<div class="card">
					<div class="h">{c.title}</div>
					<div class="lg">
						<span class={["sq", c.key]}></span>{c.unit}<span class="vj"
							>{dashboard.lastYear}</span
						>
					</div>
					<div class="plot">
						<div class="y">
							{#each c.ticks as t (t)}
								<i style:bottom="{(t / c.max) * 100}%">{t}</i>
							{/each}
						</div>
						<svg
							class={["svg", c.key]}
							viewBox="0 0 200 100"
							preserveAspectRatio="none"
							><path class="ar" d={c.path.area} /><path
								class="ln"
								d={c.path.line}
								pathLength="1"
							/></svg
						>
						<b
							class={["dot", c.key]}
							style:left="{c.path.dot.left}%"
							style:top="{c.path.dot.top}%"
						></b>
					</div>
					<div class="x">
						{#each dashboard.months as m (m)}<span>{m}</span>{/each}
					</div>
				</div>
			{/each}
			<div class="card st">
				<div class="h">
					{dashboard.status.title}<span class={["ic big", headOk && "ok"]}
						>{@render check()}</span
					>
				</div>
				{#each dashboard.status.rows as row, i (row)}
					<div class={["r", i < rowsOk && "ok"]}>
						<span class="ic">{@render check()}</span>
						<div>
							<b>{row}</b>
							<small
								><span class="a">{dashboard.status.before}</span><span class="b"
									>{dashboard.status.after}</span
								></small
							>
						</div>
					</div>
				{/each}
			</div>
			<div class="card lo">
				<div class="h">{dashboard.heating.title}</div>
				<div class="bars">
					{#each dashboard.heating.bars as h, i (i)}
						<i
							style:--h="{h}%"
							style:transition-delay="{(1.2 + i * 0.06).toFixed(2)}s"
						></i>
					{/each}
				</div>
			</div>
			{#each dashboard.empty as title (title)}
				<div class="card lo"><div class="h">{title}</div></div>
			{/each}
		</div>
	</div>
</div>

<style>
	.box {
		position: absolute;
		inset: 0;
	}
	.md {
		position: absolute;
		left: 0;
		top: 0;
		width: 640px;
		height: 340px;
		overflow: hidden;
		container-type: inline-size;
		transform-origin: 0 0;
		background: #f4f6f4;
		border-radius: 20px;
		padding: 14px 16px;
		font-size: 10px;
		color: #1e322d;
		line-height: 1.25;
		transition: opacity 0.6s;
	}
	.md.out {
		opacity: 0;
	}
	.md small {
		display: block;
		white-space: nowrap;
		color: #7a8a85;
		font-size: 8.5px;
		font-weight: 500;
	}
	.top {
		display: flex;
		align-items: center;
		gap: 22px;
		background: #fff;
		margin: -14px -16px 10px;
		padding: 10px 20px;
		border-radius: 20px 20px 0 0;
		border-bottom: 1px solid #e6eae8;
	}
	.pf b {
		font-size: 9.5px;
		font-weight: 600;
	}
	.tg {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-left: auto;
		color: #53625d;
	}
	.tg i {
		width: 20px;
		height: 11px;
		border-radius: 9px;
		background: #d7ddda;
		position: relative;
	}
	.tg i::after {
		content: "";
		position: absolute;
		left: 2px;
		top: 2px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #fff;
	}
	.share {
		white-space: nowrap;
		background: #8ad68f;
		color: #1e322d;
		border-radius: 6px;
		padding: 6px 10px;
		font-weight: 600;
	}
	.acc {
		color: #53625d;
	}
	.tabs {
		position: relative;
		display: inline-flex;
		gap: 4px;
		margin: 2px 0 10px 6px;
	}
	.tabs span {
		position: relative;
		z-index: 1;
		padding: 5px 7px;
		color: #53625d;
		border-radius: 6px;
		transition: color 0.4s;
	}
	.tabs span.on {
		color: #1e322d;
		font-weight: 600;
	}
	/* Until the pill is placed (server, first frame), the tab itself is lit. */
	.tabs:not(.placed) span.on {
		background: #8ad68f;
	}
	.pill {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 6px;
		background: #8ad68f;
		transition:
			left 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
			width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.tabs:not(.placed) .pill {
		display: none;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.card {
		background: #fff;
		border-radius: 10px;
		padding: 10px 10px 8px;
		box-shadow: 0 1px 0 #e6eae8;
	}
	.h {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
		font-weight: 600;
		margin-bottom: 6px;
	}
	.lg {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		font-size: 8px;
		color: #53625d;
		margin-bottom: 4px;
	}
	.sq {
		width: 7px;
		height: 7px;
		border-radius: 2px;
	}
	.sq.kw {
		background: #5b7fd1;
	}
	.sq.ww {
		background: #e07462;
	}
	.vj {
		border: 1px solid #e1e6e3;
		border-radius: 9px;
		padding: 1px 6px;
		color: #8a9893;
	}
	.plot {
		position: relative;
		height: 104px;
		margin-left: 22px;
	}
	.y i {
		position: absolute;
		left: -22px;
		right: 0;
		transform: translateY(50%);
		font-style: normal;
		font-size: 7px;
		color: #8a9893;
		line-height: 8px;
		height: 8px;
	}
	.y i::after {
		content: "";
		position: absolute;
		left: 22px;
		right: 0;
		top: 50%;
		border-top: 1px dashed #eef1ef;
	}
	.svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
	}
	.ln {
		fill: none;
		stroke-width: 1.6;
		vector-effect: non-scaling-stroke;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.ar {
		opacity: 0;
		transition: opacity 1s ease;
	}
	.svg.kw .ln {
		stroke: #5b7fd1;
	}
	.svg.kw .ar {
		fill: rgba(91, 127, 209, 0.12);
	}
	.svg.ww .ln {
		stroke: #e07462;
	}
	.svg.ww .ar {
		fill: rgba(224, 116, 98, 0.13);
	}
	.go .ln {
		transition: stroke-dashoffset 1.8s cubic-bezier(0.45, 0.05, 0.25, 1);
		stroke-dashoffset: 0;
	}
	.go .ar {
		opacity: 1;
		transition-delay: 1.2s;
	}
	.go .svg.ww .ln {
		transition-delay: 0.35s;
	}
	.dot {
		position: absolute;
		width: 7px;
		height: 7px;
		margin: -3.5px 0 0 -3.5px;
		border-radius: 50%;
		opacity: 0;
		transform: scale(0.4);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.dot.kw {
		background: #5b7fd1;
		box-shadow: 0 0 0 4px rgba(91, 127, 209, 0.18);
	}
	.dot.ww {
		background: #e07462;
		box-shadow: 0 0 0 4px rgba(224, 116, 98, 0.18);
	}
	.go .dot {
		opacity: 1;
		transform: scale(1);
		transition-delay: 1.9s;
	}
	.go .dot.ww {
		transition-delay: 2.2s;
	}
	.x {
		display: flex;
		justify-content: space-between;
		margin: 5px 0 0 22px;
		font-size: 6.5px;
		color: #8a9893;
	}
	.ic {
		width: 16px;
		height: 16px;
		border-radius: 5px;
		flex: none;
		display: grid;
		place-items: center;
		background: #eef1ef;
		color: transparent;
		position: relative;
		transition:
			background 0.35s,
			color 0.35s;
	}
	.ic svg {
		width: 10px;
		height: 10px;
	}
	.ic::before {
		content: "";
		position: absolute;
		inset: 3px;
		border-radius: 50%;
		border: 1.5px solid #b9c4bf;
		border-top-color: transparent;
		animation: spin 0.8s linear infinite;
		transition: opacity 0.2s;
	}
	.ic.ok,
	.r.ok .ic {
		background: #e3f4e4;
		color: #2f7a3c;
	}
	.ic.ok::before,
	.r.ok .ic::before {
		opacity: 0;
		animation: none;
	}
	.ic.big {
		width: 14px;
		height: 14px;
		border-radius: 50%;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.r {
		display: flex;
		gap: 8px;
		align-items: flex-start;
		padding: 5px 0;
	}
	.r b {
		font-size: 8.5px;
		font-weight: 600;
	}
	.md .r small {
		font-size: 7px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		position: relative;
		height: 9px;
		overflow: hidden;
	}
	.r small span {
		display: block;
		line-height: 9px;
		height: 9px;
		white-space: nowrap;
		transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.r small .b {
		color: #2f7a3c;
	}
	.r.ok small span {
		transform: translateY(-100%);
	}
	.st .h .ic.ok {
		background: #2f7a3c;
		color: #fff;
		animation: pop 0.5s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	@keyframes pop {
		0% {
			transform: scale(0.4);
		}
		100% {
			transform: scale(1);
		}
	}
	.lo {
		height: 90px;
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 5px;
		height: 44px;
		margin-top: 4px;
	}
	.bars i {
		flex: 1;
		background: #c9e9cb;
		border-radius: 3px 3px 0 0;
		height: var(--h);
		transform: scaleY(0);
		transform-origin: bottom;
		transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.go .bars i {
		transform: none;
	}
	.toast {
		position: absolute;
		right: 14px;
		bottom: 14px;
		z-index: 3;
		display: flex;
		gap: 8px;
		align-items: center;
		background: #fff;
		border-radius: 8px;
		padding: 7px 10px;
		box-shadow: 0 10px 24px -12px rgba(30, 50, 45, 0.45);
		opacity: 0;
		transform: translateY(-8px);
		transition:
			opacity 0.5s,
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.toast b {
		font-size: 9px;
		font-weight: 600;
	}
	.toast.on {
		opacity: 1;
		transform: none;
	}
	@container (max-width: 560px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.cards > .card:nth-child(2),
		.cards > .card:nth-child(6) {
			display: none;
		}
		.tg,
		.acc {
			display: none;
		}
		.share {
			margin-left: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.md,
		.md * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
