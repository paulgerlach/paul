<!--
  "Name und Logo." (#pr-name): the dark card with "Heizungen digitalisieren."
  and the logo's three bars. The server renders them grown. In the browser a
  card still below the fold starts with the bars low; they grow when it
  comes into view (`.go`), and 1.3 s later the mark starts to glow (`.warm`),
  only while the card is in view. Reduced motion: grown, no glow.
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { name } from "../content";

	/** `.go`: the bars at full height (the server's state). */
	let grown = $state(true);
	/** The growth is over, so the glow may run. */
	let settled = $state(false);
	let visible = $state(false);

	const grow: Attachment<HTMLElement> = (el) => {
		if (prefersReducedMotion()) return;
		if (el.getBoundingClientRect().top < window.innerHeight) {
			settled = true;
			return;
		}
		grown = false;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				grown = true;
				timer = setTimeout(() => (settled = true), 1300);
			},
			{ threshold: 0.15 },
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			clearTimeout(timer);
		};
	};

	const mark = [
		"M 46.203125 7.785156 C 46.203125 6.832031 46.976562 6.0625 47.925781 6.0625 C 48.878906 6.0625 49.648438 6.832031 49.648438 7.785156 L 49.648438 16.152344 C 49.648438 17.105469 48.878906 17.875 47.925781 17.875 C 46.976562 17.875 46.203125 17.105469 46.203125 16.152344 Z M 46.203125 7.785156",
		"M 52.175781 6.0625 C 53.125 6.0625 53.898438 6.832031 53.898438 7.785156 L 53.898438 16.152344 C 53.898438 17.105469 53.125 17.875 52.175781 17.875 C 51.222656 17.875 50.453125 17.105469 50.453125 16.152344 L 50.453125 7.785156 C 50.453125 6.832031 51.222656 6.0625 52.175781 6.0625 Z M 52.175781 6.0625",
		"M 56.425781 6.0625 C 57.375 6.0625 58.148438 6.832031 58.148438 7.785156 L 58.148438 16.152344 C 58.148438 17.105469 57.375 17.875 56.425781 17.875 C 55.472656 17.875 54.703125 17.105469 54.703125 16.152344 L 54.703125 7.785156 C 54.703125 6.832031 55.472656 6.0625 56.425781 6.0625 Z M 56.425781 6.0625",
	];
</script>

<section class="sec" aria-labelledby="pr-nh">
	<div class="wrap">
		<h2 class="pr-h rv" id="pr-nh">{name.h2}</h2>
		<div
			class={["card rv", grown && "go", settled && visible && "warm"]}
			id="pr-name"
			{@attach grow}
			{@attach inView({
				onEnter: () => (visible = true),
				onLeave: () => (visible = false),
			})}
		>
			<div class="nl">
				<p class="big">
					{#each name.big as part, i (i)}{#if part.accent}<span class="a"
								>{part.text}</span
							>{:else}{part.text}{/if}{/each}
				</p>
				<p class="text">{name.text}</p>
			</div>
			<div class="mark" aria-hidden="true">
				<svg viewBox="45.7 5.6 8.7 12.8" role="img" aria-label={name.markLabel}
					><g fill="currentColor"
						>{#each mark as d (d)}<path {d} />{/each}</g
					></svg
				>
			</div>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 56px 0;
	}
	.card {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
		gap: clamp(24px, 5vw, 80px);
		align-items: center;
		margin-top: 36px;
		background: var(--ink);
		color: #fff;
		border-radius: 26px;
		padding: clamp(28px, 4vw, 56px);
	}
	.big {
		font-size: clamp(32px, 4vw, 58px);
		letter-spacing: -0.04em;
		line-height: 1.05;
	}
	.big .a {
		color: var(--accent);
	}
	.text {
		color: rgba(255, 255, 255, 0.7);
		font-size: clamp(16px, 1.3vw, 18px);
		line-height: 1.55;
		margin-top: 22px;
		max-width: 52ch;
	}
	.mark {
		display: flex;
		justify-content: center;
	}
	.mark svg {
		width: min(130px, 40%);
		height: auto;
		color: var(--accent);
		overflow: visible;
	}
	.mark path {
		transform-box: fill-box;
		transform-origin: 50% 100%;
		transform: scaleY(0.15);
		opacity: 0.2;
		transition:
			transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.6s;
	}
	.go .mark path {
		transform: none;
		opacity: 1;
	}
	.go .mark path:nth-child(2) {
		transition-delay: 0.15s;
	}
	.go .mark path:nth-child(3) {
		transition-delay: 0.3s;
	}
	.warm .mark svg {
		animation: warm 3.2s ease-in-out infinite;
	}
	@keyframes warm {
		0%,
		100% {
			filter: drop-shadow(0 0 0 rgba(138, 214, 143, 0));
		}
		50% {
			filter: drop-shadow(0 0 18px rgba(138, 214, 143, 0.45));
		}
	}

	@media (max-width: 900px) {
		.card {
			grid-template-columns: minmax(0, 1fr);
		}
		.mark svg {
			width: 90px;
		}
		.mark {
			justify-content: flex-start;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mark path {
			transform: none;
			opacity: 1;
			transition: none;
		}
		.warm .mark svg {
			animation: none;
		}
	}
</style>
