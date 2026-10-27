<!--
  "Mehr von Heidi" (.hk-two): two cards, the monthly consumption info (a
  phone with the month bars) and the handover to the management software (a
  window counting 48 statements across). Server-rendered finished; below the
  fold on load the bars grow and the handover runs once (2.6 s, statuses
  turning to "Übergeben", confetti at the end) when they scroll into view
  (`enterView`).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import Icon from "../components/Icon.svelte";
	import { more } from "../content";

	const { uvi, erp } = more;
	const win = erp.window;
	const RUN_MS = 2600;

	let grown = $state(true);
	let sent = $state(win.total);
	let barEl = $state<HTMLElement>();
	/** The bar's share, eased. */
	let share = $state(1);
	/** A handover is running or ran: rows pop as they turn "Übergeben". */
	let ran = $state(false);

	function transfer() {
		const timers: ReturnType<typeof setTimeout>[] = [];
		let frame = 0;
		timers.push(
			setTimeout(() => {
				const start = performance.now() + 500;
				const step = (now: number) => {
					const p = Math.max(0, Math.min(1, (now - start) / RUN_MS));
					const e = 1 - Math.pow(1 - p, 3);
					share = e;
					sent = Math.round(win.total * e);
					if (p < 1) frame = requestAnimationFrame(step);
					else
						timers.push(
							setTimeout(() => {
								if (barEl) confettiFrom(barEl);
							}, 250),
						);
				};
				frame = requestAnimationFrame(step);
			}, 300),
		);
		return () => {
			timers.forEach(clearTimeout);
			cancelAnimationFrame(frame);
		};
	}
</script>

<section class="pg-sec" aria-label={more.label}>
	<div class="wrap two">
		<article
			class={["rv", grown && "in"]}
			{@attach enterView({
				prepare: () => (grown = false),
				play: () => {
					grown = true;
				},
			})}
		>
			<h3>{uvi.h3}</h3>
			<p>{uvi.text}</p>
			<a class="hk-lk" href={uvi.link.href}
				>{uvi.link.text} <span class="ar" aria-hidden="true">→</span></a
			>
			<div class="v">
				<div class="hk-ph sm" aria-hidden="true">
					<i class="nt"></i>
					<div class="hk-pn">
						<span class="ic"><Icon name="flame" /></span>
						<span><b>{uvi.phone.title}</b><small>{uvi.phone.sub}</small></span>
					</div>
					<small class="hk-pl">{uvi.phone.label}</small>
					<b class="hk-pv">{uvi.phone.value}</b>
					<small class="hk-pl">{uvi.phone.compare}</small>
					<div class="mb">
						{#each uvi.phone.bars as h, i (i)}
							<i
								class={[i === uvi.phone.bars.length - 1 && "c"]}
								style:--h="{h}%"
							></i>
						{/each}
					</div>
				</div>
			</div>
		</article>

		<article class="rv">
			<h3>{erp.h3}</h3>
			<p>{erp.text}</p>
			<a class="hk-lk" href={erp.link.href}
				>{erp.link.text} <span class="ar" aria-hidden="true">→</span></a
			>
			<div class="v">
				<div
					class="win"
					aria-hidden="true"
					{@attach enterView({
						prepare: () => {
							sent = 0;
							share = 0;
							ran = true;
						},
						play: transfer,
					})}
				>
					<div class="wd"><i></i><i></i><i></i></div>
					<b class="wt">{win.title}</b>
					<div class="ws">
						<span><small>{win.created}</small><b>{win.total}</b></span>
						<span><small>{win.sent}</small><b>{sent}</b></span>
					</div>
					<div class="wbar" bind:this={barEl}>
						<i style:width="{share * 100}%"></i>
					</div>
					<div class="wr h">
						{#each win.head as h (h)}<span>{h}</span>{/each}
					</div>
					{#each win.rows as row (row.name)}
						{@const waiting = sent < row.at}
						<div class="wr">
							<span>{row.name}</span><span>{row.units}</span>
							{#key waiting}
								<span class={["st", waiting ? "wt" : ran && "pop"]}
									>{waiting ? win.busy : win.done}</span
								>
							{/key}
						</div>
					{/each}
				</div>
			</div>
		</article>
	</div>
</section>

<style>
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	article {
		position: relative;
		background: #efeeea;
		border-radius: 18px;
		padding: 36px 36px 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-height: 560px;
	}
	/* `article h3`: beats the landing reset of heading margins. */
	article h3 {
		font-size: clamp(22px, 2vw, 28px);
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin: 0;
		max-width: 20ch;
	}
	article p {
		color: var(--muted);
		font-size: 15.5px;
		line-height: 1.5;
		margin-top: 10px;
		max-width: 44ch;
	}
	.v {
		margin-top: auto;
		padding-top: 36px;
		display: flex;
		justify-content: center;
	}
	.mb {
		position: absolute;
		left: 18px;
		right: 18px;
		bottom: 0;
		height: 90px;
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}
	.mb i {
		flex: 1;
		height: 4%;
		background: #d7e3da;
		border-radius: 5px 5px 0 0;
		transition: height 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.mb i.c {
		background: var(--ok);
	}
	article.in .mb i {
		height: var(--h);
	}
	.win {
		width: calc(100% + 36px);
		margin-right: -72px;
		background: #fff;
		border: 1px solid #e2e2de;
		border-bottom: 0;
		border-radius: 12px 12px 0 0;
		padding: 0 0 20px;
		align-self: flex-end;
	}
	.wd {
		display: flex;
		gap: 6px;
		padding: 10px 12px;
		border-bottom: 1px solid #f0f0ee;
	}
	.wd i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #e2e2de;
	}
	.wt {
		display: block;
		font-size: 20px;
		font-weight: 500;
		padding: 22px 26px 0;
	}
	.ws {
		display: flex;
		gap: 40px;
		padding: 14px 26px 0;
	}
	.ws small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.ws b {
		font-size: 22px;
		font-weight: 500;
	}
	.wbar {
		margin: 14px 26px 0;
		height: 12px;
		border-radius: 3px;
		background: #eef1ef;
		overflow: hidden;
	}
	.wbar i {
		display: block;
		height: 100%;
		background: var(--ok);
	}
	.wr {
		display: grid;
		grid-template-columns: 1.4fr 0.8fr 0.9fr;
		gap: 10px;
		padding: 11px 26px;
		border-top: 1px solid #f0f0ee;
		font-size: 13px;
	}
	.wbar + .wr {
		margin-top: 16px;
	}
	.wr.h {
		font-size: 11.5px;
		color: var(--muted);
	}
	.st {
		justify-self: start;
		font-size: 11px;
		border: 1px solid #cfe3d3;
		color: #2f7a3c;
		border-radius: 5px;
		padding: 1px 6px;
		transition:
			background 0.3s,
			color 0.3s,
			border-color 0.3s;
	}
	.st.wt {
		border-color: #e2e2de;
		color: var(--muted);
	}
	.st.wt::before {
		content: "";
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: 5px;
		border: 1.5px solid #c9cfcc;
		border-top-color: var(--ok);
		border-radius: 50%;
		vertical-align: -1px;
		animation: hkspin 0.8s linear infinite;
	}
	.st.pop {
		animation: hkpop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	@keyframes hkspin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes hkpop {
		0% {
			transform: scale(0.8);
		}
		60% {
			transform: scale(1.08);
		}
		100% {
			transform: scale(1);
		}
	}
	@media (max-width: 900px) {
		.two {
			grid-template-columns: 1fr;
		}
		article {
			min-height: 0;
			padding: 24px 22px 0;
		}
		.win {
			margin-right: -44px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.st.wt::before,
		.st.pop {
			animation: none;
		}
	}
</style>
