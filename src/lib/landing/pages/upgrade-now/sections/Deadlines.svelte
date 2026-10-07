<!--
  "Vier Fristen": the four dates of the HeizkostenV on a timeline. Each entry
  is done once its date has passed; the retrofit deadline is highlighted with
  the day count until then.
-->
<script lang="ts">
	import SectionHead from "../components/SectionHead.svelte";
	import { deadlines } from "../content";
	import { daysLeftText } from "../deadline";
	import { getDeadlineClock } from "../clock.svelte";

	const clock = getDeadlineClock();
	const badge = $derived(daysLeftText(clock.today));
</script>

<section class="law" aria-labelledby="law-h">
	<div class="wrap">
		<SectionHead
			id="law-h"
			eyebrow={deadlines.eyebrow}
			heading={clock.expired ? deadlines.h2Expired : deadlines.h2}
		>
			{#snippet icon()}
				<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
					d="M12 2.5V6h3.5M8 10h5M8 13h5"
				/>
			{/snippet}
		</SectionHead>
		<ol class="tl">
			{#each deadlines.entries as entry (entry.date)}
				<li
					class={[
						"rv",
						clock.today >= entry.from && "done",
						entry.current && "now",
					]}
				>
					<span class="d">{entry.date}</span>
					<span class="dot"
						>{#if entry.current && !clock.expired}<i></i>{/if}</span
					>
					{#if entry.current}<span class="badge">{badge}</span>{/if}
					<h3>{entry.title}</h3>
					<p>{entry.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.law {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.tl {
		list-style: none;
		padding: 0;
		margin: 56px 0 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 24px;
		position: relative;
	}
	.tl::before {
		content: "";
		position: absolute;
		left: 0;
		right: 0;
		top: 46px;
		height: 2px;
		background: linear-gradient(90deg, var(--ink) 0 62%, var(--hair) 62% 100%);
	}
	li {
		position: relative;
	}
	.d {
		display: block;
		font-size: 14px;
		font-weight: 600;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		height: 30px;
	}
	.dot {
		display: block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		border: 2px solid var(--hair);
		position: relative;
		margin: 0 0 22px;
		z-index: 1;
	}
	li.done .dot {
		background: var(--ink);
		border-color: var(--ink);
	}
	li.now .d {
		color: var(--ink);
	}
	li.now .dot {
		width: 22px;
		height: 22px;
		margin: -3px 0 19px -3px;
		background: var(--accent);
		border-color: var(--ink);
	}
	li.now.done .dot {
		background: var(--ink);
	}
	li.now .dot i {
		position: absolute;
		inset: -7px;
		border-radius: 50%;
		border: 2px solid var(--accent);
		animation: ping 2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
	}
	@keyframes ping {
		0% {
			transform: scale(0.5);
			opacity: 0.7;
		}
		100% {
			transform: scale(1.9);
			opacity: 0;
		}
	}
	.badge {
		position: absolute;
		left: 110px;
		top: 10px;
		background: var(--ink);
		color: var(--accent);
		font-size: 12.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 4px 10px;
		white-space: nowrap;
	}
	h3 {
		font-size: 19px;
		letter-spacing: -0.015em;
		font-weight: 600;
		line-height: 1.25;
	}
	p {
		color: var(--muted);
		font-size: 15px;
		margin-top: 8px;
		line-height: 1.5;
	}
	li.now {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 16px 18px 20px;
		margin: -17px -18px 0;
	}
	@media (max-width: 1040px) {
		.tl {
			grid-template-columns: minmax(0, 1fr);
			gap: 0;
			padding-left: 30px;
		}
		.tl::before {
			left: 7px;
			right: auto;
			top: 6px;
			bottom: 6px;
			width: 2px;
			height: auto;
			background: linear-gradient(
				180deg,
				var(--ink) 0 52%,
				var(--hair) 52% 100%
			);
		}
		li {
			padding: 0 0 30px;
		}
		.d {
			height: auto;
			margin-bottom: 6px;
		}
		.dot {
			position: absolute;
			left: -30px;
			top: 2px;
			margin: 0;
		}
		li.now {
			margin: 0 0 30px -12px;
			padding: 16px 18px 20px 12px;
		}
		li.now .dot {
			left: -21px;
			top: 16px;
			margin: 0;
		}
		.badge {
			position: static;
			display: inline-block;
			margin: 0 0 10px;
		}
	}
</style>
