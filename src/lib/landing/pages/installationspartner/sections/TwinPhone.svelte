<!--
  Row 2's tile (the design's #ipx): the property on the phone, then its
  flats. Every 10.5 s in view the photo settles, the facts fade up, the
  cursor taps "Wohnungen ansehen" and the flat list slides in. The server
  renders the list (the design's reduced-motion state).
-->
<script lang="ts">
	import facade from "$lib/assets/landing/installationspartner/facade.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Icon from "$lib/landing/sections/uv/Icon.svelte";
	import PhoneFrame from "../components/PhoneFrame.svelte";
	import { twin } from "../content";

	/** The design's classes: a (first screen shown), go (cursor), tap, b (flat list). */
	let a = $state(true);
	let go = $state(false);
	let tap = $state(false);
	let b = $state(true);

	function run() {
		a = go = tap = b = false;
		const timers = [
			setTimeout(() => (a = true), 300),
			setTimeout(() => (go = true), 2600),
			setTimeout(() => (tap = true), 3300),
			setTimeout(() => {
				tap = go = false;
				b = true;
			}, 3550),
		];
		return () => timers.forEach(clearTimeout);
	}
</script>

<PhoneFrame
	time={twin.time}
	app={twin.app}
	class={["ipx", a && "a", go && "go", tap && "tap", b && "b"]
		.filter(Boolean)
		.join(" ")}
	{@attach loopInView({ run, every: 10500, threshold: 0.3 })}
>
	<div class="vp">
		<div class="s sa">
			<figure class="img">
				<Image src={facade} alt="" sizes="272px" />
				<span class="badge">{twin.badge}</span>
			</figure>
			<b class="t">{twin.title}</b>
			<small class="st">{twin.sub}</small>
			<div class="f">
				{#each twin.facts as fact (fact.label)}
					<div><small>{fact.label}</small><b>{fact.value}</b></div>
				{/each}
			</div>
			<span class="see">{twin.button} <i>→</i></span>
			<span class="pointer">
				<svg viewBox="0 0 18 22"
					><path
						d="M2 1.5v16.5l4.3-4 2.8 6.5 3-1.3-2.8-6.3h6z"
						fill="#1E322D"
						stroke="#fff"
						stroke-width="1.4"
						stroke-linejoin="round"
					/></svg
				>
			</span>
		</div>
		<div class="s sb">
			<div class="bk">{twin.back}</div>
			<div class="nt">
				<span class="ni"><Icon name="bell" /></span>
				<span><b>{twin.noteTitle}</b><small>{twin.noteSub}</small></span>
			</div>
			<div class="ul">
				{#each twin.units as unit (unit.name)}
					<div class={["u", unit.state]}>
						<span>{unit.name}</span>
						<small>{unit.note}</small>
						<em>{unit.badge ?? ""}</em>
					</div>
				{/each}
			</div>
		</div>
	</div>
</PhoneFrame>

<style>
	.vp {
		position: relative;
		height: calc(100% - 34px);
		overflow: hidden;
	}
	.s {
		position: absolute;
		inset: 0;
		transition:
			transform 0.6s cubic-bezier(0.65, 0, 0.35, 1),
			opacity 0.6s;
	}
	.sb {
		transform: translateX(104%);
	}
	:global(.ipx.b) .sa {
		transform: translateX(-30%);
		opacity: 0;
	}
	:global(.ipx.b) .sb {
		transform: none;
	}

	/* Screen a: the property */
	.img {
		margin: 0;
		position: relative;
		height: 150px;
		border-radius: 16px;
		overflow: hidden;
		background: #e9eeeb;
	}
	.img :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transform: scale(1.08);
		transition: transform 2.6s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	:global(.ipx.a) .img :global(img) {
		transform: none;
	}
	.badge {
		position: absolute;
		left: 10px;
		top: 10px;
		background: rgba(255, 255, 255, 0.92);
		border-radius: 999px;
		padding: 3px 9px;
		font-size: 10.5px;
		font-weight: 600;
	}
	.t {
		display: block;
		font-size: 17px;
		font-weight: 600;
		margin-top: 12px;
	}
	.st {
		display: block;
		font-size: 11.5px;
		color: #7a8783;
		margin-top: 2px;
	}
	.f {
		display: grid;
		grid-template-columns: 1fr;
		gap: 6px;
		margin-top: 12px;
	}
	.f div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f3f5f4;
		border-radius: 10px;
		padding: 8px 10px;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.f small {
		font-size: 11px;
		color: #7a8783;
	}
	.f b {
		font-size: 12.5px;
		font-weight: 600;
	}
	:global(.ipx.a) .f div {
		opacity: 1;
		transform: none;
	}
	:global(.ipx.a) .f div:nth-child(2) {
		transition-delay: 0.15s;
	}
	:global(.ipx.a) .f div:nth-child(3) {
		transition-delay: 0.3s;
	}
	.see {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		background: var(--ink);
		color: #fff;
		border-radius: 11px;
		padding: 10px;
		font-size: 12.5px;
		font-weight: 600;
		transition:
			transform 0.15s,
			background 0.2s;
	}
	.see i {
		font-style: normal;
		color: #8ad68f;
	}
	:global(.ipx.tap) .see {
		transform: scale(0.95);
		background: #2c4740;
	}
	.pointer {
		position: absolute;
		right: 26%;
		bottom: 6px;
		width: 20px;
		opacity: 0;
		transform: translate(30px, 30px);
		transition:
			opacity 0.3s,
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.pointer svg {
		display: block;
		width: 20px;
		height: auto;
	}
	:global(.ipx.go) .pointer {
		opacity: 1;
		transform: none;
	}

	/* Screen b: the flats */
	.bk {
		font-size: 11.5px;
		font-weight: 600;
		color: #3e9a57;
		padding: 0 2px 8px;
	}
	.nt {
		display: flex;
		gap: 10px;
		align-items: center;
		background: #eef6ef;
		border-radius: 14px;
		padding: 10px 12px;
		margin-bottom: 10px;
	}
	.ni {
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--ink);
		color: #8ad68f;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ni :global(svg) {
		width: 15px;
		height: 15px;
	}
	.nt b {
		display: block;
		font-size: 12.5px;
	}
	.nt small {
		display: block;
		font-size: 11px;
		color: #7a8783;
	}
	.ul {
		display: grid;
		gap: 6px;
		text-align: left;
	}
	.u {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 2px 8px;
		align-items: center;
		background: #fff;
		border: 1px solid #e5e9e7;
		border-radius: 10px;
		padding: 8px 10px;
		color: var(--ink);
		opacity: 0;
		transform: translateY(8px);
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	:global(.ipx.b) .u {
		opacity: 1;
		transform: none;
	}
	:global(.ipx.b) .u:nth-child(1) {
		transition-delay: 0.45s;
	}
	:global(.ipx.b) .u:nth-child(2) {
		transition-delay: 0.6s;
	}
	:global(.ipx.b) .u:nth-child(3) {
		transition-delay: 0.75s;
	}
	:global(.ipx.b) .u:nth-child(4) {
		transition-delay: 0.9s;
	}
	.u span {
		font-size: 12px;
		font-weight: 600;
	}
	.u small {
		grid-column: 1;
		font-size: 10.5px;
		color: #7a8783;
		line-height: 1.3;
	}
	.u em {
		grid-row: 1/3;
		grid-column: 2;
		font-style: normal;
		font-size: 11px;
		font-weight: 700;
		min-width: 26px;
		height: 22px;
		border-radius: 999px;
		display: grid;
		place-items: center;
		padding: 0 6px;
		background: #eef1ef;
		color: #5b6b66;
	}
	.u em:empty {
		display: none;
	}
	.u.ok em {
		background: #3e9a57;
		color: #fff;
	}
	.u.cur {
		border-color: #8ad68f;
		box-shadow: 0 0 0 3px rgba(138, 214, 143, 0.3);
	}
	.u.cur em {
		background: #8ad68f;
		color: var(--ink);
	}
</style>
