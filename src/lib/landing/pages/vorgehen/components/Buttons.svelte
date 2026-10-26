<!--
  The hero's and the contact card's two buttons (the design's .ar-btns):
  "Angebot einholen" dark, and "Demo buchen" with a small demo video (the
  design's .vbtn). The video plays while at least 30 % of it is on screen,
  never with reduced motion; server-rendered with its poster.
-->
<script lang="ts">
	import type { Attachment } from "svelte/attachments";
	import poster from "$lib/assets/landing/region/demo-poster.jpg?url";
	import { inView } from "$lib/landing/attachments/inView";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { ctas } from "../content";

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

<div class="btns">
	<a class="cta d" href={ctas.offer.href}>{ctas.offer.text}</a>
	<a class="cta vbtn" href={ctas.demo.href}>
		<span class="v">
			<video
				muted
				loop
				playsinline
				preload="metadata"
				{poster}
				aria-hidden="true"
				{@attach playInView}
			>
				<source src="/landing/region-demo.webm" type="video/webm" />
				<source src="/landing/region-demo.mp4" type="video/mp4" />
			</video>
		</span>
		<span class="l">{ctas.demo.text}</span>
		<span class="ar" aria-hidden="true">→</span>
	</a>
</div>

<style>
	.btns {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-top: 22px;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 46px;
		padding: 0 20px;
		border-radius: 11px;
		font-weight: 600;
		font-size: 15px;
		border: 1px solid var(--hair);
		background: #fff;
		color: var(--ink);
		text-decoration: none;
		transition:
			border-color 0.2s,
			background 0.25s,
			transform 0.15s;
	}
	.cta:hover {
		border-color: #c3cdc8;
	}
	.cta:active {
		transform: scale(0.98);
	}
	.cta.d {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.cta.d:hover {
		background: linear-gradient(180deg, #2a443d, #1e322d);
	}
	.cta.vbtn {
		padding: 0 16px 0 4px;
		gap: 10px;
	}
	.v {
		position: relative;
		width: 52px;
		height: 36px;
		border-radius: 8px;
		overflow: hidden;
		flex: none;
		background: var(--soft);
	}
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.l {
		display: grid;
		line-height: 1.2;
		text-align: left;
	}
	.ar {
		transition: transform 0.2s;
	}
	.vbtn:hover .ar {
		transform: translateX(3px);
	}
	@media (prefers-reduced-motion: reduce) {
		.cta,
		.ar {
			transition: none;
		}
		.cta:active,
		.vbtn:hover .ar {
			transform: none;
		}
	}
</style>
