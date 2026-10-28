<!--
  "So rechnen wir ab" (#preise): the two contracts side by side, the device
  rental with the five device pictures (/geraete's) and the billing in the
  dark card.
-->
<script lang="ts">
	import gateway from "$lib/assets/landing/funkzaehler/gateway.webp?enhanced";
	import heizkostenverteiler from "$lib/assets/landing/funkzaehler/heizkostenverteiler.webp?enhanced";
	import kaltwasserzaehler from "$lib/assets/landing/funkzaehler/kaltwasserzaehler.webp?enhanced";
	import waermemengenzaehler from "$lib/assets/landing/funkzaehler/waermemengenzaehler.webp?enhanced";
	import warmwasserzaehler from "$lib/assets/landing/funkzaehler/warmwasserzaehler.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { Picture } from "vite-imagetools";
	import Icon from "../components/Icon.svelte";
	import { CONTRACTS_ID, contracts, type Device } from "../content";

	const PICTURES: Record<Device, Picture> = {
		heizkostenverteiler,
		kaltwasserzaehler,
		warmwasserzaehler,
		waermemengenzaehler,
		gateway,
	};

	const { rental, billing } = contracts;
</script>

<section class="pg-sec" id={CONTRACTS_ID} aria-labelledby="pr-ph">
	<div class="wrap">
		<div class="head">
			<span class="pill rv"><Icon name="list" />{contracts.pill}</span>
			<h2 class="h2 rv" id="pr-ph">
				{contracts.h2}<br /><span>{contracts.h2Accent}</span>
			</h2>
		</div>
		<div class="two">
			<article class="card rv">
				<div class="ch">
					<small>{rental.eyebrow}</small>
					<h3>{rental.title}</h3>
					<p>{rental.text}</p>
				</div>
				<ul class="dl">
					{#each rental.devices as device (device.key)}
						<li>
							<span class="di"
								><Image
									src={PICTURES[device.key]}
									alt=""
									width={30}
									height={30}
									sizes="30px"
								/>{device.name}</span
							>
						</li>
					{/each}
				</ul>
				<p class="fn">{rental.note}</p>
			</article>
			<article class="card ink rv">
				<div class="ch">
					<small>{billing.eyebrow}</small>
					<h3>{billing.title}</h3>
					<p>{billing.text}</p>
				</div>
				<div class="big"><b>{billing.big}</b><span>{billing.bigSub}</span></div>
				<ul class="inc">
					{#each billing.included as item (item)}
						<li><Icon name="check" />{item}</li>
					{/each}
				</ul>
				<p class="fn">
					{billing.note.before}<a href={billing.note.link.href}
						>{billing.note.link.text}</a
					>{billing.note.after}
				</p>
			</article>
		</div>
	</div>
</section>

<style>
	section {
		scroll-margin-top: 80px;
	}
	.head {
		max-width: 760px;
	}
	.two {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		gap: 18px;
		margin-top: 40px;
		align-items: stretch;
	}
	.card {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 28px;
		display: flex;
		flex-direction: column;
	}
	.card.ink {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.ch small {
		display: block;
		font-size: 12.5px;
		font-weight: 600;
		color: #2f7a3c;
	}
	.ink .ch small {
		color: #8ad68f;
	}
	/* `.ch h3`: beats the landing reset of heading margins. */
	.ch h3 {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin: 6px 0;
	}
	.ch p {
		margin: 0;
		font-size: 15px;
		color: var(--muted);
		line-height: 1.5;
	}
	.ink .ch p {
		color: rgba(255, 255, 255, 0.72);
	}
	.dl {
		list-style: none;
		margin: 18px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.dl li {
		background: #f7f9f8;
		border-radius: 12px;
		padding: 10px 12px;
		font-size: 14.5px;
	}
	.di {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-weight: 500;
	}
	.di :global(img) {
		width: 30px;
		height: 30px;
		object-fit: contain;
		background: #f4f6f5;
		border-radius: 8px;
		padding: 3px;
	}
	.fn {
		margin: 14px 0 0;
		font-size: 13px;
		color: var(--muted);
		line-height: 1.5;
	}
	.ink .fn {
		color: rgba(255, 255, 255, 0.62);
		margin-top: auto;
		padding-top: 18px;
	}
	.ink .fn a {
		color: #fff;
	}
	.big {
		margin: 22px 0 4px;
	}
	.big b {
		display: block;
		font-size: 40px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1;
		color: #8ad68f;
		font-variant-numeric: tabular-nums;
	}
	.big span {
		font-size: 14.5px;
		color: rgba(255, 255, 255, 0.72);
	}
	.inc {
		list-style: none;
		margin: 18px 0 0;
		padding: 0;
		display: grid;
		gap: 10px;
		font-size: 15px;
	}
	.inc li {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.inc :global(svg) {
		width: 18px;
		height: 18px;
		color: #8ad68f;
		flex: none;
		margin-top: 2px;
	}
	@media (max-width: 1040px) {
		.two {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}
	}
	@media (max-width: 560px) {
		.card {
			padding: 20px;
		}
		.dl {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
