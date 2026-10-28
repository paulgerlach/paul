<!--
  The paywall (#pw-js): a modal dialog with the checked values and the
  points, blurred under the glass card "Vollständige Auswertung
  freischalten" until unlocked. There's no payment page (`PAY_HREF`), so
  for own values the button says it's being set up and is disabled; the
  example unlocks for free, with confetti. ×, the backdrop and Escape close
  it; the browser returns the focus to the opener.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import { confettiFrom } from "$lib/landing/sections/sg/confetti";
	import Icon from "../components/Icon.svelte";
	import { getBillCheck } from "../check.svelte";
	import { PAY_HREF, paywall } from "../content";
	import { paywallRows } from "../rules";
	import Points from "./Points.svelte";

	const check = getBillCheck();
	const t = paywall;

	let dialog: HTMLDialogElement | undefined = $state();
	let points: HTMLElement | undefined = $state();
	let demoButton: HTMLButtonElement | undefined = $state();
	let payLink: HTMLElement | undefined = $state();
	let waiting = $state(false);
	let stopConfetti: (() => void) | undefined;

	const rows = $derived(
		check.result ? paywallRows(check.values, check.result.points) : [],
	);
	const image = $derived(check.files.find((f) => f.url)?.url);

	// Opening is a side effect of the state the teaser's button sets.
	$effect(() => {
		if (!check.dialogOpen || !dialog || dialog.open) return;
		waiting = false;
		dialog.showModal();
		document.documentElement.style.overflow = "hidden";
		const timer = setTimeout(
			() => (check.demo ? demoButton : payLink)?.focus({ preventScroll: true }),
			50,
		);
		return () => clearTimeout(timer);
	});

	$effect(() => () => {
		stopConfetti?.();
		document.documentElement.style.overflow = "";
	});

	function onclose() {
		check.dialogOpen = false;
		document.documentElement.style.overflow = "";
	}

	function unlock() {
		check.unlock();
		if (points) stopConfetti = confettiFrom(points);
	}
</script>

<dialog
	class={["pw", !check.unlocked && "locked"]}
	bind:this={dialog}
	aria-labelledby="pw-h"
	{onclose}
>
	<!-- The backdrop closes the dialog; Escape and × do the same by keyboard. -->
	<div class="bg" aria-hidden="true" onclick={() => dialog?.close()}></div>
	<div class="box">
		<button
			type="button"
			class="x"
			aria-label={t.close}
			onclick={() => dialog?.close()}>×</button
		>
		<div class="top">
			<span class="pill">{t.pill}</span><b id="pw-h">{t.title}</b>
		</div>
		{#if check.result}
			<div class="pw-grid" inert={!check.unlocked}>
				<div class="doc">
					<div class="dh">
						<span><b>{t.doc.title}</b><br /><small>{t.doc.sub}</small></span
						><small>{check.demo ? t.doc.example : ""}</small>
					</div>
					{#each rows as row (row.label)}
						<div class={["dr", row.bad && "bad"]}>
							<span>{row.label}</span><b>{row.value}</b>
						</div>
					{/each}
					{#if image}<img src={image} alt={t.doc.imageAlt} />{/if}
				</div>
				<div class="res" bind:this={points}>
					<div class="rh">
						<b>{t.points}</b><span>{t.count(check.result.points.length)}</span>
					</div>
					<Points
						points={check.result.points}
						hasHeating={check.result.hasHeating}
						full
					/>
				</div>
			</div>
		{/if}
		<div class="glass" inert={check.unlocked}>
			<div class="card">
				<span class="lock"><Icon name="lock" /></span>
				<h3>{t.lock.title}</h3>
				<p>{t.lock.text}</p>
				<ul class="inc">
					{#each t.lock.includes as item (item)}
						<li><Check />{item}</li>
					{/each}
				</ul>
				<div class="price">
					<b>{t.lock.price}</b><small>{t.lock.priceNote}</small>
				</div>
				{#if check.demo}
					<button
						type="button"
						class="demo"
						bind:this={demoButton}
						onclick={unlock}>{t.lock.example}</button
					>
				{:else if PAY_HREF}
					<a
						class="pay"
						href={PAY_HREF}
						target="_blank"
						rel="noopener"
						bind:this={payLink}
						onclick={() => (waiting = true)}
						>{t.lock.pay} <span class="ar">→</span></a
					>
				{:else}
					<button type="button" class="pay off" disabled bind:this={payLink}
						>{t.lock.payOff}</button
					>
				{/if}
				{#if waiting}<p class="wait">{t.lock.wait}</p>{/if}
				<small class="secure"><Icon name="lock" /> {t.lock.secure}</small>
			</div>
		</div>
	</div>
</dialog>

<style>
	/* .pw: the dialog itself is the full-screen layer. */
	.pw {
		position: fixed;
		inset: 0;
		z-index: 80;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
		margin: 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		padding: 16px;
		place-items: center;
		overflow: hidden;
	}
	.pw[open] {
		display: grid;
	}
	.pw::backdrop {
		background: transparent;
	}
	.bg {
		position: absolute;
		inset: 0;
		background: rgba(14, 24, 21, 0.55);
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
		animation: pwf 0.3s both;
	}
	@keyframes pwf {
		from {
			opacity: 0;
		}
	}
	.box {
		position: relative;
		width: min(1080px, 100%);
		max-height: calc(100vh - 32px);
		max-height: calc(100dvh - 32px);
		overflow: hidden;
		background: #f6f7f6;
		border-radius: 24px;
		box-shadow: 0 40px 100px -30px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		animation: pwu 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes pwu {
		from {
			opacity: 0;
			transform: translateY(18px) scale(0.98);
		}
	}
	.x {
		position: absolute;
		right: 14px;
		top: 12px;
		z-index: 5;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 0;
		background: #fff;
		font-size: 22px;
		line-height: 1;
		cursor: pointer;
		color: var(--ink);
		box-shadow: 0 2px 8px rgba(30, 50, 45, 0.15);
	}
	.top {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 18px 22px;
		border-bottom: 1px solid var(--hair);
		background: #fff;
	}
	.top b {
		font-size: 17px;
		font-weight: 600;
	}
	.pill {
		font-size: 11.5px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 10px;
	}
	.pw-grid {
		display: grid;
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
		gap: 18px;
		padding: 20px;
		/* A flex item doesn't shrink below its content without this, so the
		   grid would be cut off by the box instead of scrolling. */
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		transition: filter 0.5s;
	}
	/* Locked, the box is at least as tall as the card when the screen allows. */
	.locked .box {
		min-height: min(650px, calc(100vh - 32px));
		min-height: min(650px, calc(100dvh - 32px));
	}
	.locked .pw-grid {
		filter: blur(5px) saturate(0.9);
		pointer-events: none;
		user-select: none;
	}
	.doc {
		background: #fff;
		border-radius: 12px;
		padding: 18px;
		box-shadow: 0 20px 50px -30px rgba(30, 50, 45, 0.45);
		font-size: 12.5px;
		align-self: start;
	}
	.doc img {
		display: block;
		width: 100%;
		border-radius: 8px;
		margin-top: 12px;
		border: 1px solid var(--hair);
	}
	.dh {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		border-bottom: 1px solid var(--hair);
		padding-bottom: 10px;
	}
	.dh b {
		font-size: 14px;
	}
	.dh small {
		color: var(--muted);
	}
	.dr {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		padding: 8px;
		border-bottom: 1px solid #f1f4f2;
		border-radius: 8px;
	}
	.dr span {
		color: var(--muted);
	}
	.dr b {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.dr.bad {
		background: #fdf3ef;
		box-shadow: inset 3px 0 0 #b4461e;
	}
	.res {
		min-width: 0;
	}
	.rh {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 4px;
	}
	.rh b {
		font-size: 15px;
	}
	.rh span {
		font-size: 12.5px;
		color: var(--muted);
	}
	.glass {
		position: absolute;
		inset: 61px 0 0 0;
		display: grid;
		place-items: center;
		padding: 16px;
		/* The card scrolls when it's taller than the box; its auto margins
		   centre it otherwise and fall to 0 then, so its top stays reachable. */
		overflow-y: auto;
		overscroll-behavior: contain;
		background: rgba(246, 247, 246, 0.28);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		transition: opacity 0.4s;
	}
	.pw:not(.locked) .glass {
		opacity: 0;
		pointer-events: none;
	}
	.card {
		width: min(420px, 100%);
		margin: auto;
		background: rgba(255, 255, 255, 0.96);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px;
		box-shadow: 0 30px 70px -30px rgba(30, 50, 45, 0.5);
		text-align: center;
		animation: pwu 0.5s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.lock {
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: var(--ink);
		color: #8ad68f;
		display: inline-grid;
		place-items: center;
	}
	.lock :global(svg) {
		width: 20px;
		height: 20px;
	}
	.card h3 {
		font-size: 21px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin: 14px 0 0;
	}
	.card > p {
		color: var(--muted);
		font-size: 14.5px;
		margin: 6px 0 0;
	}
	.inc {
		list-style: none;
		margin: 16px 0 0;
		padding: 0;
		display: grid;
		gap: 8px;
		text-align: left;
	}
	.inc li {
		display: flex;
		gap: 9px;
		align-items: center;
		font-size: 14px;
	}
	.inc :global(svg) {
		width: 18px;
		height: 18px;
		padding: 4px;
		border-radius: 50%;
		background: #8ad68f;
		flex: none;
	}
	.price {
		display: flex;
		align-items: baseline;
		justify-content: center;
		gap: 8px;
		margin: 20px 0 14px;
		padding-top: 16px;
		border-top: 1px solid var(--hair);
	}
	.price b {
		font-size: 34px;
		font-weight: 600;
		letter-spacing: -0.03em;
	}
	.price small {
		font-size: 12.5px;
		color: var(--muted);
	}
	.pay,
	.demo {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		width: 100%;
		border: 0;
		border-radius: 13px;
		background: var(--ink);
		color: #fff;
		font: inherit;
		font-size: 15.5px;
		font-weight: 600;
		padding: 14px;
		cursor: pointer;
		text-decoration: none;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.pay:hover,
	.demo:hover {
		background: #2a443d;
	}
	.pay:active {
		transform: scale(0.98);
	}
	.pay.off {
		background: #c9d2ce;
		pointer-events: none;
	}
	.demo {
		background: #8ad68f;
		color: var(--ink);
		margin-top: 8px;
	}
	.demo:hover {
		background: #7ccb82;
	}
	.wait {
		font-size: 12.5px;
		color: var(--muted);
		margin: 10px 0 0;
	}
	.secure {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		font-size: 11.5px;
		color: var(--faint);
	}
	.secure :global(svg) {
		width: 12px;
		height: 12px;
	}
	@media (max-width: 820px) {
		.pill {
			display: none;
		}
		.top {
			padding-right: 60px;
		}
		.pw-grid {
			grid-template-columns: 1fr;
		}
		.box {
			max-height: calc(100vh - 16px);
			max-height: calc(100dvh - 16px);
		}
		.locked .box {
			min-height: min(650px, calc(100vh - 16px));
			min-height: min(650px, calc(100dvh - 16px));
		}
		.pw {
			padding: 8px;
		}
		.card {
			padding: 20px;
		}
		.price b {
			font-size: 28px;
		}
	}
</style>
