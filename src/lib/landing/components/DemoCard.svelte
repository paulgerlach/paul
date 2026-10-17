<!--
  "Demo mit unserem Team buchen" card of the landing heroes. The demo video
  plays while the card is hovered, focused or touched.
-->
<script lang="ts">
	import poster from "$lib/assets/landing/demo-poster.jpg?url";
	import { DEMO_HREF, focusSignup, START_HREF } from "$lib/landing/cta";

	let {
		href = DEMO_HREF,
		label = "Demo mit unserem Team buchen",
	}: { href?: string; label?: string } = $props();

	let video = $state<HTMLVideoElement>();
	// Autoplay may be refused (e.g. power saving); the poster stays then.
	const play = () => video?.play().catch(() => {});
	const pause = () => video?.pause();
</script>

<a
	class="demo-card"
	{href}
	onclick={href === START_HREF ? focusSignup : undefined}
	onmouseenter={play}
	onfocus={play}
	ontouchstart={play}
	onmouseleave={pause}
	onblur={pause}
>
	<span class="dc-ph">
		<video
			bind:this={video}
			{poster}
			muted
			loop
			playsinline
			preload="metadata"
			aria-hidden="true"
		>
			<source src="/landing/demo.webm" type="video/webm" />
			<source src="/landing/demo.mp4" type="video/mp4" />
		</video>
	</span>
	<span>{label}</span>
	<i aria-hidden="true">→</i>
</a>

<style>
	.demo-card {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 24px;
		align-self: flex-start;
		background: #edefee;
		border-radius: 8px;
		padding: 4px 16px 4px 4px;
		color: var(--ink);
		font-size: 15px;
		transition: background 0.2s;
	}
	.demo-card:hover {
		background: #e3e7e5;
	}
	.dc-ph {
		width: 48px;
		height: 40px;
		border-radius: 6px;
		overflow: hidden;
		flex: none;
		display: block;
	}
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	i {
		font-style: normal;
		color: var(--muted);
		transition: transform 0.2s;
	}
	.demo-card:hover i {
		transform: translateX(3px);
	}

	@media (max-width: 980px) {
		.demo-card {
			align-self: center;
		}
	}
</style>
