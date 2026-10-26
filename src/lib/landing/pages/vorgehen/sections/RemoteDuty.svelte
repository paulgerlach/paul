<!--
  The remote-reading duty: a facade photo and a text card with the inset
  photo, the law, the day count to 1.1.2027 and the (not yet linked) guide.
  The count comes from the page's DeadlineClock; once the deadline has
  passed, it isn't shown and the texts switch to their expired versions.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import meters from "$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { daysUntilObligation } from "$lib/landing/deadline/deadline";
	import Head from "../components/Head.svelte";
	import { remoteDuty } from "../content";

	const clock = getDeadlineClock();
	const days = $derived(daysUntilObligation(clock.today));
</script>

<section class="blk" aria-labelledby="vg-duty-h">
	<div class="wrap">
		<Head
			id="vg-duty-h"
			eyebrow={remoteDuty.eyebrow}
			title={clock.expired ? remoteDuty.h2Expired : remoteDuty.h2}
		/>
		<div class="split">
			<figure class="photo rv">
				<Image src={facade} alt="" sizes="(max-width: 980px) 100vw, 640px" />
			</figure>
			<div class="card rv">
				<Image class="inset" src={meters} alt="" sizes="150px" />
				<div class="txt">
					<p>{remoteDuty.law}</p>
					<p>{clock.expired ? remoteDuty.textExpired : remoteDuty.text}</p>
					{#if days > 0}
						<p class="count">
							<b>{days}</b> <span>{remoteDuty.countLabel}</span>
						</p>
					{/if}
					{#if remoteDuty.link.href}
						<a class="link" href={remoteDuty.link.href}
							>{remoteDuty.link.text} <span aria-hidden="true">→</span></a
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.blk {
		padding-top: clamp(72px, 9vw, 128px);
	}
	.wrap {
		max-width: 1280px;
	}
	.split {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 16px;
		margin-top: 40px;
	}
	.photo {
		margin: 0;
		border-radius: 22px;
		overflow: hidden;
		min-height: 420px;
		background: var(--soft);
	}
	/* Inline in the flow, as in the design: the photo's ratio (and the line's
	   descender) set the row's height. */
	.photo :global(img) {
		display: inline;
		vertical-align: baseline;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.card {
		position: relative;
		background: var(--soft);
		border-radius: 22px;
		padding: clamp(28px, 4vw, 48px);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		min-height: 420px;
	}
	.card :global(.inset) {
		position: absolute;
		top: 24px;
		right: 24px;
		width: 150px;
		height: 100px;
		object-fit: cover;
		border-radius: 12px;
	}
	.txt {
		max-width: 46ch;
	}
	.txt p {
		font-size: 16.5px;
		line-height: 1.6;
	}
	.txt p + p {
		margin-top: 14px;
	}
	.count {
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		gap: 4px 10px;
		margin-top: 22px !important;
	}
	.count b {
		font-family: var(--mono);
		font-size: 44px;
		font-weight: 500;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		line-height: 1.5;
	}
	.count span {
		color: var(--muted);
		font-size: 15px;
	}
	.link {
		display: inline-flex;
		gap: 6px;
		margin-top: 22px;
		font-weight: 600;
		font-size: 15px;
	}
	.link span {
		transition: transform 0.2s;
	}
	.link:hover span {
		transform: translateX(3px);
	}
	@media (max-width: 980px) {
		.split {
			grid-template-columns: minmax(0, 1fr);
		}
		.photo,
		.card {
			min-height: 320px;
		}
	}
	@media (max-width: 560px) {
		.card {
			padding-top: 140px;
		}
		.card :global(.inset) {
			width: 110px;
			height: 74px;
		}
	}
</style>
