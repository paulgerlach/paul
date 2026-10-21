<!--
  "So läuft die Demo ab" (.dm-flow): four numbered steps on a dashed line,
  each with a small decorative tile (the question, the bars, the contract
  ends, the offer) that animates on hover only. The tiles are `aria-hidden`;
  the step's title and text carry its meaning.
-->
<script lang="ts">
	import avatar from "$lib/assets/landing/region/avatar-2.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import Icon from "../components/Icon.svelte";
	import { flow } from "../content";
</script>

<section class="flow-sec" aria-labelledby="flow-h">
	<div class="wrap">
		<span class="pill rv"><Icon name="list" />{flow.pill}</span>
		<h2 class="h2 rv" id="flow-h">
			{flow.h2}<br /><span>{flow.h2Accent}</span>
		</h2>
		<ol class="flow">
			{#each flow.steps as step, i (step.title)}
				<li class="rv">
					<span class="fn" aria-hidden="true">{i + 1}</span>
					<div class="fv" aria-hidden="true">
						{#if i === 0}
							<div class="fq">
								<span class="fq-a"
									><Image
										src={avatar}
										alt=""
										width={30}
										height={30}
										sizes="30px"
									/></span
								>
								<p>{flow.question}</p>
							</div>
						{:else if i === 1}
							<div class="fdb">
								{#each flow.bars as h, b (b)}
									<i class={[b === flow.highlight && "hi"]} style:height="{h}%"
									></i>
								{/each}
							</div>
						{:else if i === 2}
							<div class="ftl">
								{#each flow.contracts as c (c.name)}
									<div>
										<b>{c.name}</b><span style:width="{c.width}%"></span>
									</div>
								{/each}
							</div>
						{:else}
							<div class="fnx">
								<span class="okb"><Check /></span><b>{flow.offer.title}</b
								><small>{flow.offer.text}</small>
							</div>
						{/if}
					</div>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.flow-sec {
		background: var(--bg);
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.flow {
		list-style: none;
		padding: 0;
		margin: 52px 0 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		position: relative;
	}
	.flow::before {
		content: "";
		position: absolute;
		top: 21px;
		left: 22px;
		right: 22px;
		height: 2px;
		background: repeating-linear-gradient(
			90deg,
			#cfd8d3 0 6px,
			transparent 6px 12px
		);
		z-index: 0;
	}
	li {
		position: relative;
		z-index: 1;
		cursor: default;
	}
	.fn {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--ink);
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 16px;
		transition:
			background 0.3s,
			color 0.3s,
			transform 0.4s cubic-bezier(0.2, 1.6, 0.4, 1),
			box-shadow 0.4s;
	}
	li:hover .fn {
		background: var(--ink);
		color: #fff;
		transform: scale(1.08);
		box-shadow: 0 0 0 6px rgba(138, 214, 143, 0.25);
	}
	.fv {
		margin-top: 20px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		height: 170px;
		display: grid;
		place-items: center;
		padding: 16px;
		overflow: hidden;
		transition:
			box-shadow 0.3s,
			transform 0.3s;
	}
	li:hover .fv {
		box-shadow: 0 22px 44px -28px rgba(30, 50, 45, 0.38);
		border-color: #d6deda;
	}
	/* `li h3`: beats the landing reset of heading margins. */
	li h3 {
		font-size: 19px;
		font-weight: 600;
		margin-top: 18px;
	}
	li > p {
		color: var(--muted);
		font-size: 15px;
		margin-top: 6px;
	}

	/* 1: the question */
	.fq {
		display: flex;
		gap: 10px;
		align-items: flex-start;
		font-size: 13px;
	}
	.fq-a {
		width: 30px;
		height: 30px;
		flex: none;
		display: grid;
		place-items: center;
	}
	.fq-a :global(img) {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		display: block;
	}
	.fq p {
		background: #f2f5f3;
		border-radius: 4px 14px 14px 14px;
		padding: 10px 12px;
		margin: 0;
		line-height: 1.4;
	}
	li:hover .fq p {
		animation: fl-pop 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	li:hover .fq-a {
		animation: fl-nod 0.7s ease both;
	}

	/* 2: the bars */
	.fdb {
		display: flex;
		align-items: flex-end;
		gap: 7px;
		height: 110px;
		width: 100%;
	}
	.fdb i {
		flex: 1;
		background: #dce3df;
		border-radius: 5px 5px 0 0;
		transform-origin: bottom;
		transition: transform 0.5s;
	}
	.fdb i.hi {
		background: var(--accent-deep);
	}
	li:hover .fdb i {
		animation: dm-bar 0.7s ease both;
	}
	li:hover .fdb i.hi {
		background: var(--accent);
	}
	li:hover .fdb i:nth-child(2) {
		animation-delay: 0.05s;
	}
	li:hover .fdb i:nth-child(3) {
		animation-delay: 0.1s;
	}
	li:hover .fdb i:nth-child(4) {
		animation-delay: 0.15s;
	}
	li:hover .fdb i:nth-child(5) {
		animation-delay: 0.2s;
	}
	li:hover .fdb i:nth-child(6) {
		animation-delay: 0.25s;
	}

	/* 3: the contract ends */
	.ftl {
		width: 100%;
		display: grid;
		gap: 12px;
		font-size: 12px;
	}
	.ftl div {
		display: grid;
		gap: 5px;
	}
	.ftl span {
		display: block;
		height: 9px;
		max-width: 100%;
		border-radius: 5px;
		background: repeating-linear-gradient(
			135deg,
			#e3e7e5 0 5px,
			#eef0ef 5px 10px
		);
		position: relative;
		transition: width 0.6s;
	}
	.ftl span::after {
		content: "";
		position: absolute;
		right: -5px;
		top: -3px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: var(--ink);
		border: 3px solid #fff;
		box-sizing: border-box;
	}
	li:hover .ftl span {
		animation: fl-grow 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	li:hover .ftl div:nth-child(2) span {
		animation-delay: 0.12s;
	}
	li:hover .ftl div:nth-child(3) span {
		animation-delay: 0.24s;
	}

	/* 4: the offer */
	.fnx {
		display: grid;
		justify-items: center;
		gap: 4px;
		text-align: center;
	}
	.fnx .okb {
		width: 34px;
		height: 34px;
		margin-bottom: 4px;
		transition: transform 0.3s;
	}
	.fnx .okb :global(svg) {
		width: 14px;
	}
	.fnx b {
		font-size: 14px;
	}
	.fnx small {
		font-size: 12px;
		color: var(--muted);
	}
	li:hover .fnx .okb {
		animation:
			fl-check 0.6s cubic-bezier(0.2, 1.6, 0.4, 1) both,
			fl-ring 1.2s ease-out 0.2s;
	}
	li:hover .fnx b {
		animation: fl-pop 0.5s 0.15s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	@keyframes dm-bar {
		from {
			transform: scaleY(0.2);
		}
	}
	@keyframes fl-pop {
		0% {
			opacity: 0;
			transform: translateY(8px) scale(0.94);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes fl-nod {
		0%,
		100% {
			transform: none;
		}
		35% {
			transform: translateY(-3px);
		}
		70% {
			transform: translateY(1px);
		}
	}
	@keyframes fl-grow {
		from {
			max-width: 0;
		}
		to {
			max-width: 100%;
		}
	}
	@keyframes fl-check {
		0% {
			transform: scale(0.4) rotate(-20deg);
			opacity: 0.3;
		}
		100% {
			transform: none;
			opacity: 1;
		}
	}
	@keyframes fl-ring {
		0% {
			box-shadow: 0 0 0 0 rgba(138, 214, 143, 0.55);
		}
		100% {
			box-shadow: 0 0 0 14px rgba(138, 214, 143, 0);
		}
	}

	@media (max-width: 1040px) {
		.flow {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			row-gap: 36px;
		}
		.flow::before {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.flow {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		li:hover * {
			animation: none !important;
		}
	}
</style>
