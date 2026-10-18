<!--
  The integration's hand-over card (`.sx`): documents queued in Heidi move to
  "Ihre Software" one by one (plan 03, 3B.5). The moving parts are hidden
  from assistive tech; the figure's caption says what happens.
-->
<script lang="ts">
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import Icon from "../components/Icon.svelte";
	import { type HandoverItem, integration } from "../content";

	const h = integration.handover;
	const { items } = h;

	type Row = { id: number; item: HandoverItem; time: string; fresh: boolean };

	/** The server state: three queued, four received, 14 today. */
	let queue = $state(
		items.slice(0, 3).map((item, i) => ({ id: i, item, moving: false })),
	);
	let rows = $state<Row[]>(
		h.times.map((time, k) => ({
			id: -1 - k,
			item: items[(items.length - 1 - k) % items.length],
			time,
			fresh: false,
		})),
	);
	let count = $state(h.start);
	let syncing = $state(false);
</script>

<figure class="sx rv">
	<div aria-hidden="true">
		<div class="hd">
			<span class="live"><i></i>{h.live}</span>
			<span class="c">{h.counter} <b>{count}</b></span>
		</div>
		<div class="g">
			<div class="a">
				<div class="ah">
					<span class="mk"><HeidiMark /></span>
					<span><b>{h.source.name}</b><small>{h.source.sub}</small></span>
				</div>
				<small class="lb">{h.queueLabel}</small>
				<div class="q">
					{#each queue as card (card.id)}
						<div class={["d", card.moving && "go"]}>
							<span class="di"><Icon name={card.item.icon} /></span>
							<span class="dt"
								><b>{card.item.title}</b><small>{card.item.place}</small></span
							>
							<span class="ds"
								><i></i><em>{card.moving ? h.moving : h.ready}</em></span
							>
						</div>
					{/each}
				</div>
			</div>
			<div class="m">
				<span class="rail"><i></i></span>
				<span class={["sync", syncing && "spin"]}><Icon name="swap" /></span>
				<span class="rail"><i></i></span>
			</div>
			<div class="b">
				<div class="bh">
					<span class="dots"><i></i><i></i><i></i></span>
					<span class="bt">
						<span class="bi"><Icon name="server" /></span>
						<b>{h.target.name}</b><small>{h.target.sub}</small>
					</span>
				</div>
				<div class="th">
					<span>{h.columns[0]}</span><span>{h.columns[1]}</span>
				</div>
				<div class="tb">
					{#each rows as row (row.id)}
						<div class={["r", row.fresh && "new"]}>
							<i class="ri"><Icon name={row.item.icon} /></i>
							<span class="rt"
								><b>{row.item.title}</b><small>{row.item.place}</small></span
							>
							<span class="tm">
								{#if row.fresh}<em>{h.fresh}</em>{/if}<span>{row.time}</span>
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<figcaption class="ft">
		<span class="bd">{h.badge}</span>{h.caption}
	</figcaption>
</figure>

<style>
	.sx {
		position: relative;
		margin: 0;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 20px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.35);
		min-width: 0;
	}
	.hd {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 2px 4px 16px;
		font-size: 13px;
	}
	.live {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
	}
	.live i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3e9a57;
		animation: pp-ping 1.8s infinite;
	}
	@keyframes pp-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0.5);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(62, 154, 87, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0);
		}
	}
	.c {
		color: var(--muted);
	}
	.c b {
		display: inline-block;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		margin-left: 4px;
	}
	.g {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 40px minmax(0, 1.1fr);
		align-items: stretch;
	}
	.a {
		background: #1e322d;
		color: #fff;
		border-radius: 14px;
		padding: 14px;
		display: flex;
		flex-direction: column;
		min-height: 300px;
		min-width: 0;
	}
	.ah {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-bottom: 12px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	.ah b {
		display: block;
		font-size: 14px;
	}
	.ah small {
		display: block;
		font-size: 11.5px;
		color: rgba(255, 255, 255, 0.6);
	}
	.mk {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: rgba(255, 255, 255, 0.08);
		display: grid;
		place-items: center;
		color: #fff;
	}
	.mk :global(svg) {
		width: 16px;
		height: auto;
	}
	.lb {
		display: block;
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		margin: 14px 0 8px;
	}
	.q {
		display: grid;
		gap: 8px;
		min-width: 0;
	}
	.d {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 10px;
		padding: 9px 10px;
		min-width: 0;
		animation: sxin 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		transition:
			opacity 0.25s,
			background 0.3s,
			border-color 0.3s;
	}
	@keyframes sxin {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
	.d.go {
		background: rgba(138, 214, 143, 0.14);
		border-color: rgba(138, 214, 143, 0.45);
	}
	.di {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: rgba(138, 214, 143, 0.16);
		color: #8ad68f;
		display: grid;
		place-items: center;
		flex: none;
	}
	.di :global(svg),
	.ri :global(svg),
	.bi :global(svg) {
		width: 14px;
		height: 14px;
	}
	.dt {
		min-width: 0;
		flex: 1;
	}
	.dt b,
	.rt b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.dt small {
		display: block;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.6);
	}
	.ds {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 10.5px;
		color: rgba(255, 255, 255, 0.7);
		white-space: nowrap;
	}
	.ds i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.4);
	}
	.ds em {
		font-style: normal;
	}
	.go .ds {
		color: #8ad68f;
	}
	.go .ds i {
		width: 9px;
		height: 9px;
		background: none;
		border: 1.5px solid rgba(138, 214, 143, 0.35);
		border-top-color: #8ad68f;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.m {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.rail {
		width: 2px;
		flex: 1;
		max-height: 90px;
		background: #e6e9e7;
		border-radius: 1px;
		position: relative;
		overflow: hidden;
	}
	.rail i {
		position: absolute;
		left: 0;
		right: 0;
		height: 30%;
		top: -30%;
		background: #8ad68f;
		animation: sxr 2.2s linear infinite;
	}
	.rail:last-child i {
		animation-delay: 1.1s;
	}
	@keyframes sxr {
		to {
			top: 100%;
		}
	}
	.sync {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		color: #2f7a3c;
		box-shadow: 0 4px 10px -6px rgba(30, 50, 45, 0.3);
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.sync :global(svg) {
		width: 15px;
		height: 15px;
	}
	.sync.spin {
		border-color: #8ad68f;
		background: #f2faf3;
	}
	.sync.spin :global(svg) {
		animation: half 0.8s cubic-bezier(0.4, 0, 0.2, 1);
	}
	@keyframes half {
		to {
			transform: rotate(180deg);
		}
	}
	.b {
		border: 1px solid var(--hair);
		border-radius: 14px;
		background: #fafaf9;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}
	.bh {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		background: #fff;
		border-bottom: 1px solid var(--hair);
	}
	.dots {
		display: flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #e2e4e3;
	}
	.bt {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
	}
	.bt b {
		font-weight: 600;
	}
	.bt small {
		color: var(--muted);
		font-size: 11.5px;
	}
	.bi {
		width: 24px;
		height: 24px;
		border-radius: 7px;
		background: #eef1ef;
		display: grid;
		place-items: center;
	}
	.th {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 12px;
		font-size: 10.5px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--faint);
		height: 30px;
		border-bottom: 1px solid #eff0ef;
	}
	.tb {
		display: flex;
		flex-direction: column;
	}
	.r {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 48px;
		padding: 7px 12px;
		border-bottom: 1px solid #f0f1f0;
		background: #fff;
		transition: background 1.2s;
	}
	.ri {
		width: 26px;
		height: 26px;
		border-radius: 7px;
		background: #eef1ef;
		display: grid;
		place-items: center;
		flex: none;
		color: var(--ink);
	}
	.rt {
		flex: 1;
		min-width: 0;
	}
	.rt small {
		display: block;
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tm {
		flex: none;
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-size: 11px;
		white-space: nowrap;
	}
	.tm em {
		font-style: normal;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: #e3f3e4;
		color: #2f7a3c;
		border-radius: 4px;
		padding: 1px 5px;
	}
	.r.new {
		background: #f2faf3;
		animation: sxrow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.r.new .ri {
		background: #e3f3e4;
		color: #2f7a3c;
	}
	@keyframes sxrow {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	.ft {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 14px 4px 0;
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.45;
	}
	.bd {
		flex: none;
		font-size: 11px;
		font-weight: 600;
		background: #e3f3e4;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 2px 8px;
	}
	@media (max-width: 900px) {
		.g {
			grid-template-columns: minmax(0, 1fr);
		}
		.a {
			min-height: 0;
		}
		.m {
			flex-direction: row;
			height: 44px;
		}
		.rail {
			width: auto;
			height: 2px;
			max-height: none;
			max-width: 60px;
		}
		.rail i {
			width: 30%;
			height: 100%;
			top: 0;
			left: -30%;
			animation-name: sxr2;
		}
		@keyframes sxr2 {
			to {
				left: 100%;
			}
		}
		.q .d:nth-child(n + 3) {
			display: none;
		}
		.ft {
			flex-wrap: wrap;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sx :global(*) {
			animation: none !important;
		}
	}
</style>
