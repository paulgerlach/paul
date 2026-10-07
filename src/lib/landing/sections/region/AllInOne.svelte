<!--
  "Alles aus einer Hand": four cards with a mini visual each. Hovering a card
  plays its visual and counts its numbers up (reduced motion: neither).
-->
<script lang="ts">
	import { countUp } from "$lib/landing/attachments/countUp";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import type { RegionContent } from "./types";

	let { content }: { content: RegionContent } = $props();
	const s = $derived(content.allInOne);
	const ex = $derived(content.example);

	const titles = [
		"Installation",
		"Mieterkommunikation",
		"Ablesung & uVI",
		"Abrechnung",
	];
	const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"];

	/** Hover-only counter, as in the design (card 4 starts later and runs shorter). */
	const count = (to: number, card: number) =>
		countUp({
			to,
			hoverTarget: ".ai-card",
			onView: false,
			hoverDelay: card === 4 ? 500 : 100,
			duration: card === 4 ? 1100 : 1200,
		});
</script>

{#snippet ok(text: string)}
	<div class="row pop"><span class="okb"><Check /></span>{text}</div>
{/snippet}

<section class="allin wrap" aria-labelledby="ai-h">
	<div class="shead">
		<div class="eyebrow">{s.eyebrow}</div>
		<h2 id="ai-h">{s.title}</h2>
		<p>{s.text}</p>
	</div>
	<div class="allin-row">
		{#each titles as title, i (title)}
			<div class={["ai-card", `c${i + 1}`]}>
				<div class="ai-vis" aria-hidden="true">
					{#if i === 0}
						<div class="s">Montagetermin</div>
						<div class="t">{ex.appointment.day} · {ex.appointment.time}</div>
						<div class="mbar"><b></b></div>
						<div class="row cnt">
							<span
								><b {@attach count(ex.units, 1)}>{ex.units}</b> von {ex.units} Einheiten
								montiert</span
							>
						</div>
						{@render ok("Zugang bestätigt")}
					{:else if i === 1}
						<div class="row rcpt">
							<span class="s"
								><b {@attach count(ex.units, 2)}>{ex.units}</b> Mieter wurden informiert</span
							>
							<span class="avs">
								{#each ex.avatars as avatar, j (j)}<i>{avatar}</i>{/each}<i>+</i
								>
							</span>
						</div>
						<div class="mail">
							<svg class="plane" viewBox="0 0 24 24">
								<path d="M2 11l19-8-7 19-3-8z" fill="#1E322D" />
							</svg>
							Ihr Montagetermin: {ex.appointment.day}, {ex.appointment.time}
						</div>
						{@render ok("14 Tage vorher versendet")}
					{:else if i === 2}
						<div class="row">
							<span class="radio"><i></i><i></i><i></i></span>
							<span class="s">Funkablesung · uVI</span>
						</div>
						<div class="months">
							{#each months as month, j (month)}
								<span class={[j > 3 && "nx"]}>{month}</span>
							{/each}
						</div>
						{@render ok("Monatlich an alle Mieter")}
					{:else}
						<div class="s">Heizkostenabrechnung 2026 · {ex.address}</div>
						<div class="mini-btn">Abrechnung erstellen</div>
						<div class="row cnt">
							<span class="docs"><i></i><i></i><i></i></span>
							<span><b {@attach count(24, 4)}>24</b> Abrechnungen erstellt</span
							>
						</div>
						{@render ok("An Ihre Software übergeben")}
					{/if}
				</div>
				<div class="num">{i + 1}</div>
				<h3>{title}</h3>
				<p>{s.cards[i]}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.allin {
		padding-block: 40px 96px;
	}
	.allin-row {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
		margin-top: 56px;
	}
	.ai-card {
		background: var(--stone);
		border-radius: 18px;
		padding: 22px 22px 26px;
		display: flex;
		flex-direction: column;
		transition: background 0.3s;
	}
	.ai-card:hover {
		background: #eef1ef;
	}
	.ai-vis {
		background: #fff;
		border-radius: 12px;
		padding: 14px;
		height: 190px;
		box-sizing: border-box;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8px;
		font-size: 13px;
		box-shadow: 0 8px 24px rgba(30, 50, 45, 0.06);
		transition: box-shadow 0.35s;
	}
	.ai-card:hover .ai-vis {
		box-shadow: 0 14px 34px rgba(30, 50, 45, 0.14);
	}
	.num {
		margin-top: 20px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--ink);
		color: #fff;
		display: grid;
		place-items: center;
		font-weight: 600;
		font-size: 14px;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.ai-card:hover .num {
		background: var(--accent);
		color: var(--ink);
	}
	h3 {
		font-size: 20px;
		margin-top: 12px;
		line-height: 1.2;
	}
	.ai-card > p {
		color: var(--muted);
		font-size: 15px;
		margin-top: 8px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.s {
		font-size: 12px;
		color: var(--muted);
	}
	.t {
		font-weight: 600;
		font-size: 15px;
	}
	.mail {
		position: relative;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 9px 11px;
		border: 1px solid var(--line);
		border-radius: 8px;
		line-height: 1.45;
		transition:
			border-color 0.3s 1.6s,
			background 0.3s 1.6s;
	}
	.months {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
		margin-top: 4px;
	}
	.months span {
		border-radius: 6px;
		background: #e6f5e7;
		color: #2f7a3c;
		font-size: 11px;
		font-weight: 600;
		text-align: center;
		padding: 6px 0;
	}
	.months span.nx {
		background: #f1f3f2;
		color: var(--faint);
	}
	.mbar {
		height: 6px;
		border-radius: 3px;
		background: #edeeed;
		overflow: hidden;
	}
	.mbar b {
		display: block;
		height: 100%;
		width: 100%;
		background: var(--accent);
		border-radius: 3px;
	}
	.cnt b {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.rcpt {
		justify-content: space-between;
		gap: 8px;
	}
	.rcpt .s {
		line-height: 1.3;
	}
	.avs {
		display: flex;
	}
	.avs i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #e3eaf5;
		border: 2px solid #fff;
		margin-left: -6px;
		font-style: normal;
		font-size: 8px;
		font-weight: 700;
		display: grid;
		place-items: center;
		color: #3c5ba8;
	}
	.avs i:nth-child(2) {
		background: #fbe6da;
		color: #b4461e;
	}
	.avs i:nth-child(3) {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.avs i:nth-child(4) {
		background: var(--ink);
		color: #fff;
	}
	.plane {
		width: 16px;
		height: 16px;
		flex: none;
	}
	.radio {
		position: relative;
		width: 16px;
		height: 16px;
		flex: none;
	}
	.radio i {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 2px solid var(--accent-deep);
		opacity: 0;
	}
	.radio::after {
		content: "";
		position: absolute;
		left: 5px;
		top: 5px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
	}
	.mini-btn {
		align-self: flex-start;
		background: var(--accent);
		color: var(--ink);
		font-weight: 600;
		font-size: 12.5px;
		border-radius: 8px;
		padding: 7px 12px;
	}
	.docs {
		position: relative;
		width: 20px;
		height: 18px;
		flex: none;
	}
	.docs i {
		position: absolute;
		width: 13px;
		height: 16px;
		border-radius: 2px;
		background: #fff;
		border: 1.5px solid var(--ink);
	}
	.docs i:nth-child(1) {
		left: 0;
		top: 2px;
	}
	.docs i:nth-child(2) {
		left: 3px;
		top: 1px;
	}
	.docs i:nth-child(3) {
		left: 6px;
		top: 0;
	}

	/* Hover animations of the four visuals */
	@keyframes k-fill {
		from {
			width: 0;
		}
	}
	@keyframes k-pop {
		0% {
			opacity: 0;
			transform: scale(0.5);
		}
		60% {
			opacity: 1;
			transform: scale(1.12);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes k-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes k-slide {
		0% {
			opacity: 0;
			transform: translateX(-24px);
		}
		100% {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes k-fly {
		0% {
			transform: translate(0, 0) rotate(0);
			opacity: 1;
		}
		70% {
			opacity: 1;
		}
		100% {
			transform: translate(170px, -26px) rotate(-12deg);
			opacity: 0;
		}
	}
	@keyframes k-month {
		0% {
			background: #f1f3f2;
			color: #9aa5a1;
			transform: scale(1);
		}
		50% {
			transform: scale(1.15);
		}
		100% {
			background: #8ad68f;
			color: #1e322d;
			transform: scale(1);
		}
	}
	@keyframes k-wave {
		0% {
			transform: scale(0.4);
			opacity: 0.9;
		}
		100% {
			transform: scale(1.6);
			opacity: 0;
		}
	}
	@keyframes k-press {
		0%,
		100% {
			transform: none;
			filter: none;
		}
		35% {
			transform: scale(0.93);
			filter: brightness(0.9);
		}
	}
	@keyframes k-doc {
		0% {
			opacity: 0;
			transform: translate(-6px, 6px) rotate(0);
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes k-av {
		from {
			opacity: 0;
			transform: translateX(10px) scale(0.6);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	/* 1 Installation */
	.c1:hover .mbar b {
		animation: k-fill 1.3s cubic-bezier(0.3, 0.7, 0.3, 1) 0.1s both;
	}
	.c1:hover .pop .okb {
		animation: k-pop 0.45s 1.45s both;
	}
	.c1:hover .pop {
		animation: k-in 0.4s 1.4s both;
	}
	/* 2 Mieterkommunikation */
	.c2:hover .avs i {
		animation: k-av 0.35s both;
	}
	.c2:hover .avs i:nth-child(2) {
		animation-delay: 0.08s;
	}
	.c2:hover .avs i:nth-child(3) {
		animation-delay: 0.16s;
	}
	.c2:hover .avs i:nth-child(4) {
		animation-delay: 0.24s;
	}
	.c2:hover .mail {
		animation: k-slide 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s both;
		border-color: #bfe3c2;
		background: #f3faf3;
	}
	.c2:hover .plane {
		animation: k-fly 0.9s cubic-bezier(0.5, 0, 0.75, 0) 0.9s both;
	}
	.c2:hover .pop {
		animation: k-in 0.4s 1.6s both;
	}
	.c2:hover .pop .okb {
		animation: k-pop 0.45s 1.65s both;
	}
	/* 3 Ablesung & uVI */
	.c3:hover .radio i {
		animation: k-wave 1.2s ease-out infinite;
	}
	.c3:hover .radio i:nth-child(2) {
		animation-delay: 0.4s;
	}
	.c3:hover .radio i:nth-child(3) {
		animation-delay: 0.8s;
	}
	.c3:hover .months span {
		animation: k-month 0.35s both;
	}
	.c3:hover .months span:nth-child(1) {
		animation-delay: 0.1s;
	}
	.c3:hover .months span:nth-child(2) {
		animation-delay: 0.3s;
	}
	.c3:hover .months span:nth-child(3) {
		animation-delay: 0.5s;
	}
	.c3:hover .months span:nth-child(4) {
		animation-delay: 0.7s;
	}
	.c3:hover .months span:nth-child(5) {
		animation-delay: 0.9s;
	}
	.c3:hover .months span:nth-child(6) {
		animation-delay: 1.1s;
	}
	.c3:hover .pop {
		animation: k-in 0.4s 1.4s both;
	}
	.c3:hover .pop .okb {
		animation: k-pop 0.45s 1.45s both;
	}
	/* 4 Abrechnung */
	.c4:hover .mini-btn {
		animation: k-press 0.5s 0.15s both;
	}
	.c4:hover .docs i {
		animation: k-doc 0.3s both;
	}
	.c4:hover .docs i:nth-child(1) {
		animation-delay: 0.5s;
	}
	.c4:hover .docs i:nth-child(2) {
		animation-delay: 0.75s;
	}
	.c4:hover .docs i:nth-child(3) {
		animation-delay: 1s;
	}
	.c4:hover .pop {
		animation: k-in 0.4s 1.75s both;
	}
	.c4:hover .pop .okb {
		animation: k-pop 0.45s 1.8s both;
	}

	@media (max-width: 980px) {
		.allin-row {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 560px) {
		.allin-row {
			grid-template-columns: 1fr;
		}
	}
</style>
