<!--
  A phone cut off at the card's bottom edge (the design's .iq-dm.ph .iq-ph),
  centred in its card's picture area. Extra props (attachments, classes) go
  to the phone.
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

<div class={["ph", className]} {...rest}>
	<div class="n"></div>
	{@render children()}
</div>

<style>
	.ph {
		position: absolute;
		left: 50%;
		translate: -50% 0;
		top: 8px;
		width: min(300px, 72%);
		height: 440px;
		background: #fff;
		border: 9px solid #f7f8f7;
		outline: 1px solid rgba(30, 50, 45, 0.1);
		border-radius: 46px 46px 0 0;
		border-bottom: 0;
		padding: 16px 18px 0;
		box-sizing: border-box;
		overflow: hidden;
	}
	.n {
		width: 72px;
		height: 16px;
		border-radius: 10px;
		background: #eef1ef;
		margin: 0 auto 12px;
	}
	@media (max-width: 560px) {
		.ph {
			width: 86%;
		}
	}
</style>
