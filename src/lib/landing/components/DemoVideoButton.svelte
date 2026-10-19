<!--
  The designs' video button of the closing card (#dcta-css / #dcta-js,
  .dcta-b): an accent link with a small demo video, its label and a
  sub-label. The video plays while at least 30 % of it is on screen and
  pauses off screen, never with reduced motion; on hover the frame grows and
  shows the "Live" badge. Server-rendered with its poster. The pages before
  /nachfolge put their signup form in its place; the default video is the
  region pages' demo, as in the designs.
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import regionPoster from "$lib/assets/landing/region/demo-poster.jpg?url";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";

	let {
		href,
		label,
		sub,
		video = {
			webm: "/landing/region-demo.webm",
			mp4: "/landing/region-demo.mp4",
			poster: regionPoster,
		},
	}: {
		href: string;
		label: string;
		/** The smaller line under the label. */
		sub?: string;
		video?: { webm: string; mp4: string; poster: string };
	} = $props();

	const playInView: Attachment<HTMLVideoElement> = (el) => {
		if (prefersReducedMotion()) return;
		return inView({
			threshold: 0.3,
			// Autoplay may be refused (e.g. power saving); the poster stays then.
			onEnter: () => void el.play().catch(() => {}),
			onLeave: () => el.pause(),
		})(el);
	};
</script>

<a class="dcta" {href}>
	<span class="v">
		<video
			muted
			loop
			playsinline
			preload="metadata"
			poster={video.poster}
			aria-hidden="true"
			{@attach playInView}
		>
			<source src={video.webm} type="video/webm" />
			<source src={video.mp4} type="video/mp4" />
		</video>
		<span class="live" aria-hidden="true"><i></i>Live</span>
	</span>
	<span class="l"
		>{label}{#if sub}<small>{sub}</small>{/if}</span
	>
	<em class="ar" aria-hidden="true">→</em>
</a>

<style>
	.dcta {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 16px;
		background: var(--accent);
		color: var(--ink);
		border-radius: 16px;
		padding: 8px 22px 8px 8px;
		font-size: 17px;
		font-weight: 600;
		text-decoration: none;
		transition: box-shadow 0.4s;
		box-shadow: 0 0 0 0 rgba(138, 214, 143, 0);
	}
	.dcta:hover {
		box-shadow: 0 18px 40px -16px rgba(138, 214, 143, 0.55);
	}
	.v {
		position: relative;
		width: 84px;
		height: 64px;
		border-radius: 10px;
		overflow: hidden;
		flex: none;
		background: #1e322d;
		transition:
			width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			height 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			border-radius 0.5s;
	}
	.dcta:hover .v {
		width: 168px;
		height: 126px;
		border-radius: 12px;
	}
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.v::after {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 10px;
		box-shadow: inset 0 0 0 1px rgba(30, 50, 45, 0.12);
	}
	.live {
		position: absolute;
		left: 6px;
		bottom: 6px;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: rgba(30, 50, 45, 0.72);
		color: #fff;
		font-size: 9.5px;
		font-weight: 600;
		border-radius: 999px;
		padding: 2px 6px;
		opacity: 0;
		transition: opacity 0.3s;
	}
	.dcta:hover .live {
		opacity: 1;
	}
	.live i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		animation: blink 1.6s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}
	.l {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.l small {
		font-size: 13px;
		font-weight: 500;
		opacity: 0.7;
	}
	.ar {
		font-style: normal;
		margin-left: 6px;
		transition: transform 0.25s;
	}
	.dcta:hover .ar {
		transform: translateX(4px);
	}
	@media (max-width: 640px) {
		.dcta {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live i {
			animation: none;
		}
		.v {
			transition: none;
		}
	}
</style>
