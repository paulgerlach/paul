<!--
  "Abrechnung scannen. Fehler sehen." (.ms-sec, #pruefung): a sample bill
  and its findings. With motion, while in view (`loopInView`, every 10.4 s):
  the beam runs down the sheet for 5.2 s (ease-in-out, one animation frame
  loop), each marked row lights up with its number as the beam passes its
  middle, its finding slides in, the count and the bar follow; then the
  status and the footer. Server, no JS, reduced motion and every stop: the
  finished state.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Icon from "../components/Icon.svelte";
	import Head from "../components/Head.svelte";
	import { scan, SCAN_ID } from "../content";

	const DURATION = 5200;
	const total = scan.findings.length;
	const { bill } = scan;

	/** Rows marked so far (all of them when finished). */
	let marked = $state(total);
	let progress = $state(1);
	let beamY = $state(0);
	let beamOn = $state(false);
	let finished = $state(true);

	let sheet: HTMLElement | undefined = $state();
	const rows: HTMLElement[] = $state([]);

	function finish() {
		marked = total;
		progress = 1;
		beamOn = false;
		finished = true;
	}

	function run() {
		marked = 0;
		progress = 0;
		finished = false;
		beamY = 0;
		if (!sheet) return;
		const height = sheet.offsetHeight;
		const marks = rows.map((r) => r.offsetTop + r.offsetHeight / 2);
		beamOn = true;
		let start: number | null = null;
		let frame = requestAnimationFrame(function step(now) {
			start ??= now;
			const p = Math.min(1, (now - start) / DURATION);
			const e = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
			beamY = e * (height - 2);
			progress = p;
			while (marked < total && beamY >= marks[marked]) marked++;
			if (p < 1) frame = requestAnimationFrame(step);
			else {
				beamOn = false;
				finished = true;
			}
		});
		return () => {
			cancelAnimationFrame(frame);
			finish();
		};
	}

	const hit = (i: number) => i < marked;
</script>

<section class="pg-sec ms" id={SCAN_ID} aria-labelledby="ms-h">
	<div class="wrap">
		<Head
			id="ms-h"
			pill={scan.pill}
			symbol="search"
			heading={scan.h2}
			lead={scan.lead}
			wideLead
		/>
		<div
			class="ms-grid rv"
			role="group"
			aria-label={scan.label}
			{@attach loopInView({ run, every: DURATION * 2, threshold: 0.3 })}
		>
			<div class="doc-w">
				<article class="doc" aria-hidden="true" bind:this={sheet}>
					<header class="top">
						<div>
							<small>{bill.sender}</small>
							<b>{bill.name}</b>
							{#each bill.address as line (line)}<span>{line}</span>{/each}
						</div>
						<div class="ttl"><b>{bill.title}</b><span>{bill.number}</span></div>
					</header>
					<div class={["row", hit(0) && "hit"]} data-n="1" bind:this={rows[0]}>
						<span>{bill.period.label}</span><b>{bill.period.value}</b>
					</div>
					{#each bill.rows as row (row.label)}
						<div class="row"><span>{row.label}</span><b>{row.value}</b></div>
					{/each}
					<div class={["tbl", hit(1) && "hit"]} data-n="2" bind:this={rows[1]}>
						<div class="th">
							{#each bill.split.head as cell (cell)}<span>{cell}</span>{/each}
						</div>
						{#each bill.split.rows as cells (cells[0])}
							<div>
								{#each cells as cell (cell)}<span>{cell}</span>{/each}
							</div>
						{/each}
					</div>
					<div class={["row", hit(2) && "hit"]} data-n="3" bind:this={rows[2]}>
						<span>{bill.co2.label}</span><b class="nil">{bill.co2.value}</b>
					</div>
					<div
						class={["tbl", "warnrow", hit(3) && "hit"]}
						data-n="4"
						bind:this={rows[3]}
					>
						<div class="th">
							{#each bill.readings.head as cell (cell)}<span>{cell}</span
								>{/each}
						</div>
						{#each bill.readings.rows as cells (cells[0])}
							<div>
								{#each cells as cell, i (i)}<span>{cell}</span>{/each}
							</div>
						{/each}
					</div>
					<div class="sum">
						{#each bill.sum as line (line.label)}
							<div class={[line.total && "tot"]}>
								<span>{line.label}</span><b>{line.value}</b>
							</div>
						{/each}
					</div>
					<i
						class={["beam", beamOn && "on"]}
						style:transform="translateY({beamY}px)"
					></i>
				</article>
				<span class="note">{scan.note}</span>
			</div>
			<div class="res">
				<div class="rh">
					<span class="rhi"><Icon name="search" /></span>
					<span
						><b>{scan.result}</b><small
							>{finished ? scan.done(marked) : scan.reading}</small
						></span
					>
					<span class="cnt"><b>{marked}</b> {scan.found}</span>
				</div>
				<div class="bar"><i style:width="{progress * 100}%"></i></div>
				<ul class="list">
					{#each scan.findings as finding, i (finding.key)}
						<li class={["it", finding.tone, hit(i) && "in"]}>
							<span class="ic">{finding.tone === "bad" ? "!" : "?"}</span>
							<span class="tx"
								><b>{finding.title}</b><small>{finding.text}</small></span
							>
							<em>{finding.tag}</em>
						</li>
					{/each}
				</ul>
				<div class={["ft", finished && "in"]}>
					<span>{scan.footer}</span>
					<a class="bk-next" href={scan.cta.href}
						>{scan.cta.text} <span class="ar">→</span></a
					>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.ms-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		gap: 56px;
		align-items: center;
		margin-top: 56px;
	}
	.doc-w {
		position: relative;
		background: #f3f5f4;
		border-radius: 24px;
		padding: 40px 44px 46px;
	}
	.doc {
		position: relative;
		overflow: hidden;
		background: #fff;
		border-radius: 10px;
		box-shadow:
			0 40px 80px -40px rgba(30, 50, 45, 0.45),
			0 2px 6px rgba(30, 50, 45, 0.06);
		padding: 20px 22px 22px;
		font-size: 11px;
		line-height: 1.45;
		color: var(--ink);
	}
	.top {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid #e4eae6;
		margin-bottom: 6px;
	}
	.top small {
		display: block;
		font-size: 8.5px;
		color: var(--muted);
		margin-bottom: 6px;
	}
	.top b {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
	}
	.top span {
		display: block;
		color: var(--muted);
	}
	.ttl {
		text-align: right;
	}
	.ttl b {
		font-size: 14px;
	}
	.row,
	.tbl,
	.sum {
		position: relative;
		border-radius: 8px;
		transition:
			box-shadow 0.35s,
			background 0.35s;
	}
	.row {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		padding: 7px 8px;
		border-bottom: 1px solid #f0f3f1;
	}
	.row span {
		color: var(--muted);
	}
	.row b {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.row b.nil {
		color: var(--faint);
		font-weight: 500;
		font-style: italic;
	}
	.tbl {
		margin: 8px 0;
		padding: 4px 8px;
	}
	.tbl > div {
		display: grid;
		grid-template-columns: 1fr 70px 90px;
		gap: 8px;
		padding: 4px 0;
		font-variant-numeric: tabular-nums;
	}
	.tbl > div span:not(:first-child) {
		text-align: right;
	}
	.tbl > .th {
		font-weight: 600;
		border-bottom: 1px solid #e4eae6;
		font-size: 10px;
		color: var(--muted);
	}
	.sum {
		margin-top: 10px;
		background: #f3f5f4;
		padding: 8px 10px;
	}
	.sum > div {
		display: flex;
		justify-content: space-between;
		padding: 2px 0;
		font-variant-numeric: tabular-nums;
	}
	.sum span {
		color: var(--muted);
	}
	.sum > .tot {
		border-top: 1px solid #dce3df;
		margin-top: 4px;
		padding-top: 6px;
		font-size: 12.5px;
	}
	.sum > .tot span {
		color: var(--ink);
		font-weight: 600;
	}
	.hit {
		background: #fdf3ef;
		box-shadow: 0 0 0 2px #b4461e;
	}
	.warnrow.hit {
		background: #fbf6e6;
		box-shadow: 0 0 0 2px #a8862a;
	}
	.hit::after {
		content: attr(data-n);
		position: absolute;
		right: -6px;
		top: -8px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #b4461e;
		color: #fff;
		font-size: 10px;
		font-weight: 700;
		display: grid;
		place-items: center;
	}
	.warnrow.hit::after {
		background: #a8862a;
	}
	.beam {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		height: 2px;
		background: #8ad68f;
		box-shadow:
			0 0 0 1px rgba(138, 214, 143, 0.25),
			0 0 18px 4px rgba(138, 214, 143, 0.45);
		opacity: 0;
		pointer-events: none;
		will-change: transform;
	}
	.beam.on {
		opacity: 1;
	}
	.note {
		position: absolute;
		right: 22px;
		bottom: 14px;
		font-size: 11.5px;
		color: var(--faint);
	}
	.res {
		background: #fff;
		border: 1px solid var(--line);
		border-radius: 22px;
		padding: 22px;
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.35);
	}
	.rh {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.rhi {
		width: 38px;
		height: 38px;
		border-radius: 11px;
		background: #1e322d;
		color: #8ad68f;
		display: grid;
		place-items: center;
		flex: none;
	}
	.rhi :global(svg) {
		width: 17px;
		height: 17px;
	}
	.rh b {
		display: block;
		font-size: 15px;
		font-weight: 600;
	}
	.rh small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
	}
	.rh .cnt {
		margin-left: auto;
		display: flex;
		align-items: baseline;
		gap: 5px;
		font-size: 12.5px;
		color: var(--muted);
		white-space: nowrap;
	}
	.cnt b {
		font-size: 18px;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.bar {
		height: 4px;
		border-radius: 2px;
		background: #eef1ef;
		margin: 16px 0 8px;
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: #3e9a57;
		border-radius: 2px;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
		min-height: 316px;
		align-content: start;
	}
	.it {
		display: grid;
		grid-template-columns: 28px minmax(0, 1fr) auto;
		gap: 12px;
		align-items: center;
		padding: 12px;
		border: 1px solid #eef1ef;
		border-radius: 14px;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.45s,
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.it.in {
		opacity: 1;
		transform: none;
	}
	.ic {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		font-weight: 700;
		font-size: 13px;
		background: #fbe6da;
		color: #b4461e;
	}
	.warn .ic {
		background: #f7f0d9;
		color: #8a6a12;
	}
	.tx b {
		display: block;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.3;
	}
	.tx small {
		display: block;
		font-size: 12.5px;
		color: var(--muted);
		line-height: 1.4;
		margin-top: 2px;
	}
	.it em {
		font-style: normal;
		font-size: 11.5px;
		font-weight: 700;
		white-space: nowrap;
		border-radius: 999px;
		padding: 5px 10px;
		background: #1e322d;
		color: #fff;
	}
	.warn em {
		background: #f1f3f2;
		color: var(--ink);
	}
	.ft {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		flex-wrap: wrap;
		margin-top: 14px;
		padding-top: 14px;
		border-top: 1px solid #eef1ef;
		opacity: 0;
		transition: opacity 0.5s;
	}
	.ft.in {
		opacity: 1;
	}
	.ft span {
		font-size: 13px;
		color: var(--muted);
		max-width: 30ch;
	}
	@media (max-width: 1040px) {
		.ms-grid {
			grid-template-columns: 1fr;
			gap: 28px;
		}
		.doc-w {
			max-width: 620px;
			margin: 0 auto;
			width: 100%;
		}
		.list {
			min-height: 0;
		}
	}
	@media (max-width: 640px) {
		.doc-w {
			padding: 18px 14px 34px;
			border-radius: 18px;
		}
		.doc {
			padding: 14px;
			font-size: 10px;
		}
		.tbl > div {
			grid-template-columns: 1fr 56px 74px;
		}
		.top {
			grid-template-columns: 1fr;
		}
		.ttl {
			text-align: left;
			order: -1;
		}
		.res {
			padding: 16px;
		}
		.it {
			grid-template-columns: 24px minmax(0, 1fr);
		}
		.it em {
			grid-column: 2;
			justify-self: start;
		}
		.ic {
			width: 24px;
			height: 24px;
		}
	}
</style>
