<!--
  "Heidi liest alle Zähler aus.": the big card with the meter list, two cards
  (Stichtag values, the sync to the ERP) and "In drei Schritten". The mocks
  are illustrations (`aria-hidden`). The meter rows and the progress bar
  animate once in view; without JS or with reduced motion they show their end
  state.
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import HeidiMark from "$lib/landing/components/icons/HeidiMark.svelte";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { allMeters as t } from "../content";

	let armed = $state(false);
	let bigIn = $state(false);
	let stepsIn = $state([false, false, false]);

	/** Arms the entrance and calls `onShow` once the element is in view. */
	const showOnce =
		(onShow: () => void): Attachment<HTMLElement> =>
		(el) => {
			armed = !prefersReducedMotion();
			return inView({ threshold: 0.15, once: true, onEnter: onShow })(el);
		};
</script>

<section class="sec kx" aria-labelledby="kx-h">
	<div class="wrap">
		<article
			class={["big rv", armed && "armed", bigIn && "in"]}
			{@attach showOnce(() => (bigIn = true))}
		>
			<div class="mock" aria-hidden="true">
				<div class="mh">
					<b>{t.big.building}</b><span class="ok"><i></i>{t.big.status}</span>
				</div>
				<div class="ml">
					{#each t.big.meters as meter (meter.title)}
						<div>
							<span class="ic"><Icon name={meter.icon} /></span>
							<span><b>{meter.title}</b><small>{meter.count}</small></span>
							<em>{t.big.done}</em>
						</div>
					{/each}
				</div>
				<span class="tag">{t.big.tag}</span>
			</div>
			<div class="txt">
				<SectionHead id="kx-h" eyebrow={t.big.pill} heading={t.big.h2}>
					{#snippet icon()}
						<path
							d="M3 8a10 10 0 0 1 14 0M5.5 10.8a6.5 6.5 0 0 1 9 0M8 13.6a3 3 0 0 1 4 0"
						/><circle cx="10" cy="16" r=".8" fill="currentColor" />
					{/snippet}
				</SectionHead>
				<p>{t.big.text}</p>
			</div>
		</article>

		<div class="two">
			<article class="card rv">
				<h3>{t.reading.title}</h3>
				<p>{t.reading.text}</p>
				<div class="mini" aria-hidden="true">
					{#each t.reading.rows as row (row.title)}
						<div class="mr">
							<span class="d">{row.date}</span>
							<span><b>{row.title}</b><small>{row.sub}</small></span>
							<em>{row.value}</em>
						</div>
					{/each}
				</div>
			</article>
			<article class="card rv">
				<h3>{t.sync.title}</h3>
				<p>{t.sync.text}</p>
				<div class="mini" aria-hidden="true">
					<div class="sync">
						<span class="lg"><HeidiMark /></span><span class="line"
							><i></i></span
						><span class="lg y"><Icon name="server" /></span>
					</div>
					<div class="mr s">
						<span><b>{t.sync.done}</b><small>{t.sync.sub}</small></span>
						<em class="okc"><Check /></em>
					</div>
				</div>
			</article>
		</div>

		<div class="head c steps-head">
			<SectionHead
				id="kx-steps-h"
				eyebrow={t.steps.pill}
				heading={t.steps.h2}
				center
			>
				{#snippet icon()}
					<path
						d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
					/>
				{/snippet}
			</SectionHead>
		</div>
		<div class="three" role="group" aria-labelledby="kx-steps-h">
			{#each [t.steps.ready, t.steps.create, t.steps.send] as step, i (step.title)}
				<figure
					class={["rv", armed && "armed", stepsIn[i] && "in"]}
					{@attach showOnce(() => (stepsIn[i] = true))}
				>
					<div class="c3">
						{#if i === 0}
							<div class="mini" aria-hidden="true">
								<div class="pl">
									<b>{t.steps.ready.label}</b><em>{t.steps.ready.value}</em>
								</div>
								<div class="pbar"><i></i></div>
								<small class="mut">{t.steps.ready.sub}</small>
							</div>
						{:else if i === 1}
							<div class="mini center" aria-hidden="true">
								<span class="btn"
									><Icon name="sparkle" />{t.steps.create.button}</span
								>
								<span class="cur">
									<svg
										viewBox="0 0 24 24"
										fill="#1E322D"
										stroke="#fff"
										stroke-width="1.4"
										stroke-linejoin="round"
										><path d="M5 3l14 7.5-6.2 1.6L10 18.5z" /></svg
									>
								</span>
							</div>
						{:else}
							<div class="mini" aria-hidden="true">
								{#each t.steps.send.rows as flat (flat)}
									<div class="mr s">
										<span><b>{flat}</b><small>{t.steps.send.sub}</small></span>
										<em class="pdf">PDF</em>
									</div>
								{/each}
							</div>
						{/if}
					</div>
					<figcaption><b>{step.title}</b>{step.text}</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		--card: #f3f4f2;
	}
	.big {
		display: grid;
		grid-template-columns: 1.1fr 1fr;
		gap: 56px;
		align-items: center;
		background: var(--card);
		border-radius: 28px;
		padding: 56px;
	}
	.txt :global(h2) {
		margin-top: 16px;
	}
	.txt p {
		font-size: 17px;
		line-height: 1.6;
		color: var(--muted);
		margin: 18px 0 0;
		max-width: 46ch;
	}
	.mock {
		position: relative;
		background: #fff;
		border-radius: 18px;
		box-shadow: 0 24px 50px -34px rgba(30, 50, 45, 0.35);
		padding: 8px 0 10px;
	}
	.mh {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 20px 12px;
		border-bottom: 1px solid #eff2f0;
	}
	.mh b {
		font-size: 15px;
		font-weight: 600;
	}
	.ok {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 12px;
		font-weight: 600;
		color: var(--ok);
		background: #e6f5e7;
		border-radius: 999px;
		padding: 4px 10px;
	}
	.ok i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--ok);
	}
	.ml > div {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 13px 20px;
		border-bottom: 1px solid #f1f3f2;
		transition:
			opacity 0.5s,
			transform 0.5s;
	}
	.ml > div:last-child {
		border-bottom: 0;
	}
	.armed:not(.in) .ml > div {
		opacity: 0;
		transform: translateX(-8px);
	}
	.in .ml > div:nth-child(2) {
		transition-delay: 0.15s;
	}
	.in .ml > div:nth-child(3) {
		transition-delay: 0.3s;
	}
	.in .ml > div:nth-child(4) {
		transition-delay: 0.45s;
	}
	.ic {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: #f1f3f2;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 17px;
		height: 17px;
	}
	.ml b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.ml small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.ml em {
		margin-left: auto;
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
		color: var(--ok);
	}
	.tag {
		position: absolute;
		right: 14px;
		bottom: -30px;
		font-size: 11.5px;
		color: var(--faint);
	}
	.two {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-top: 20px;
	}
	.card {
		background: var(--card);
		border-radius: 24px;
		padding: 40px 40px 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.card h3 {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin: 0;
	}
	.card p {
		font-size: 15.5px;
		line-height: 1.6;
		color: var(--muted);
		margin: 10px 0 28px;
		max-width: 42ch;
	}
	.mini {
		background: #fff;
		border-radius: 16px;
		padding: 18px;
		box-shadow: 0 18px 40px -32px rgba(30, 50, 45, 0.4);
	}
	.card .mini {
		margin-top: auto;
		border-radius: 16px 16px 0 0;
		padding-bottom: 22px;
	}
	.mr {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 0;
		border-bottom: 1px solid #f1f3f2;
	}
	.mr:last-child {
		border-bottom: 0;
	}
	.mr b {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
	}
	.mr small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.mr em {
		margin-left: auto;
		font-style: normal;
		font-size: 13.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.mr em.okc {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--accent);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.mr em.okc :global(svg) {
		width: 13px;
		height: 13px;
	}
	.mr em.pdf {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		background: #eef8ef;
		border: 1px solid #cfebd1;
		border-radius: 6px;
		padding: 3px 7px;
	}
	.d {
		font-size: 11.5px;
		font-weight: 700;
		background: #f1f3f2;
		border-radius: 8px;
		padding: 6px 8px;
		font-variant-numeric: tabular-nums;
	}
	.sync {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 6px 0 14px;
	}
	.lg {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: var(--ink);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		flex: none;
	}
	.lg :global(svg) {
		width: 20px;
		height: 20px;
	}
	.lg.y {
		background: #f1f3f2;
		color: var(--ink);
	}
	.line {
		flex: 1;
		height: 2px;
		background: #e5eae7;
		position: relative;
		overflow: hidden;
		border-radius: 2px;
	}
	.line i {
		position: absolute;
		top: 0;
		left: -30%;
		width: 30%;
		height: 100%;
		background: var(--accent-deep);
		animation: kx-run 2.4s ease-in-out infinite;
	}
	@keyframes kx-run {
		to {
			left: 100%;
		}
	}
	.head {
		max-width: 760px;
	}
	.head.c {
		margin-inline: auto;
		text-align: center;
	}
	.steps-head {
		margin-top: 120px;
	}
	.three {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
		margin-top: 48px;
	}
	figure {
		margin: 0;
	}
	.c3 {
		background: var(--card);
		border-radius: 24px;
		aspect-ratio: 4/3;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 28px;
	}
	.c3 .mini {
		width: 100%;
		max-width: 290px;
	}
	.mini.center {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 120px;
		position: relative;
	}
	.pl {
		display: flex;
		justify-content: space-between;
		font-size: 14px;
	}
	.pl b {
		font-weight: 600;
	}
	.pl em {
		font-style: normal;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.pbar {
		height: 6px;
		border-radius: 999px;
		background: #e5eae7;
		margin: 12px 0 10px;
		overflow: hidden;
	}
	.pbar i {
		display: block;
		height: 100%;
		width: 100%;
		background: var(--accent-deep);
		border-radius: 999px;
		transition: width 1.6s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s;
	}
	.armed:not(.in) .pbar i {
		width: 0;
	}
	.mut {
		font-size: 12px;
		color: var(--muted);
	}
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--ink);
		color: #fff;
		font-size: 14px;
		font-weight: 600;
		border-radius: 999px;
		padding: 11px 18px;
	}
	.btn :global(svg) {
		width: 16px;
		height: 16px;
	}
	.cur {
		position: absolute;
		right: 22%;
		bottom: 10px;
		width: 26px;
		height: 26px;
		animation: kx-tap 2.6s ease-in-out infinite;
	}
	.cur svg {
		width: 26px;
		height: 26px;
	}
	@keyframes kx-tap {
		0%,
		100% {
			transform: translate(10px, 10px);
		}
		40%,
		60% {
			transform: translate(0, 0);
		}
		50% {
			transform: translate(0, 0) scale(0.88);
		}
	}
	figcaption {
		text-align: center;
		font-size: 15px;
		line-height: 1.55;
		color: var(--muted);
		margin: 20px auto 0;
		max-width: 32ch;
	}
	figcaption b {
		display: block;
		font-size: 17px;
		font-weight: 600;
		color: var(--ink);
		margin-bottom: 4px;
	}

	@media (max-width: 1040px) {
		.big {
			grid-template-columns: 1fr;
			gap: 36px;
			padding: 40px;
		}
		.txt {
			order: -1;
		}
		.three {
			grid-template-columns: 1fr;
			max-width: 460px;
			margin-left: auto;
			margin-right: auto;
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
		.big {
			padding: 26px 20px;
			border-radius: 22px;
		}
		.two {
			grid-template-columns: 1fr;
		}
		.card {
			padding: 28px 22px 0;
		}
		.steps-head {
			margin-top: 80px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.line i,
		.cur {
			animation: none;
		}
	}
</style>
