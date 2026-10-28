<!--
  The booking card (.bk with #gc-css): the team, the next five weekdays and
  "Freie Termine ansehen", all opening the Google Calendar booking page in a
  new tab; nothing is stored or sent from here. The days are the Berlin dates
  after the page's `DeadlineClock` (server-rendered for its day, never
  `Date.now()` here). A click on any `#start` link of the page scrolls the
  card into view and flashes it, as the design's `#demo-js` does.
-->
<script lang="ts">
	import avatar from "$lib/assets/landing/region/avatar-2.webp?enhanced";
	import { flushSync } from "svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { START_HREF } from "$lib/landing/cta";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import Icon from "../components/Icon.svelte";
	import { booking } from "../content";
	import { nextWeekdays } from "../days";

	const clock = getDeadlineClock();
	const days = $derived(nextWeekdays(clock.today));

	let card: HTMLElement;
	let flash = $state(false);

	function onclick(event: MouseEvent) {
		if (event.defaultPrevented || event.button !== 0) return;
		const link = (event.target as Element | null)?.closest("a");
		if (link?.getAttribute("href") !== START_HREF) return;
		event.preventDefault();
		const reduced = prefersReducedMotion();
		// Where the card sits unstuck: the sticky wrapper's rect is wherever
		// it's stuck at the moment.
		const wrap = card.parentElement!;
		wrap.style.position = "static";
		const top = card.getBoundingClientRect().top + window.scrollY;
		wrap.style.position = "";
		window.scrollTo({
			top: top - 90,
			behavior: reduced ? "auto" : "smooth",
		});
		if (reduced) return;
		// Restart the animation when it's still running.
		flash = false;
		flushSync();
		void card.offsetWidth;
		flash = true;
	}
</script>

<svelte:document {onclick} />

<div class="bk-wrap rv">
	<div
		class={["bk", flash && "flash"]}
		id="bk"
		role="group"
		aria-label={booking.label}
		bind:this={card}
		onanimationend={(e) => {
			if (e.target === card) flash = false;
		}}
	>
		<div class="head">
			<div class="team">
				<span class="av"
					><Image
						src={avatar}
						alt={booking.avatarAlt}
						width={42}
						height={42}
						sizes="42px"
					/></span
				>
				<span
					><b>{booking.title}</b><small
						><Icon name="video" />{booking.mode}</small
					></span
				>
			</div>
		</div>
		<div class="step">
			<p class="lead">{booking.lead}</p>
			<p class="k">{booking.daysLabel}</p>
			<div class="days">
				{#each days as d, i (d.iso)}
					<a
						href={booking.cta.href}
						target="_blank"
						rel="noopener"
						style:animation-delay="{i * 60}ms"
						><small>{d.weekday}</small><b>{d.day}</b><small>{d.month}</small></a
					>
				{/each}
			</div>
			<ol class="steps">
				{#each booking.steps as s, i (s.title)}
					<li><i>{i + 1}</i><span><b>{s.title}</b>{s.text}</span></li>
				{/each}
			</ol>
			<a class="bk-next" href={booking.cta.href} target="_blank" rel="noopener"
				><Icon name="calendar" />{booking.cta.text}
				<span class="ar" aria-hidden="true">→</span></a
			>
		</div>
	</div>
	<p class="note"><Icon name="lock" />{booking.note}</p>
</div>

<style>
	.bk-wrap {
		position: sticky;
		top: 88px;
	}
	.bk {
		position: relative;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		box-shadow: 0 40px 80px -40px rgba(30, 50, 45, 0.35);
		overflow: hidden;
	}
	.bk.flash {
		animation: dm-flash 1.2s ease;
	}
	@keyframes dm-flash {
		0%,
		100% {
			box-shadow: 0 40px 80px -40px rgba(30, 50, 45, 0.35);
		}
		30% {
			box-shadow:
				0 0 0 6px rgba(138, 214, 143, 0.55),
				0 40px 80px -40px rgba(30, 50, 45, 0.35);
		}
	}
	.head {
		padding: 20px 22px 0;
	}
	.team {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	/* .bk-av.bk-avp: the round photo with the green "online" dot */
	.av {
		width: 42px;
		height: 42px;
		flex: none;
		position: relative;
		display: grid;
		place-items: center;
	}
	.av :global(img) {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		display: block;
	}
	.av::after {
		content: "";
		position: absolute;
		right: -1px;
		bottom: -1px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #3e9a57;
		border: 2px solid #fff;
	}
	.team b {
		display: block;
		font-size: 16px;
		font-weight: 600;
	}
	.team small {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--muted);
		font-size: 13px;
	}
	.team small :global(svg) {
		width: 14px;
		height: 14px;
	}
	.step {
		padding: 18px 22px 22px;
	}
	.lead {
		margin: 0;
		color: var(--muted);
		font-size: 15px;
		line-height: 1.55;
	}
	.k {
		margin: 18px 0 8px;
		font-size: 12.5px;
		color: var(--faint);
		font-weight: 500;
	}
	.days {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}
	.days a {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 10px 0;
		border: 1px solid var(--hair);
		border-radius: 11px;
		color: var(--ink);
		transition:
			border-color 0.2s,
			background 0.2s;
		opacity: 0;
		animation: gc-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
	}
	@keyframes gc-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.days small {
		font-size: 12px;
		color: var(--muted);
	}
	.days b {
		font-size: 18px;
		font-weight: 600;
	}
	.days a:hover {
		border-color: var(--accent);
		background: #f3faf3;
	}
	.steps {
		list-style: none;
		margin: 20px 0 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}
	.steps li {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		font-size: 13.5px;
		color: var(--muted);
		line-height: 1.45;
	}
	.steps i {
		flex: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #eef6ee;
		color: var(--ink);
		display: grid;
		place-items: center;
		font-style: normal;
		font-size: 11.5px;
		font-weight: 600;
	}
	.steps b {
		display: block;
		color: var(--ink);
		font-weight: 600;
		font-size: 14px;
	}
	.step .bk-next {
		margin-top: 22px;
	}
	.note {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		font-size: 12.5px;
		color: var(--faint);
		margin: 14px 0 0;
	}
	.note :global(svg) {
		width: 13px;
		height: 13px;
	}

	@media (max-width: 1040px) {
		.bk-wrap {
			position: static;
			max-width: 560px;
			width: 100%;
			margin: 0 auto;
		}
	}
	@media (max-width: 640px) {
		.head {
			padding: 16px 16px 0;
		}
		.step {
			padding: 18px 16px 16px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.days a {
			opacity: 1;
			animation: none;
		}
	}
</style>
