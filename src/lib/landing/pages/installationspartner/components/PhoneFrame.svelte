<!--
  The white phone of rows 2 and 4 (the design's .ipx / .ipt frame): 470 px
  tall at the tile's bottom edge, with the status bar. Extra props
  (attachments) go to the frame.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		time,
		app,
		children,
		class: className = "",
		...rest
	}: {
		time: string;
		app: string;
		children: Snippet;
		class?: string;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={["phone", className]} {...rest}>
	<div class="pt"><span>{time}</span><span>{app}</span></div>
	{@render children()}
</div>

<style>
	.phone {
		width: min(300px, 82%);
		height: 470px;
		background: #fff;
		border-radius: 30px;
		padding: 14px 14px 0;
		align-self: flex-end;
		position: relative;
		top: calc(clamp(20px, 4vw, 52px) + 40px);
		box-shadow:
			0 0 0 11px rgba(255, 255, 255, 0.05),
			0 0 0 12px rgba(255, 255, 255, 0.16),
			0 30px 60px -30px rgba(0, 0, 0, 0.5);
		color: var(--ink);
	}
	.pt {
		display: flex;
		justify-content: space-between;
		font-size: 11.5px;
		font-weight: 600;
		padding: 2px 8px 12px;
	}
	@media (max-width: 640px) {
		.phone {
			width: min(280px, 90%);
		}
	}
</style>
