<!--
  The scroll scene (.pv-scene): a sticky frame in a tall section. Scrolling
  through it widens the frame, zooms the flat towards its kitchen, blurs it
  into the open cabinet with the radio meters, changes the captions and shows
  three signal points and tags that open an info card. The math is
  `scene.ts`; the styles are set on the layers per frame, the captions,
  points and tags are state that changes only at the thresholds.

  The server renders the start state at full height, which is what the
  script computes at the top of the page. Without JS or with reduced motion
  the section is short and shows its end state (CSS below), as the design
  does with reduced motion.
-->
<script lang="ts">
	import { onMount, tick } from "svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { scene as t, type InfoEntry } from "../content";
	import { aimX, clamp, coverX, progress, sceneState } from "../scene";
	import InfoCard from "./InfoCard.svelte";

	let section = $state<HTMLElement>();
	let frame = $state<HTMLElement>();
	let room = $state<HTMLElement>();
	let meter = $state<HTMLElement>();
	let bar = $state<HTMLElement>();
	let card = $state<HTMLElement>();
	const sigs: HTMLElement[] = $state([]);

	let caption = $state(0);
	let signals = $state(false);
	let tags = $state(0);

	/** The open info entry (-1: none), and the card's content and place. */
	let act = $state(-1);
	let entry = $state<InfoEntry>();
	let open = $state(false);
	let x = $state(16);
	let y = $state(16);

	function apply(p: number) {
		if (!section || !frame || !room || !meter || !bar) return;
		const s = sceneState(p);
		frame.style.setProperty("--fw", `${s.frameWidth}%`);
		frame.style.setProperty("--fr", `${s.frameRadius}px`);
		// The layers are sized by CSS to cover the frame; read them after the
		// frame's new width.
		const layer = {
			left: room.offsetLeft,
			width: room.offsetWidth,
			frame: frame.clientWidth,
		};
		const rx = coverX(layer, 0.81, s.roomScale, aimX(layer, 0.81) * s.roomZoom);
		room.style.transform = `translateX(${rx.toFixed(1)}px) scale(${s.roomScale})`;
		room.style.filter =
			s.roomBlur > 0 ? `blur(${s.roomBlur.toFixed(1)}px)` : "none";
		room.style.opacity = s.roomOpacity.toFixed(3);
		const mx = coverX(layer, 0.71, s.meterScale, aimX(layer, 0.72));
		meter.style.opacity = s.meterOpacity.toFixed(3);
		meter.style.transform = `translateX(${mx.toFixed(1)}px) scale(${s.meterScale})`;
		meter.style.filter =
			s.meterBlur > 0 ? `blur(${s.meterBlur.toFixed(1)}px)` : "none";
		bar.style.width = `${p * 100}%`;
		caption = s.caption;
		signals = s.signals;
		tags = s.tags;
		if (act >= 0) {
			if (!signals) close();
			else place(act);
		}
	}

	/** Puts the card beside point `k`, inside the frame. */
	function place(k: number) {
		const point = sigs[k];
		if (!point || !frame || !card) return;
		const d = point.getBoundingClientRect();
		const f = frame.getBoundingClientRect();
		const w = card.offsetWidth;
		const h = card.offsetHeight;
		let left = d.left - f.left + 24;
		if (left + w > f.width - 16) left = d.left - f.left - w - 24;
		x = clamp(left, 16, f.width - w - 16);
		y = clamp(d.top - f.top - h / 2, 16, f.height - h - 16);
	}

	async function show(k: number) {
		act = k;
		entry = t.info[k];
		await tick();
		place(k);
		requestAnimationFrame(() => (open = act === k));
	}

	function close() {
		act = -1;
		open = false;
		setTimeout(() => {
			if (act < 0) entry = undefined;
		}, 250);
	}

	function hover(k: number) {
		if (matchMedia("(hover: hover)").matches) show(k);
	}

	function onDocumentClick(e: MouseEvent) {
		if (act < 0 || !(e.target instanceof Element)) return;
		if (card?.contains(e.target) || e.target.closest(".point, .tag")) return;
		close();
	}

	onMount(() => {
		const setTop = () => {
			const nav = document.querySelector("nav.top");
			const h = nav ? Math.round(nav.getBoundingClientRect().height) : 64;
			section?.style.setProperty("--top", `${h}px`);
		};
		setTop();
		if (prefersReducedMotion()) {
			const onResize = () => apply(1);
			apply(1);
			addEventListener("resize", onResize);
			return () => removeEventListener("resize", onResize);
		}
		let frameId = 0;
		const update = () => {
			frameId = 0;
			if (!section) return;
			const r = section.getBoundingClientRect();
			apply(progress(r.top, section.offsetHeight, innerHeight));
		};
		const onScroll = () => {
			if (!frameId) frameId = requestAnimationFrame(update);
		};
		const onResize = () => {
			setTop();
			onScroll();
		};
		update();
		addEventListener("scroll", onScroll, { passive: true });
		addEventListener("resize", onResize);
		return () => {
			cancelAnimationFrame(frameId);
			removeEventListener("scroll", onScroll);
			removeEventListener("resize", onResize);
		};
	});
</script>

<svelte:document
	onclick={onDocumentClick}
	onkeydown={(e) => e.key === "Escape" && act >= 0 && close()}
/>

<section
	class={[
		"scene",
		signals && "sig",
		tags >= 1 && "t1",
		tags >= 2 && "t2",
		tags >= 3 && "t3",
	]}
	aria-label={t.label}
	bind:this={section}
>
	<div class="stick">
		<div class="frame" bind:this={frame}>
			<div class="l room" role="img" aria-label={t.room} bind:this={room}></div>
			<div class="l meter" role="group" aria-label={t.meter} bind:this={meter}>
				{#each t.points as label, k (label)}
					<button
						type="button"
						class={["point", `s${k + 1}`, act === k && "act"]}
						aria-label={label}
						tabindex={signals ? 0 : -1}
						bind:this={sigs[k]}
						onclick={() => show(k)}
						onmouseenter={() => hover(k)}
					></button>
				{/each}
			</div>
			<div class="cap" aria-live="polite">
				{#each t.captions as c, i (c.title)}
					<div class={["c", caption === i && "on"]} aria-hidden={caption !== i}>
						<b>{c.title}</b><span>{c.text}</span>
					</div>
				{/each}
			</div>
			<div class="tags">
				{#each t.tags as tag, k (tag)}
					<button
						type="button"
						class={["tag", `t${k + 1}`, act === k && "act"]}
						tabindex={tags > k ? 0 : -1}
						onclick={() => show(k)}><i></i>{tag}</button
					>
				{/each}
				<span class="hint">{t.hint}</span>
			</div>
			<InfoCard
				{entry}
				{open}
				{x}
				{y}
				closeLabel={t.close}
				onclose={close}
				bind:el={card}
			/>
			<div class="prog" aria-hidden="true"><i bind:this={bar}></i></div>
		</div>
	</div>
</section>

<style>
	.scene {
		position: relative;
		height: 340vh;
	}
	.stick {
		position: sticky;
		top: var(--top);
		height: calc(100vh - var(--top));
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 8px 0 16px;
	}
	.frame {
		position: relative;
		width: var(--fw, 88%);
		height: 100%;
		border-radius: var(--fr, 28px);
		overflow: hidden;
		background: #d9d2c6;
		will-change: width;
		/* The layers size themselves to the frame (cover, 3:2). */
		container-type: size;
	}
	.l {
		position: absolute;
		width: max(100cqw, 150cqh);
		aspect-ratio: 3 / 2;
		left: calc((100cqw - max(100cqw, 150cqh)) / 2);
		top: calc((100cqh - max(100cqw, 150cqh) / 1.5) / 2);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		will-change: transform, opacity, filter;
	}
	.room {
		background-image: var(--img-room);
		transform-origin: 81% 83%;
	}
	.meter {
		background-image: var(--img-meter);
		transform-origin: 71% 66%;
		opacity: 0;
	}

	/* The signal points, placed on the photo's meters */
	.point {
		border: 0;
		padding: 0;
		cursor: pointer;
		pointer-events: none;
		position: absolute;
		width: 0.9%;
		min-width: 14px;
		min-height: 14px;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #7fe3c4;
		box-shadow: 0 0 0 2px rgba(127, 227, 196, 0.35);
		opacity: 0;
		transform: translate(-50%, -50%) scale(0.6);
		transition:
			opacity 0.5s,
			transform 0.5s;
	}
	.point::before,
	.point::after {
		content: "";
		position: absolute;
		inset: -120%;
		border-radius: 50%;
		border: 1.5px solid #7fe3c4;
		opacity: 0;
	}
	.sig .point {
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
		pointer-events: auto;
	}
	.point:hover,
	.point.act {
		background: #fff;
		box-shadow:
			0 0 0 3px #7fe3c4,
			0 0 0 9px rgba(127, 227, 196, 0.3);
	}
	.point:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 4px;
	}
	.sig .point::before {
		animation: pv-wave 2s ease-out infinite;
	}
	.sig .point::after {
		animation: pv-wave 2s ease-out 1s infinite;
	}
	@keyframes pv-wave {
		0% {
			opacity: 0.9;
			transform: scale(0.3);
		}
		100% {
			opacity: 0;
			transform: scale(2.2);
		}
	}
	.s1 {
		left: 67.9%;
		top: 59.9%;
	}
	.s2 {
		left: 70.2%;
		top: 54.2%;
		transition-delay: 0.15s;
	}
	.s3 {
		left: 77%;
		top: 70.5%;
		transition-delay: 0.3s;
	}

	/* Captions */
	.cap {
		position: absolute;
		left: clamp(16px, 3vw, 40px);
		bottom: clamp(28px, 4vw, 52px);
		z-index: 3;
		width: min(520px, calc(100% - 32px));
	}
	.c {
		position: absolute;
		left: 0;
		bottom: 0;
		width: max-content;
		max-width: 100%;
		background: rgba(20, 34, 30, 0.72);
		backdrop-filter: blur(8px);
		border-radius: 16px;
		padding: 16px 20px;
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.5s,
			transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
		pointer-events: none;
	}
	.c.on {
		opacity: 1;
		transform: none;
	}
	.c b {
		display: block;
		font-size: clamp(20px, 2.2vw, 30px);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.15;
	}
	.c span {
		display: block;
		color: rgba(255, 255, 255, 0.78);
		font-size: clamp(14px, 1.15vw, 16px);
		margin-top: 6px;
		line-height: 1.4;
	}

	/* Tags */
	.tags {
		position: absolute;
		right: clamp(14px, 3vw, 36px);
		top: clamp(14px, 3vw, 36px);
		z-index: 3;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		pointer-events: none;
	}
	.tag {
		border: 0;
		font-family: inherit;
		cursor: pointer;
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		color: var(--ink);
		border-radius: 999px;
		padding: 8px 14px 8px 10px;
		font-size: 13.5px;
		font-weight: 600;
		box-shadow: 0 10px 24px -14px rgba(0, 0, 0, 0.45);
		opacity: 0;
		transform: translateX(16px);
		transition:
			opacity 0.45s,
			transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.tag i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3e9a57;
		box-shadow: 0 0 0 3px rgba(62, 154, 87, 0.2);
	}
	.tag:hover,
	.tag.act {
		background: var(--accent);
	}
	.t1 .tag.t1,
	.t2 .tag.t2,
	.t3 .tag.t3 {
		opacity: 1;
		transform: none;
	}
	.hint {
		font-size: 12px;
		color: #fff;
		background: rgba(20, 34, 30, 0.6);
		border-radius: 999px;
		padding: 5px 10px;
		opacity: 0;
		transition: opacity 0.4s 0.3s;
	}
	.t3 .hint {
		opacity: 1;
	}

	.prog {
		position: absolute;
		left: clamp(16px, 3vw, 40px);
		right: clamp(16px, 3vw, 40px);
		bottom: 12px;
		height: 3px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.25);
		z-index: 3;
		overflow: hidden;
	}
	.prog i {
		display: block;
		height: 100%;
		width: 0;
		background: #fff;
		border-radius: 2px;
	}

	@media (max-width: 620px) {
		.scene {
			height: 300vh;
		}
		.tags {
			top: 14px;
			right: 12px;
		}
		.tag {
			font-size: 12px;
			padding: 6px 11px 6px 8px;
		}
		.c {
			padding: 12px 14px;
		}
		.hint {
			display: none;
		}
	}

	/* Without JS and with reduced motion: short, in its end state (the
	   design's reduced-motion state). With JS the script sets the same. */
	@media (scripting: none), (prefers-reduced-motion: reduce) {
		.scene {
			height: auto;
		}
		.stick {
			position: relative;
			height: 70vh;
		}
		.frame {
			width: 100%;
			border-radius: 16px;
		}
		.room {
			opacity: 0;
		}
		.meter {
			opacity: 1;
			transform: scale(1.7);
		}
		.c {
			opacity: 0;
			transition: none;
		}
		.c:last-child {
			opacity: 1;
			transform: none;
		}
		.point {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
			pointer-events: auto;
			transition: none;
		}
		.point::before,
		.point::after {
			animation: none !important;
		}
		.tag {
			opacity: 1;
			transform: none;
			transition: none;
		}
		.hint {
			opacity: 1;
			transition: none;
		}
	}
</style>
