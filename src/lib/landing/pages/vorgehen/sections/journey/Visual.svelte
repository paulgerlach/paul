<!--
  The picture of one station of "Der ganze Weg" (the design's .jw-v and its
  eleven mock-ups, #jw-css). `on` is the design's `.in`: every mock-up's
  entrance is a CSS transition from its start state to `.in`, so the server
  renders `on` (the end state) and `Journey` turns it off while the card is
  out of view. Each time it comes back on, the counters run again (the
  takeover's three figures, the twin's flat count). Decorative: aria-hidden.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import building1 from "$lib/assets/landing/mietverwaltung/building-1.jpg?enhanced";
	import building2 from "$lib/assets/landing/mietverwaltung/building-2.jpg?enhanced";
	import building4 from "$lib/assets/landing/mietverwaltung/building-4.jpg?enhanced";
	import meterSpot from "$lib/assets/landing/vorgehen/photo-meter-spot.webp?enhanced";
	import newDevice from "$lib/assets/landing/vorgehen/photo-new-device.webp?enhanced";
	import { prefersReducedMotion, tweenNumber } from "$lib/landing/motion";
	import Icon from "../../components/Icon.svelte";
	import { journeyData as data, type StationVisual } from "../../content";
	import type { IconName } from "../../icons";

	let { visual, on }: { visual: StationVisual; on: boolean } = $props();

	const buildings = [building1, building2, building4];
	const flats = Array.from(
		{ length: data.twin.flats },
		(_, i) => `WE ${String(i + 1).padStart(2, "0")}`,
	);

	let takeover = $state(data.takeover.rows.map((r) => r.count));
	let installed = $state(data.twin.flats);
	/** Plain: only a return after a leave replays the counters. */
	let left = false;

	$effect(() => {
		if (!on) {
			left = true;
			takeover = data.takeover.rows.map(() => 0);
			installed = 0;
			return;
		}
		if (!left || prefersReducedMotion()) return;
		const timers: ReturnType<typeof setTimeout>[] = [];
		const cancels: (() => void)[] = [];
		if (visual === "takeover")
			timers.push(
				setTimeout(() => {
					data.takeover.rows.forEach((r, i) =>
						cancels.push(
							tweenNumber(
								0,
								r.count,
								900,
								(n) => (takeover[i] = Math.round(n)),
							),
						),
					);
				}, 300),
			);
		if (visual === "twin")
			timers.push(
				setTimeout(() => {
					const step = setInterval(() => {
						installed += 1;
						if (installed >= data.twin.flats) clearInterval(step);
					}, 180);
					cancels.push(() => clearInterval(step));
				}, 400),
			);
		return () => {
			timers.forEach(clearTimeout);
			cancels.forEach((c) => c());
		};
	});
</script>

{#snippet tick()}
	<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
		><path
			d="M1 5l3.5 3.5L11 1"
			stroke="#1E322D"
			stroke-width="2"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		/></svg
	>
{/snippet}

{#snippet head(icon: IconName, title: string, sub: string)}
	<div class="uh">
		<span class="ic"><Icon name={icon} /></span>
		<b>{title}</b>
		<small>{sub}</small>
	</div>
{/snippet}

{#snippet logo()}
	<svg viewBox="0 0 14 14" aria-hidden="true"
		><rect x="1" y="2" width="3" height="10" rx="1.5" fill="#fff" /><rect
			x="5.5"
			y="2"
			width="3"
			height="10"
			rx="1.5"
			fill="#fff"
		/><rect x="10" y="2" width="3" height="10" rx="1.5" fill="#fff" /></svg
	>
{/snippet}

<div class={["v", on && "in"]} aria-hidden="true">
	{#if visual === "portfolio"}
		<div class="ui">
			{@render head("search", data.portfolio.title, data.portfolio.sub)}
			{#each data.portfolio.rows as row, i (row.name)}
				<div class="jp-r" style:--i={i}>
					<Image src={buildings[i]} alt="" sizes="34px" />
					<span><b>{row.name}</b><small>{row.sub}</small></span>
					<em class="jp-sp"></em>
					<em class={["jp-b", row.kind]}>{row.step}</em>
				</div>
			{/each}
		</div>
	{:else if visual === "proxy"}
		<div class="paper">
			<b class="jv-vt">{data.proxy.title}</b>
			<i class="ln" style:--w="92%"></i>
			<i class="ln" style:--w="78%"></i>
			<i class="ln" style:--w="86%"></i>
			<i class="ln s" style:--w="54%"></i>
			<div class="jv-sig">
				<svg viewBox="0 0 160 40" aria-hidden="true"
					><path
						pathLength="1"
						d="M4 28c10-14 18-20 22-14s-6 16 2 14 14-22 22-20-4 22 6 18 12-14 18-12 2 10 10 8 16-10 24-8 14 6 22 2"
					/></svg
				>
				<small>{data.proxy.signature}</small>
			</div>
			<span class="jv-stamp">{@render tick()} {data.proxy.stamp}</span>
		</div>
	{:else if visual === "notice"}
		<div class="ui jk">
			{@render head("file", data.notice.title, data.notice.sub)}
			<ol>
				{#each data.notice.steps as step, i (step.title)}
					<li style:--i={i}>
						<span class="jk-d">{@render tick()}</span>
						<span><b>{step.title}</b><small>{step.sub}</small></span>
					</li>
				{/each}
			</ol>
		</div>
	{:else if visual === "takeover"}
		<div class="ui">
			{@render head("gauge", data.takeover.title, data.takeover.sub)}
			{#each data.takeover.rows as row, i (row.label)}
				<div class="jt-r" style:--i={i}>
					<span>{row.label}</span>
					<b>{takeover[i]}</b>
					<i class="jt-ok">{@render tick()}</i>
				</div>
			{/each}
			<div class="jt-f">
				<span class="jt-pill">{data.takeover.pills[0]}</span>
				<span class="jt-pill g">{data.takeover.pills[1]}</span>
			</div>
		</div>
	{:else if visual === "tenant"}
		<div class="jm">
			<div class="jm-ph">
				<div class="jm-st"><span>9:41</span><span>●●●</span></div>
				<div class="jm-n">
					<span class="jm-ic">{@render logo()}</span>
					<span
						><b>{data.tenant.title}</b><small>{data.tenant.when}</small></span
					>
					<em>{data.tenant.now}</em>
				</div>
				<div class="jm-b">
					<small>{data.tenant.flat}</small>
					<b>{data.tenant.h}</b>
					<p>{data.tenant.text}</p>
				</div>
			</div>
			<div class="jm-cal">
				<b>{data.tenant.figure}</b>
				<span>{data.tenant.figureText[0]}<br />{data.tenant.figureText[1]}</span
				>
			</div>
		</div>
	{:else if visual === "twin"}
		<div class="ui">
			{@render head("building", data.twin.title, data.twin.sub)}
			<div class="ji-g">
				{#each flats as flat, i (flat)}
					<span class="ji-u" style:--i={i}>{flat}</span>
				{/each}
			</div>
			<div class="ji-p">
				<span>{data.twin.progress}</span>
				<b>{installed} / {data.twin.flats} {data.twin.unit}</b>
			</div>
			<div class="ji-bar"><i></i></div>
		</div>
	{:else if visual === "photos"}
		<div class="jf">
			<figure class="jf-a">
				<Image src={meterSpot} alt="" sizes="220px" />
				<figcaption>{data.photos.before}</figcaption>
			</figure>
			<figure class="jf-b">
				<Image src={newDevice} alt="" sizes="220px" />
				<figcaption>{data.photos.after}</figcaption>
			</figure>
			<i class="jf-flash"></i>
			<span class="jf-chip"><i>{@render tick()}</i>{data.photos.chip}</span>
		</div>
	{:else if visual === "readings"}
		<div class="ui">
			{@render head("signal", data.readings.title, data.readings.sub)}
			{#each data.readings.rows as row, i (row.id)}
				<div class={["jd-r", !row.ok && "w"]} style:--i={i}>
					<span class="jd-id">{row.id}</span>
					<span>{row.room}</span>
					<b>{row.value}</b>
					<em>{row.ok ? data.readings.ok : data.readings.warn}</em>
				</div>
			{/each}
		</div>
	{:else if visual === "report"}
		<div class="ui">
			{@render head("chart", data.report.title, data.report.sub)}
			<div class="jr-b">
				{#each data.report.bars as h, i (i)}
					<i style:--h="{h}%" style:--i={i}></i>
				{/each}
			</div>
			<div class="jr-k">
				{#each data.report.kpis as kpi (kpi.label)}
					<span
						><small>{kpi.label}</small><b class={{ g: kpi.good }}>{kpi.value}</b
						></span
					>
				{/each}
			</div>
			<span class="jr-pdf"><Icon name="file" /> {data.report.pdf}</span>
		</div>
	{:else if visual === "uvi"}
		<div class="jm">
			<div class="jm-ph">
				<div class="jm-st"><span>9:41</span><span>●●●</span></div>
				<div class="ju-h">
					<small>{data.uvi.label}</small>
					<b>{data.uvi.value} <em>{data.uvi.unit}</em></b>
					<span class="ju-d">{data.uvi.tag}</span>
				</div>
				<div class="ju-b">
					{#each data.uvi.bars as h, i (i)}
						<i
							class={{ on: i === data.uvi.bars.length - 1 }}
							style:--h="{h}%"
							style:--i={i}
						></i>
					{/each}
				</div>
				<div class="ju-m">
					<span>{data.uvi.months[0]}</span><span>{data.uvi.months[1]}</span>
				</div>
			</div>
			<div class="jm-cal">
				<b>{data.uvi.figure}</b>
				<span>{data.uvi.figureText[0]}<br />{data.uvi.figureText[1]}</span>
			</div>
		</div>
	{:else if visual === "billing"}
		<div class="jh">
			<div class="jh-stack">
				<i></i><i></i><i></i>
				<div class="jh-doc">
					<b>{data.billing.title}</b>
					<small>{data.billing.sub}</small>
					<i class="ln" style:--w="88%"></i>
					<i class="ln" style:--w="70%"></i>
					<i class="ln" style:--w="80%"></i>
					<span class="jh-sum">{data.billing.sum}</span>
				</div>
			</div>
			<div class="jh-r">
				<span class="jh-btn"
					><i class="jh-prog"></i><span class="a">{data.billing.button[0]}</span
					><span class="b">{@render tick()} {data.billing.button[1]}</span
					></span
				>
				<small>{data.billing.note}</small>
			</div>
		</div>
	{/if}
</div>

<style>
	.v {
		position: relative;
		min-height: 340px;
		display: grid;
		place-items: center;
		padding: 28px;
		background: #eaefec;
		overflow: hidden;
	}

	/* Shared UI */
	.ui {
		width: 100%;
		max-width: 380px;
		background: #fff;
		border-radius: 16px;
		padding: 14px;
		box-shadow: 0 30px 60px -38px rgba(30, 50, 45, 0.5);
		font-size: 12px;
		color: var(--ink);
	}
	.uh {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0 10px;
		align-items: center;
		padding-bottom: 10px;
		border-bottom: 1px solid #eef1ef;
		margin-bottom: 6px;
	}
	.uh b {
		font-size: 13.5px;
		font-weight: 600;
	}
	.uh small {
		grid-column: 2;
		color: var(--muted);
		font-size: 11px;
	}
	.ic {
		grid-row: span 2;
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
	}
	.ic :global(svg) {
		width: 15px;
		height: 15px;
	}
	.paper {
		position: relative;
		width: 100%;
		max-width: 320px;
		background: #fff;
		border-radius: 10px;
		padding: 22px 22px 26px;
		box-shadow: 0 30px 60px -38px rgba(30, 50, 45, 0.5);
	}
	.ln {
		display: block;
		height: 6px;
		border-radius: 3px;
		background: #eef1ef;
		width: var(--w);
		margin-top: 9px;
	}
	.ln.s {
		margin-top: 14px;
	}

	/* 01 Portfolio */
	.jp-r {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) auto;
		gap: 10px;
		align-items: center;
		padding: 8px 0;
		border-bottom: 1px solid #f1f4f2;
	}
	.jp-r:last-child {
		border: 0;
	}
	.jp-r :global(img) {
		width: 34px;
		height: 34px;
		border-radius: 8px;
		object-fit: cover;
	}
	.jp-r b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.jp-r small {
		display: block;
		color: var(--muted);
		font-size: 11px;
	}
	.jp-sp,
	.jp-b {
		grid-column: 3;
		grid-row: 1;
		justify-self: end;
	}
	.jp-sp {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid #dce3df;
		border-top-color: #3e9a57;
		animation: jwspin 0.8s linear infinite;
	}
	@keyframes jwspin {
		to {
			transform: rotate(360deg);
		}
	}
	.jp-b {
		font-style: normal;
		font-size: 10.5px;
		font-weight: 700;
		border-radius: 999px;
		padding: 4px 9px;
		opacity: 0;
		transform: scale(0.85);
	}
	.jp-b.take {
		background: var(--ink);
		color: #fff;
	}
	.jp-b.cancel {
		background: #fbefdf;
		color: #8a5410;
	}
	.jp-b.bill {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.in .jp-sp {
		opacity: 0;
		transition: opacity 0.2s calc(0.8s + var(--i) * 0.55s);
	}
	.in .jp-b {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.35s calc(0.85s + var(--i) * 0.55s),
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1)
				calc(0.85s + var(--i) * 0.55s);
	}

	/* 02 Vollmacht */
	.jv-vt {
		display: block;
		font-size: 13px;
		font-weight: 600;
		margin-bottom: 6px;
	}
	.jv-sig {
		margin-top: 22px;
		width: 62%;
		border-bottom: 1.5px solid var(--ink);
	}
	.jv-sig svg {
		display: block;
		width: 100%;
		height: 34px;
	}
	.jv-sig path {
		fill: none;
		stroke: #2b4a8c;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
	}
	.jv-sig small {
		display: block;
		font-size: 10px;
		color: var(--faint);
		margin-top: 4px;
		transform: translateY(16px);
	}
	.in .jv-sig path {
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 1.5s cubic-bezier(0.45, 0.1, 0.55, 0.9) 0.5s;
	}
	.jv-stamp {
		position: absolute;
		right: 18px;
		bottom: 22px;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: #e6f5e7;
		color: #2f7a3c;
		font-size: 11.5px;
		font-weight: 700;
		border-radius: 999px;
		padding: 5px 11px 5px 7px;
		opacity: 0;
		transform: scale(0.7) rotate(-6deg);
	}
	.jv-stamp :global(svg) {
		width: 12px;
		height: 12px;
	}
	.in .jv-stamp {
		opacity: 1;
		transform: rotate(-4deg);
		transition:
			opacity 0.3s 2.1s,
			transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) 2.1s;
	}

	/* 03 Kündigung */
	.jk ol {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		position: relative;
	}
	.jk ol::before {
		content: "";
		position: absolute;
		left: 11px;
		top: 14px;
		bottom: 14px;
		width: 2px;
		background: #eef1ef;
	}
	.jk li {
		position: relative;
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 12px;
		padding: 9px 0;
		opacity: 0.35;
	}
	.jk li b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.jk li small {
		display: block;
		color: var(--muted);
		font-size: 11px;
	}
	.jk-d {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid #dce3df;
		display: grid;
		place-items: center;
		color: transparent;
		position: relative;
		z-index: 1;
	}
	.jk-d :global(svg) {
		width: 12px;
		height: 12px;
	}
	.in .jk li {
		opacity: 1;
		transition: opacity 0.4s calc(0.4s + var(--i) * 0.7s);
	}
	.in .jk-d {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--ink);
		transition:
			background 0.3s calc(0.5s + var(--i) * 0.7s),
			border-color 0.3s calc(0.5s + var(--i) * 0.7s),
			color 0.3s calc(0.5s + var(--i) * 0.7s);
	}

	/* 04 Übernahme */
	.jt-r {
		display: grid;
		grid-template-columns: 1fr auto 20px;
		gap: 10px;
		align-items: center;
		padding: 10px 2px;
		border-bottom: 1px solid #f1f4f2;
		font-size: 12.5px;
	}
	.jt-r b {
		font-size: 16px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.jt-ok {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		display: grid;
		place-items: center;
		transform: scale(0);
	}
	.jt-ok :global(svg) {
		width: 11px;
		height: 11px;
	}
	.in .jt-ok {
		transform: none;
		transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1)
			calc(1.3s + var(--i) * 0.2s);
	}
	.jt-f {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 12px;
		opacity: 0;
		transform: translateY(6px);
	}
	.in .jt-f {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.4s 2s,
			transform 0.4s 2s;
	}
	.jt-pill {
		font-size: 11px;
		font-weight: 600;
		border-radius: 999px;
		padding: 5px 10px;
		background: #f1f4f2;
	}
	.jt-pill.g {
		background: #e6f5e7;
		color: #2f7a3c;
	}

	/* 05 Mieter + 10 uVI (the phone) */
	.jm {
		position: relative;
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.jm-ph {
		width: 220px;
		height: 300px;
		background: #fff;
		border-radius: 30px;
		border: 8px solid #fff;
		box-shadow:
			0 30px 60px -36px rgba(30, 50, 45, 0.55),
			inset 0 0 0 1px #eef1ef;
		padding: 10px 12px;
		overflow: hidden;
		position: relative;
	}
	.jm-st {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		font-weight: 600;
		color: var(--muted);
	}
	.jm-n {
		display: grid;
		grid-template-columns: 28px 1fr auto;
		gap: 8px;
		align-items: center;
		background: #f3f5f4;
		border-radius: 14px;
		padding: 9px;
		margin-top: 12px;
		opacity: 0;
		transform: translateY(-18px);
	}
	.jm-ic {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--ink);
		display: grid;
		place-items: center;
	}
	.jm-ic :global(svg) {
		width: 14px;
		height: 14px;
	}
	.jm-n b {
		display: block;
		font-size: 11.5px;
		font-weight: 600;
		line-height: 1.25;
	}
	.jm-n small {
		display: block;
		font-size: 10px;
		color: var(--muted);
	}
	.jm-n em {
		font-style: normal;
		font-size: 9.5px;
		color: var(--faint);
		align-self: start;
	}
	.jm-b {
		margin-top: 14px;
		border-top: 1px solid #eef1ef;
		padding-top: 12px;
		opacity: 0;
	}
	.jm-b small {
		font-size: 10px;
		color: var(--muted);
	}
	.jm-b b {
		display: block;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.3;
		margin-top: 4px;
	}
	.jm-b p {
		font-size: 11px;
		color: var(--muted);
		line-height: 1.45;
		margin: 6px 0 0;
	}
	.in .jm-n {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.4s 0.5s,
			transform 0.55s cubic-bezier(0.2, 1.3, 0.4, 1) 0.5s;
	}
	.in .jm-b {
		opacity: 1;
		transition: opacity 0.5s 1.2s;
	}
	.jm-cal {
		background: #fff;
		border-radius: 16px;
		padding: 14px 16px;
		box-shadow: 0 20px 40px -26px rgba(30, 50, 45, 0.5);
		display: grid;
		gap: 2px;
		opacity: 0;
		transform: translateX(-8px);
	}
	.jm-cal b {
		font-family: var(--mono);
		font-size: 30px;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.jm-cal span {
		font-size: 11.5px;
		color: var(--muted);
		line-height: 1.35;
	}
	.in .jm-cal {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.4s 1.6s,
			transform 0.4s 1.6s;
	}

	/* 06 Installationstool */
	.ji-g {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
		margin-top: 8px;
	}
	.ji-u {
		border: 1px solid #e4eae6;
		border-radius: 8px;
		padding: 8px 0;
		text-align: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--muted);
		background: #fff;
	}
	.in .ji-u {
		background: #e6f5e7;
		border-color: #bfe3c2;
		color: #2f7a3c;
		transition:
			background 0.3s calc(0.4s + var(--i) * 0.18s),
			border-color 0.3s calc(0.4s + var(--i) * 0.18s),
			color 0.3s calc(0.4s + var(--i) * 0.18s);
	}
	.ji-p {
		display: flex;
		justify-content: space-between;
		margin-top: 12px;
		font-size: 11.5px;
		color: var(--muted);
	}
	.ji-p b {
		color: var(--ink);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.ji-bar {
		height: 5px;
		border-radius: 3px;
		background: #eef1ef;
		margin-top: 6px;
		overflow: hidden;
	}
	.ji-bar i {
		display: block;
		height: 100%;
		width: 0;
		background: #3e9a57;
	}
	.in .ji-bar i {
		width: 100%;
		transition: width 2.2s linear 0.4s;
	}

	/* 07 Fotos */
	.jf {
		position: relative;
		width: 100%;
		max-width: 380px;
		height: 260px;
	}
	.jf figure {
		position: absolute;
		margin: 0;
		width: 56%;
		background: #fff;
		padding: 8px 8px 10px;
		border-radius: 12px;
		box-shadow: 0 24px 50px -30px rgba(30, 50, 45, 0.55);
	}
	.jf :global(img) {
		display: block;
		width: 100%;
		aspect-ratio: 1/1;
		object-fit: cover;
		border-radius: 7px;
	}
	.jf figcaption {
		font-size: 11px;
		font-weight: 600;
		margin-top: 7px;
	}
	.jf-a {
		left: 0;
		top: 6px;
		transform: rotate(-4deg) translateY(10px);
		opacity: 0;
	}
	.jf-b {
		right: 0;
		top: 22px;
		transform: rotate(3deg) translateY(10px);
		opacity: 0;
	}
	.in .jf-a {
		opacity: 1;
		transform: rotate(-4deg);
		transition:
			opacity 0.35s 0.55s,
			transform 0.5s cubic-bezier(0.2, 1.2, 0.4, 1) 0.55s;
	}
	.in .jf-b {
		opacity: 1;
		transform: rotate(3deg);
		transition:
			opacity 0.35s 1.35s,
			transform 0.5s cubic-bezier(0.2, 1.2, 0.4, 1) 1.35s;
	}
	.jf-flash {
		position: absolute;
		inset: -28px;
		background: #fff;
		opacity: 0;
		pointer-events: none;
	}
	.in .jf-flash {
		animation: jwflash 1.6s 0.4s both;
	}
	@keyframes jwflash {
		0%,
		100% {
			opacity: 0;
		}
		5% {
			opacity: 0.85;
		}
		22% {
			opacity: 0;
		}
		50% {
			opacity: 0;
		}
		55% {
			opacity: 0.85;
		}
		72% {
			opacity: 0;
		}
	}
	.jf-chip {
		position: absolute;
		left: 50%;
		bottom: -26px;
		transform: translate(-50%, 8px);
		display: inline-flex;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
		background: var(--ink);
		color: #fff;
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 7px 14px 7px 8px;
		opacity: 0;
	}
	.jf-chip i {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--accent);
		color: var(--ink);
		display: grid;
		place-items: center;
	}
	.jf-chip :global(svg) {
		width: 10px;
		height: 10px;
	}
	.in .jf-chip {
		opacity: 1;
		transform: translate(-50%, 0);
		transition:
			opacity 0.4s 2.2s,
			transform 0.4s 2.2s;
	}

	/* 08 Daten */
	.jd-r {
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr) auto auto;
		gap: 10px;
		align-items: center;
		padding: 7px 2px;
		border-bottom: 1px solid #f1f4f2;
		opacity: 0;
		transform: translateX(-8px);
	}
	.jd-r:last-child {
		border: 0;
	}
	.jd-id {
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--muted);
	}
	.jd-r b {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.jd-r em {
		font-style: normal;
		font-size: 10px;
		font-weight: 700;
		border-radius: 999px;
		padding: 3px 8px;
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.jd-r.w em {
		background: #fbefdf;
		color: #8a5410;
	}
	.jd-r.w {
		border-radius: 8px;
	}
	.in .jd-r {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.35s calc(0.3s + var(--i) * 0.32s),
			transform 0.35s calc(0.3s + var(--i) * 0.32s);
	}
	.in .jd-r.w {
		background: #fff8ee;
		transition:
			opacity 0.35s calc(0.3s + var(--i) * 0.32s),
			transform 0.35s calc(0.3s + var(--i) * 0.32s),
			background 0.4s 2.2s;
	}

	/* 09 Report */
	.jr-b {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 110px;
		margin-top: 10px;
		padding-bottom: 2px;
		border-bottom: 1px solid #e4eae6;
	}
	.jr-b i {
		flex: 1;
		height: var(--h);
		background: #cfe9d1;
		border-radius: 4px 4px 1px 1px;
		transform: scaleY(0);
		transform-origin: bottom;
	}
	.jr-b i:last-child {
		background: var(--ink);
	}
	.in .jr-b i {
		transform: none;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)
			calc(0.3s + var(--i) * 0.07s);
	}
	.jr-k {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
		margin-top: 12px;
	}
	.jr-k small {
		display: block;
		font-size: 10px;
		color: var(--muted);
	}
	.jr-k b {
		font-size: 16px;
		font-weight: 600;
	}
	.jr-k b.g {
		color: #2f7a3c;
	}
	.jr-pdf {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		margin-top: 12px;
		font-size: 11.5px;
		font-weight: 600;
		background: #f1f4f2;
		border-radius: 999px;
		padding: 5px 11px;
		opacity: 0;
		transform: translateY(6px);
	}
	.jr-pdf :global(svg) {
		width: 13px;
		height: 13px;
	}
	.in .jr-pdf {
		opacity: 1;
		transform: none;
		transition:
			opacity 0.4s 1.5s,
			transform 0.4s 1.5s;
	}

	/* 10 uVI */
	.ju-h {
		margin-top: 16px;
	}
	.ju-h small {
		font-size: 10.5px;
		color: var(--muted);
	}
	.ju-h b {
		display: block;
		font-size: 26px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-top: 2px;
	}
	.ju-h b em {
		font-style: normal;
		font-size: 12px;
		font-weight: 500;
		color: var(--muted);
	}
	.ju-d {
		display: inline-block;
		margin-top: 6px;
		font-size: 10px;
		font-weight: 600;
		background: #e6f5e7;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 2px 8px;
	}
	.ju-b {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 110px;
		margin-top: 18px;
	}
	.ju-b i {
		flex: 1;
		height: var(--h);
		background: #e4eae6;
		border-radius: 3px 3px 1px 1px;
		transform: scaleY(0);
		transform-origin: bottom;
	}
	.ju-b i.on {
		background: var(--ink);
	}
	.in .ju-b i {
		transform: none;
		transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1)
			calc(0.5s + var(--i) * 0.06s);
	}
	.ju-m {
		display: flex;
		justify-content: space-between;
		font-size: 9.5px;
		color: var(--faint);
		margin-top: 4px;
	}

	/* 11 HKA */
	.jh {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 18px;
		width: 100%;
	}
	.jh-stack {
		position: relative;
		width: 200px;
		height: 170px;
	}
	.jh-stack > i {
		position: absolute;
		inset: 0;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 14px 30px -22px rgba(30, 50, 45, 0.5);
	}
	.jh-doc {
		position: absolute;
		inset: 0;
		background: #fff;
		border-radius: 10px;
		padding: 16px;
		box-shadow: 0 24px 50px -30px rgba(30, 50, 45, 0.55);
	}
	.jh-doc b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.jh-doc small {
		font-size: 10.5px;
		color: var(--muted);
	}
	.jh-sum {
		position: absolute;
		left: 16px;
		right: 16px;
		bottom: 14px;
		background: #5e8a6a;
		color: #fff;
		border-radius: 6px;
		padding: 6px 10px;
		font-size: 10.5px;
		font-weight: 600;
	}
	.in .jh-stack > i:nth-child(1) {
		transform: translate(-26px, 8px) rotate(-8deg);
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 2.3s;
	}
	.in .jh-stack > i:nth-child(2) {
		transform: translate(26px, 8px) rotate(8deg);
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 2.35s;
	}
	.in .jh-stack > i:nth-child(3) {
		transform: translate(0, 12px) rotate(2deg);
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 2.4s;
	}
	.jh-r {
		display: grid;
		justify-items: center;
		gap: 8px;
	}
	.jh-r small {
		font-size: 11px;
		color: var(--muted);
		opacity: 0;
	}
	.in .jh-r small {
		opacity: 1;
		transition: opacity 0.4s 2.5s;
	}
	.jh-btn {
		position: relative;
		overflow: hidden;
		display: grid;
		place-items: center;
		min-width: 250px;
		background: var(--ink);
		color: #fff;
		border-radius: 11px;
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
	}
	.jh-btn > span {
		grid-area: 1/1;
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}
	.jh-btn :global(svg) {
		width: 13px;
		height: 13px;
	}
	.jh-btn .b {
		opacity: 0;
	}
	.jh-prog {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 0;
		background: rgba(138, 214, 143, 0.3);
	}
	.in .jh-btn {
		animation: jwpress 0.3s 0.7s both;
		background: var(--accent);
		color: var(--ink);
		transition:
			background 0.3s 2.1s,
			color 0.3s 2.1s;
	}
	@keyframes jwpress {
		50% {
			transform: scale(0.95);
		}
	}
	.in .jh-btn .a {
		opacity: 0;
		transition: opacity 0.2s 2.1s;
	}
	.in .jh-btn .b {
		opacity: 1;
		transition: opacity 0.3s 2.2s;
	}
	.in .jh-prog {
		width: 100%;
		opacity: 0;
		transition:
			width 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.9s,
			opacity 0.2s 2.1s;
	}

	@media (max-width: 1100px) {
		.v {
			min-height: 320px;
		}
	}
	@media (max-width: 640px) {
		.v {
			padding: 22px 16px;
			min-height: 300px;
		}
		.jm-cal {
			display: none;
		}
		.jd-r {
			grid-template-columns: 58px minmax(0, 1fr) auto;
		}
		.jd-r b {
			display: none;
		}
		.jf {
			height: 240px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.v * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
