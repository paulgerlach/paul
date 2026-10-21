<!--
  "Erstgespräch vereinbaren": a pill fixed to the bottom of the screen. It
  slides in from half the page on and hides again while the final signup or
  the footer is on screen. Not shown without JS (it's an extra).
-->
<script lang="ts">
	import { onMount } from "svelte";
	import avatar1 from "$lib/assets/landing/region/avatar-1.webp?enhanced";
	import avatar2 from "$lib/assets/landing/region/avatar-2.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";

	let {
		href = DEMO_HREF,
	}: {
		/** The target (default `DEMO_HREF`, /demo-buchen). */
		href?: string;
	} = $props();

	let on = $state(false);
	let ticking = false;

	const visible = (el: Element | null) => {
		if (!el) return false;
		const r = el.getBoundingClientRect();
		return r.top < innerHeight && r.bottom > 0;
	};

	function update() {
		ticking = false;
		const max = document.documentElement.scrollHeight - innerHeight;
		on =
			max > 0 &&
			scrollY >= max * 0.5 &&
			!visible(document.querySelector("footer")) &&
			!visible(document.querySelector("section.final"));
	}

	onMount(update);

	function onscroll() {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	}
</script>

<svelte:window {onscroll} onresize={update} />

<a
	class={["ctab", on && "on"]}
	{href}
	onclick={href === START_HREF ? focusSignup : undefined}
	aria-hidden={!on}
	tabindex={on ? undefined : -1}
>
	<span class="ct-av">
		<Image src={avatar1} alt="" width={44} height={44} sizes="44px" />
		<Image src={avatar2} alt="" width={44} height={44} sizes="44px" />
	</span>
	<span class="ct-tx">
		<b>Erstgespräch vereinbaren</b>
		<small
			><span class="lg">Mit Ihrem persönlichen Ansprechpartner</span><span
				class="sm">Persönlicher Ansprechpartner</span
			></small
		>
	</span>
	<span class="ct-go">
		<svg
			viewBox="0 0 14 14"
			fill="none"
			stroke="currentColor"
			stroke-width="1.8"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"><path d="M4 10L10 4M5 4h5v5" /></svg
		>
	</span>
</a>

<style>
	.ctab {
		position: fixed;
		left: 50%;
		bottom: calc(22px + env(safe-area-inset-bottom, 0px));
		z-index: 29;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 6px;
		border-radius: 999px;
		background: #1e322d;
		color: #fff;
		text-decoration: none;
		box-shadow:
			0 18px 40px -16px rgba(30, 50, 45, 0.55),
			0 2px 6px rgba(30, 50, 45, 0.18);
		transform: translate(-50%, 140%);
		opacity: 0;
		pointer-events: none;
		transition:
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.5s ease;
	}
	.ctab.on {
		transform: translate(-50%, 0);
		opacity: 1;
		pointer-events: auto;
	}
	.ct-av {
		display: flex;
		flex: none;
	}
	.ct-av :global(img) {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		object-fit: cover;
		border: 3px solid #1e322d;
		display: block;
		background: #eef0ee;
	}
	.ct-av :global(img + img) {
		margin-left: -12px;
	}
	.ct-tx {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-right: 6px;
		white-space: nowrap;
	}
	.ct-tx b {
		font-size: 15px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.ct-tx small {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.62);
	}
	.sm {
		display: none;
	}
	.ct-go {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		flex: none;
		display: grid;
		place-items: center;
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
		transition:
			background 0.35s,
			color 0.35s;
	}
	.ct-go svg {
		width: 14px;
		height: 14px;
		transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.ctab:hover .ct-go {
		background: #8ad68f;
		color: #1e322d;
	}
	.ctab:hover .ct-go svg {
		transform: translate(1px, -1px);
	}
	.ctab:focus-visible {
		outline: 2px solid #8ad68f;
		outline-offset: 3px;
	}

	@media (max-width: 600px) {
		.ctab {
			gap: 8px;
			bottom: calc(14px + env(safe-area-inset-bottom, 0px));
			left: 14px;
			right: 90px;
			transform: translateY(140%);
		}
		.ctab.on {
			transform: none;
		}
		.ct-tx {
			min-width: 0;
			flex: 1;
			overflow: hidden;
		}
		.ct-tx b,
		.ct-tx small {
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.ct-tx b {
			font-size: 14px;
			letter-spacing: -0.02em;
		}
		.ct-tx small {
			font-size: 12px;
		}
		.ct-av :global(img) {
			width: 40px;
			height: 40px;
		}
		.ct-av :global(img:first-child) {
			display: none;
		}
		.ct-av :global(img + img) {
			margin-left: 0;
		}
		.lg {
			display: none;
		}
		.sm {
			display: inline;
		}
		.ct-go {
			width: 40px;
			height: 40px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ctab {
			transition: opacity 0.2s;
		}
	}
</style>
