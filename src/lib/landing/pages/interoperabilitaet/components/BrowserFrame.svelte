<!--
  A browser window running off the card's right and bottom edges (the
  design's .iq-dm.br .iq-bw) with its three dots. Extra props (attachments,
  classes) go to the content area; a card sets its padding through
  `--bw-pad` / `--bw-pad-s` (below 560 px).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		children,
		class: className = "",
		...rest
	}: { children: Snippet } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="bw">
	<div class="bar"><i></i><i></i><i></i></div>
	<div class={["in", className]} {...rest}>{@render children()}</div>
</div>

<style>
	.bw {
		position: absolute;
		left: clamp(24px, 8%, 56px);
		right: -40px;
		top: 40px;
		bottom: -30px;
		background: #fff;
		border: 1px solid rgba(30, 50, 45, 0.12);
		border-radius: 10px 0 0 0;
		overflow: hidden;
	}
	.bar {
		height: 26px;
		background: #f7f8f7;
		border-bottom: 1px solid rgba(30, 50, 45, 0.08);
		display: flex;
		gap: 6px;
		align-items: center;
		padding: 0 12px;
	}
	.bar i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #dde2df;
	}
	.in {
		padding: var(--bw-pad, 24px 64px 0 28px);
	}
	@media (max-width: 560px) {
		.in {
			padding: var(--bw-pad-s, 20px 50px 0 18px);
		}
	}
</style>
