<!--
  "Ihr Messdienst verdient verlässliche Partner." as four line-drawn seals
  (VDIV, DEUMESS, DSGVO, DE), then the "Sicherheit" block with three tiles.
  Once in view, the cards fade up and the seals draw; the DSGVO stars light
  up one by one, and the middle tile waves every 7 s. Reduced motion and no
  JS: everything as drawn, no loops.
-->
<script lang="ts">
	import { inView } from "$lib/landing/attachments/inView";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";
	import { prefersReducedMotion } from "$lib/landing/motion";

	type Seal = {
		label: string;
		size: number;
		y: number;
		/** The DSGVO seal is a ring of stars instead of the globe lines. */
		stars?: boolean;
		name: string;
		text: string;
	};
	const seals: Seal[] = [
		{
			label: "VDIV",
			size: 15,
			y: 49.4,
			name: "VDIV",
			text: "Heidi ist Kooperationspartner Bund des Verbands der Immobilienverwalter Deutschland.",
		},
		{
			label: "DEUMESS",
			size: 10.5,
			y: 47.8,
			name: "DEUMESS",
			text: "Heidi ist im Verband unabhängiger Messdienstleister vernetzt.",
		},
		{
			label: "DSGVO",
			size: 14,
			y: 49,
			stars: true,
			name: "DSGVO",
			text: "Ihre Daten werden nach den Regeln der Datenschutz-Grundverordnung und des BDSG verarbeitet.",
		},
		{
			label: "DE",
			size: 16,
			y: 49.8,
			name: "Hosting in Deutschland",
			text: "Alle Daten liegen auf Servern in Deutschland.",
		},
	];

	/** 12 five-pointed stars on a circle (r 37) around the seal's centre. */
	const stars = Array.from({ length: 12 }, (_, k) => {
		const a = ((-90 + 30 * k) * Math.PI) / 180;
		const cx = 44 + 37 * Math.cos(a);
		const cy = 44 + 37 * Math.sin(a);
		return Array.from({ length: 10 }, (_, p) => {
			const r = p % 2 ? 1.5 : 3.6;
			const b = ((-90 + 36 * p) * Math.PI) / 180;
			return `${(cx + r * Math.cos(b)).toFixed(2)},${(cy + r * Math.sin(b)).toFixed(2)}`;
		}).join(" ");
	});

	/** The design's "Mehr zu Sicherheit" page doesn't exist yet: no link until it does. */
	const SECURITY_HREF: string | undefined = undefined;

	let armed = $state(false);
	let on = $state(false);
	/** DSGVO star sequence: lit one by one, gone, then back. */
	let starStates = $state<("" | "lit" | "gone")[]>(stars.map(() => ""));
	let back = $state(false);
	let wave = $state(false);

	let timers: ReturnType<typeof setTimeout>[] = [];
	let loop: ReturnType<typeof setInterval> | undefined;
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	function start() {
		on = true;
		if (!armed) return;
		const T = stars.length * 110 + 700;
		at(2200, () => {
			stars.forEach((_, i) => at(i * 110, () => (starStates[i] = "lit")));
			stars.forEach((_, i) => at(T + i * 40, () => (starStates[i] = "gone")));
			at(T + 900, () => {
				back = true;
				stars.forEach((_, i) => at(i * 60, () => (starStates[i] = "")));
			});
		});
		loop = setInterval(() => {
			wave = false;
			requestAnimationFrame(() => (wave = true));
		}, 7000);
	}

	$effect(() => () => {
		timers.forEach(clearTimeout);
		clearInterval(loop);
	});
</script>

<section
	class={["trust", armed && "armed", on && "on"]}
	aria-labelledby="trust-h"
	{@attach (el) => {
		armed = !prefersReducedMotion();
		return inView({ threshold: 0.2, once: true, onEnter: start })(el);
	}}
>
	<div class="wrap">
		<p class="eyebrow c">Partner</p>
		<h2 id="trust-h">Ihr Messdienst verdient verlässliche Partner.</h2>
		<div class="t-cards">
			{#each seals as seal (seal.label)}
				<div class="t-it">
					<svg
						class={["t-em", seal.stars && back && "back"]}
						viewBox="0 0 88 88"
						aria-hidden="true"
					>
						{#if seal.stars}
							{#each stars as points, i (i)}
								<polygon
									class={["st", starStates[i]]}
									style:transition-delay="{0.35 + i * 0.05}s"
									{points}
								/>
							{/each}
						{:else}
							<circle class="ln" cx="44" cy="44" r="40" pathLength="1" />
							<path class="ln" d="M9.4 24Q44 38 78.6 24" pathLength="1" />
							<path class="ln" d="M9.4 64Q44 50 78.6 64" pathLength="1" />
							<path
								class="ln"
								d="M30 5.8Q36 16 37 30M58 5.8Q52 16 51 30M30 82.2Q36 72 37 58M58 82.2Q52 72 51 58"
								pathLength="1"
							/>
						{/if}
						<text x="44" y={seal.y} text-anchor="middle" font-size={seal.size}
							>{seal.label}</text
						>
					</svg>
					<p class="t-tx"><b>{seal.name}:</b> {seal.text}</p>
				</div>
			{/each}
		</div>
		<div class="t-split">
			<div class="t-copy">
				<p class="eyebrow">Sicherheit</p>
				<h2>Ihre Verbrauchsdaten in sicheren Händen.</h2>
				<p>
					Heidi verarbeitet alle Daten nach deutschen Vorgaben und speichert sie
					auf Servern in Deutschland. Dazu ist Heidi Kooperationspartner des
					VDIV und im Verband DEUMESS vernetzt.
				</p>
				<div class="t-btns">
					<a
						class="p"
						href={DEMO_HREF}
						onclick={DEMO_HREF === START_HREF ? focusSignup : undefined}
						>Demo buchen</a
					>
					{#if SECURITY_HREF}<a class="s" href={SECURITY_HREF}
							>Mehr zu Sicherheit</a
						>{/if}
				</div>
			</div>
			<div class="t-vis" aria-hidden="true">
				<div class="t-tray">
					<div class="t-tl sd">
						<svg viewBox="0 0 24 24"
							><path
								d="M12 3l7 2.6v5.6c0 4.4-3 8-7 9.8-4-1.8-7-5.4-7-9.8V5.6z"
							/><path d="M8.8 12.2l2.2 2.2 4.3-4.6" /></svg
						>
					</div>
					<div class={["t-tl mid", wave && "wave"]}>
						<svg viewBox="0 0 12 12"
							><rect x="0" y="0" width="3.45" height="12" rx="1.72" /><rect
								x="4.27"
								y="0"
								width="3.45"
								height="12"
								rx="1.72"
							/><rect x="8.55" y="0" width="3.45" height="12" rx="1.72" /></svg
						>
					</div>
					<div class="t-tl sd">
						<svg viewBox="0 0 24 24"
							><rect x="5" y="10.5" width="14" height="10" rx="2" /><path
								d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"
							/><circle cx="12" cy="15.5" r=".6" fill="currentColor" /></svg
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.trust {
		padding: 110px 0 120px;
		background: #f6f7f6;
		text-align: center;
	}
	.trust h2 {
		font-size: clamp(26px, 2.8vw, 38px);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.2;
		margin: 0 auto;
		max-width: 30ch;
		color: var(--ink);
	}
	.t-cards {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 18px;
		max-width: 1240px;
		margin: 56px auto 0;
		text-align: left;
	}
	.t-it {
		background: #eff1ef;
		border: 1px solid #e5e9e6;
		border-radius: 18px;
		padding: 36px 34px;
		min-height: 340px;
		display: flex;
		flex-direction: column;
		transition:
			opacity 0.6s,
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.3s;
	}
	.t-it:hover {
		background: #ebeeeb;
	}
	.armed:not(.on) .t-it {
		opacity: 0;
		transform: translateY(12px);
	}
	.on .t-it:nth-child(2) {
		transition-delay: 0.1s;
	}
	.on .t-it:nth-child(3) {
		transition-delay: 0.2s;
	}
	.on .t-it:nth-child(4) {
		transition-delay: 0.3s;
	}
	.t-em {
		width: 88px;
		height: 88px;
		display: block;
		color: #3e4f4a;
	}
	.ln {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.2;
		stroke-dasharray: 1;
		stroke-dashoffset: 0;
		transition:
			stroke-dashoffset 1.4s cubic-bezier(0.45, 0.05, 0.25, 1),
			stroke 0.4s;
	}
	.armed:not(.on) .ln {
		stroke-dashoffset: 1;
	}
	.on .t-it:nth-child(2) .ln {
		transition-delay: 0.15s;
	}
	.on .t-it:nth-child(3) .ln {
		transition-delay: 0.3s;
	}
	.on .t-it:nth-child(4) .ln {
		transition-delay: 0.45s;
	}
	.t-em text {
		fill: currentColor;
		font-family: inherit;
		font-weight: 400;
		letter-spacing: 0.02em;
	}
	.st {
		fill: currentColor;
		transform-box: fill-box;
		transform-origin: center;
		transition:
			opacity 0.4s,
			transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1),
			fill 0.35s;
	}
	.armed:not(.on) .st {
		opacity: 0;
		transform: scale(0.3);
	}
	.on .st.lit {
		fill: #2f6bdb;
		transform: scale(1.2);
		transition:
			fill 0.2s,
			transform 0.3s;
		transition-delay: 0s !important;
	}
	.on .st.gone {
		opacity: 0;
		transform: scale(0.3);
		transition:
			opacity 0.45s,
			transform 0.5s cubic-bezier(0.5, 0, 0.75, 0) !important;
	}
	.on .t-em.back .st {
		transition:
			opacity 0.5s,
			transform 0.6s cubic-bezier(0.3, 1.5, 0.5, 1),
			fill 0.2s !important;
	}
	.t-it:hover .ln {
		stroke: #2f7a3c;
	}
	.t-tx {
		margin-top: 0;
		padding-top: clamp(56px, 6vw, 96px);
		font-size: 16.5px;
		line-height: 1.5;
		color: var(--muted);
	}
	.t-tx b {
		font-weight: 500;
		color: var(--ink);
	}

	.t-split {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
		gap: clamp(32px, 6vw, 96px);
		align-items: stretch;
		max-width: 1240px;
		margin: clamp(80px, 9vw, 130px) auto 0;
		text-align: left;
	}
	.t-copy {
		display: flex;
		flex-direction: column;
		padding-block: 8px;
	}
	.t-copy h2 {
		margin: 0;
		max-width: 18ch;
		font-size: clamp(30px, 3.3vw, 48px);
		line-height: 1.06;
		letter-spacing: -0.035em;
	}
	.t-copy > p:not(.eyebrow) {
		margin-top: auto;
		padding-top: 32px;
		color: var(--muted);
		font-size: clamp(16px, 1.3vw, 18.5px);
		line-height: 1.55;
		max-width: 44ch;
	}
	.t-btns {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 24px;
	}
	.t-btns a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 46px;
		padding: 0 20px;
		border-radius: 8px;
		font-size: 15.5px;
		font-weight: 500;
		text-decoration: none;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.t-btns .p {
		background: #1e322d;
		color: #fff;
	}
	.t-btns .p:hover {
		background: #2a443d;
	}
	.t-btns .s {
		background: #fff;
		color: #1e322d;
		border: 1px solid #d5dad8;
	}
	.t-btns .s:hover {
		border-color: #a9d9ad;
	}

	.t-vis {
		position: relative;
		width: 100%;
		border-radius: 22px;
		background: #1e322d;
		display: grid;
		place-items: center;
		overflow: hidden;
		min-height: clamp(300px, 30vw, 430px);
		transition:
			opacity 0.7s,
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.armed:not(.on) .t-vis {
		opacity: 0;
		transform: translateY(12px);
	}
	.t-tray {
		display: flex;
		gap: clamp(8px, 1vw, 14px);
		padding: clamp(8px, 1vw, 14px);
		border-radius: clamp(24px, 2.6vw, 36px);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}
	.t-tl {
		width: clamp(64px, 7.4vw, 124px);
		aspect-ratio: 1;
		border-radius: clamp(18px, 2vw, 28px);
		display: grid;
		place-items: center;
		background: rgba(255, 255, 255, 0.07);
		border: 1px solid rgba(255, 255, 255, 0.13);
		color: rgba(255, 255, 255, 0.72);
		transition:
			background 0.4s,
			color 0.4s;
	}
	.t-tl svg {
		width: 30%;
		height: 30%;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.t-vis:hover .t-tl.sd {
		background: rgba(255, 255, 255, 0.1);
		color: #8ad68f;
	}
	.t-tl.mid {
		background: #fff;
		border-color: #fff;
		color: #1e322d;
		box-shadow: 0 26px 50px -18px rgba(0, 0, 0, 0.55);
		transition: transform 0.9s cubic-bezier(0.3, 1.4, 0.5, 1) 0.25s;
	}
	.armed:not(.on) .t-tl.mid {
		transform: scale(0.86);
	}
	.t-tl.mid svg {
		width: 26%;
		height: 26%;
		fill: currentColor;
		stroke: none;
		overflow: visible;
	}
	.t-tl.mid rect {
		transform-box: fill-box;
		transform-origin: bottom;
		transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.armed:not(.on) .t-tl.mid rect {
		transform: scaleY(0);
	}
	.on .t-tl.mid rect:nth-child(1) {
		transition-delay: 0.55s;
	}
	.on .t-tl.mid rect:nth-child(2) {
		transition-delay: 0.7s;
	}
	.on .t-tl.mid rect:nth-child(3) {
		transition-delay: 0.85s;
	}
	.t-tl.mid.wave rect {
		animation: tWave 1.6s ease-in-out;
	}
	.t-tl.mid.wave rect:nth-child(2) {
		animation-delay: 0.15s;
	}
	.t-tl.mid.wave rect:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes tWave {
		0%,
		100% {
			transform: none;
		}
		40% {
			transform: translateY(-6%);
		}
	}

	@media (max-width: 1060px) {
		.t-cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			max-width: 720px;
		}
		.t-it {
			min-height: 260px;
		}
	}
	@media (max-width: 900px) {
		.t-split {
			grid-template-columns: minmax(0, 1fr);
		}
		.t-copy > p:not(.eyebrow) {
			margin-top: 0;
			padding-top: 20px;
		}
		.t-vis {
			min-height: 260px;
		}
		.t-tl {
			width: 76px;
		}
	}
	@media (max-width: 560px) {
		.trust {
			padding: 72px 0 84px;
		}
		.t-cards {
			grid-template-columns: minmax(0, 1fr);
			margin-top: 40px;
			gap: 12px;
		}
		.t-it {
			min-height: 0;
			padding: 28px 24px;
		}
		.t-tx {
			padding-top: 32px;
		}
		.t-em {
			width: 72px;
			height: 72px;
		}
	}
</style>
