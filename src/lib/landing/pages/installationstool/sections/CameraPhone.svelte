<!--
  Row 2's tile (the design's .uv-phone.it-ph with .it-cam): the phone's
  camera takes the old meter, then the new one. The corners focus, the flash
  fires, a thumbnail drops into the strip, and the flat ends "digitalisiert".
  A pass every 9.5 s while at least 40 % of it is in view; stopping leaves
  it done. Server-rendered done (the design's reduced-motion state). The
  phone is centred and whole, as #it-css intends; the design's template
  script drops its .it-ph class when the row shows (plan, Key decisions).
  The tile is hidden from screen readers (Rows).
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import {
		CAMERA_END,
		CAMERA_EVERY,
		CAMERA_START,
		CAMERA_STEPS,
		type CameraState,
	} from "../camera";
	import { camera } from "../content";

	let cam = $state<CameraState>(CAMERA_END);

	/** One pass of the design's timeline; stopping leaves the end state. */
	function run() {
		cam = CAMERA_START;
		const timers = CAMERA_STEPS.map(({ at, state }) =>
			setTimeout(() => (cam = state), at),
		);
		return () => {
			timers.forEach(clearTimeout);
			cam = CAMERA_END;
		};
	}
</script>

{#snippet oldMeter()}
	<svg viewBox="0 0 120 150" class="m old">
		<rect
			x="30"
			y="8"
			width="60"
			height="134"
			rx="10"
			fill="#F4F1EA"
			stroke="#C9C3B5"
			stroke-width="2"
		/>
		<rect
			x="46"
			y="26"
			width="28"
			height="92"
			rx="5"
			fill="#fff"
			stroke="#BDB6A6"
			stroke-width="1.5"
		/>
		<rect
			x="56"
			y="34"
			width="8"
			height="78"
			rx="4"
			fill="#EFEDE6"
			stroke="#CFC9BC"
		/>
		<rect x="56" y="70" width="8" height="42" rx="4" fill="#D9544A" />
		{#each [36, 44, 52, 60, 68, 76, 84, 92, 100, 108] as y (y)}
			<line x1="48" y1={y} x2="53" y2={y} stroke="#9C9586" stroke-width="1.2" />
		{/each}
		<circle cx="60" cy="130" r="4" fill="#BDB6A6" />
	</svg>
{/snippet}

{#snippet newMeter()}
	<svg viewBox="0 0 120 150" class="m new">
		<rect
			x="26"
			y="14"
			width="68"
			height="122"
			rx="12"
			fill="#fff"
			stroke="#C8D2CD"
			stroke-width="2"
		/>
		<rect x="36" y="34" width="48" height="26" rx="4" fill="#1E322D" />
		<text x="60" y="52" text-anchor="middle" font-size="13" fill="#8AD68F"
			>{camera.reading}</text
		>
		<path
			d="M50 84a14 14 0 0 1 20 0M54 90a8 8 0 0 1 12 0"
			fill="none"
			stroke="#8AD68F"
			stroke-width="2.4"
			stroke-linecap="round"
		/>
		<circle cx="60" cy="96" r="2.6" fill="#8AD68F" />
		<rect x="44" y="112" width="32" height="5" rx="2.5" fill="#E4E8E6" />
	</svg>
{/snippet}

<div
	class="phone it-ph"
	{@attach loopInView({ run, every: CAMERA_EVERY, threshold: 0.4 })}
>
	<div class="pt"><span>{camera.time}</span><span>{camera.app}</span></div>
	<div
		class={[
			"cam",
			cam.photo >= 2 && "s2",
			cam.photo === 3 && "s3",
			cam.focus && "fx",
			cam.flash && "fl",
			cam.thumbs >= 1 && "t1",
			cam.thumbs >= 2 && "t2",
		]}
	>
		<div class="lbl">
			<span class="a">{camera.labels[0]}</span>
			<span class="b">{camera.labels[1]}</span>
		</div>
		<div class="vf">
			<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>
			{@render oldMeter()}
			{@render newMeter()}
			<div class="fl"></div>
		</div>
		<div class="st">
			<span class="th o">{@render oldMeter()}</span>
			<span class="th n">{@render newMeter()}</span>
			<span class="sh"></span>
		</div>
		<div class="ok">
			<span class="ck">
				<svg viewBox="0 0 12 10" width="10" aria-hidden="true">
					<path
						d="M1 5l3.5 3.5L11 1"
						stroke="#1E322D"
						stroke-width="2"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
			{camera.done}
		</div>
	</div>
</div>

<style>
	/* The template's phone (.uv-phone) with #it-css's .it-ph */
	.phone {
		width: min(300px, 82%);
		background: #fff;
		border-radius: 30px;
		padding: 14px 14px 18px;
		align-self: center;
		position: relative;
		top: 0;
		box-shadow:
			0 0 0 11px rgba(255, 255, 255, 0.05),
			0 0 0 12px rgba(255, 255, 255, 0.16),
			0 30px 60px -30px rgba(0, 0, 0, 0.5);
	}
	:global(.tile:has(.it-ph)) {
		min-height: 480px;
	}
	.pt {
		display: flex;
		justify-content: space-between;
		font-size: 11.5px;
		font-weight: 600;
		padding: 2px 8px 12px;
	}

	.cam {
		margin-top: 12px;
	}
	.lbl {
		position: relative;
		height: 20px;
		font-size: 12px;
		font-weight: 500;
		color: var(--muted);
	}
	.lbl span {
		position: absolute;
		left: 0;
		top: 0;
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.lbl .b {
		opacity: 0;
		transform: translateY(6px);
	}
	.s2 .lbl .a {
		opacity: 0;
		transform: translateY(-6px);
	}
	.s2 .lbl .b {
		opacity: 1;
		transform: none;
	}

	.vf {
		position: relative;
		margin-top: 8px;
		height: 170px;
		border-radius: 16px;
		background: #eef1ef;
		overflow: hidden;
	}
	.vf > i {
		position: absolute;
		width: 22px;
		height: 22px;
		border: 2.5px solid #1e322d;
		opacity: 0.55;
		transition:
			inset 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.3s;
	}
	.vf .c1 {
		left: 28px;
		top: 18px;
		border-right: 0;
		border-bottom: 0;
		border-radius: 6px 0 0 0;
	}
	.vf .c2 {
		right: 28px;
		top: 18px;
		border-left: 0;
		border-bottom: 0;
		border-radius: 0 6px 0 0;
	}
	.vf .c3 {
		left: 28px;
		bottom: 18px;
		border-right: 0;
		border-top: 0;
		border-radius: 0 0 0 6px;
	}
	.vf .c4 {
		right: 28px;
		bottom: 18px;
		border-left: 0;
		border-top: 0;
		border-radius: 0 0 6px 0;
	}
	.fx .vf .c1 {
		left: 46px;
		top: 28px;
	}
	.fx .vf .c2 {
		right: 46px;
		top: 28px;
	}
	.fx .vf .c3 {
		left: 46px;
		bottom: 28px;
	}
	.fx .vf .c4 {
		right: 46px;
		bottom: 28px;
	}
	.fx .vf > i {
		opacity: 1;
		border-color: #3e8e46;
	}
	.vf .m {
		position: absolute;
		left: 50%;
		top: 50%;
		height: 150px;
		width: auto;
		transform: translate(-50%, -50%) scale(0.96);
		transition:
			opacity 0.5s,
			transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.vf .m.new {
		opacity: 0;
		transform: translate(-50%, -40%) scale(0.96);
	}
	.s2 .vf .m.old {
		opacity: 0;
		transform: translate(-50%, -60%) scale(0.96);
	}
	.s2 .vf .m.new {
		opacity: 1;
		transform: translate(-50%, -50%) scale(0.96);
	}
	/* .lp * sets Geist on every element; the display keeps the design's mono. */
	.cam text {
		font-family: ui-monospace, monospace;
	}
	.vf .fl {
		position: absolute;
		inset: 0;
		background: #fff;
		opacity: 0;
		pointer-events: none;
	}
	.cam.fl .vf .fl {
		animation: flash 0.45s ease-out;
	}
	@keyframes flash {
		0% {
			opacity: 0.95;
		}
		100% {
			opacity: 0;
		}
	}

	.st {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
	}
	.st .th {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		background: #eef1ef;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		opacity: 0;
		transform: scale(0.6);
		transition:
			opacity 0.35s,
			transform 0.45s cubic-bezier(0.3, 1.4, 0.5, 1);
	}
	.st .th :global(svg) {
		height: 36px;
		width: auto;
	}
	.t1 .st .o,
	.t2 .st .n {
		opacity: 1;
		transform: none;
	}
	.st .sh {
		margin-left: auto;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 3px solid #1e322d;
		box-shadow: inset 0 0 0 3px #fff;
		background: #1e322d;
		transition: transform 0.15s;
	}
	.cam.fl .st .sh {
		transform: scale(0.88);
	}

	.ok {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		font-size: 13px;
		font-weight: 500;
		background: #eef6ef;
		border-radius: 12px;
		padding: 10px 12px;
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.ok .ck {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #8ad68f;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ok .ck svg {
		width: 11px;
		height: 11px;
	}
	.s3 .ok {
		opacity: 1;
		transform: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.cam *,
		.cam .vf .fl {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
