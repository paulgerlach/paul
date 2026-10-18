<!--
  Bento "Benachrichtigungen" (`.ins`): five notification cards stacked around
  the current one, which rotate one position at a time (plan 03, 3B.4).
-->
<script lang="ts">
	import Icon from "../../components/Icon.svelte";
	import { notifications } from "../../content";

	/** Index of the card in front. */
	let front = $state(0);
	const n = notifications.length;

	function position(i: number): string {
		let k = (((i - front) % n) + n) % n;
		if (k > 2) k -= n;
		return Math.abs(k) <= 2 ? `p${k}` : "px";
	}
</script>

<div class="ins" aria-hidden="true">
	{#each notifications as item, i (i)}
		<div class={["c", position(i)]}>
			<span class={["ni", item.tone]}
				><Icon name={item.tone === "ok" ? "check" : "info"} /></span
			>
			<div><b>{item.title}</b><span>{item.sub}</span></div>
			<i class="ar"><Icon name="arrow" /></i>
		</div>
	{/each}
</div>

<style>
	.ins {
		width: min(380px, 100%);
		position: relative;
		height: 300px;
	}
	.c {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		display: flex;
		align-items: center;
		gap: 10px;
		background: #f5f7f6;
		border-radius: 12px;
		padding: 12px 14px;
		font-size: 13px;
		transition:
			transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1),
			opacity 0.7s,
			filter 0.7s,
			background 0.5s,
			color 0.5s;
	}
	.c b {
		display: block;
		font-weight: 600;
		font-size: 13.5px;
	}
	.c span:not(.ni) {
		color: var(--muted);
		font-size: 12.5px;
	}
	.ni {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ni :global(svg) {
		width: 15px;
		height: 15px;
	}
	.ni.ok {
		background: #ddf0de;
		color: #3e9a57;
	}
	.ni.in {
		background: #e3e8f5;
		color: #6282d0;
	}
	.ar {
		margin-left: auto;
		width: 28px;
		height: 28px;
		border-radius: 7px;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		flex: none;
		background: #fff;
	}
	.ar :global(svg) {
		width: 12px;
	}
	.p0 {
		transform: translateY(-50%) scale(1.03);
		background: var(--ink);
		color: #fff;
		z-index: 3;
		box-shadow: 0 18px 34px -16px rgba(0, 0, 0, 0.5);
	}
	.p0 span:not(.ni) {
		color: #b7c4bf;
	}
	.p0 .ar {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.15);
		color: #fff;
	}
	.p0 .ni {
		background: rgba(255, 255, 255, 0.1);
	}
	.p0 .ni.ok {
		color: var(--accent);
	}
	.p0 .ni.in {
		color: #afc1ee;
	}
	.p-1 {
		transform: translateY(calc(-50% - 70px)) scale(0.95);
		opacity: 0.85;
		filter: blur(0.3px);
	}
	.p1 {
		transform: translateY(calc(-50% + 70px)) scale(0.95);
		opacity: 0.85;
		filter: blur(0.3px);
	}
	.p-2 {
		transform: translateY(calc(-50% - 132px)) scale(0.88);
		opacity: 0.3;
		filter: blur(1.4px);
	}
	.p2 {
		transform: translateY(calc(-50% + 132px)) scale(0.88);
		opacity: 0.3;
		filter: blur(1.4px);
	}
	.px {
		transform: translateY(-50%) scale(0.8);
		opacity: 0;
	}
	@media (max-width: 640px) {
		.ins {
			height: 280px;
		}
	}
</style>
