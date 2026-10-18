<!--
  The design's `.db-pill`: a section's small label with its icon, or with the
  pinging live dot in the hero (plan README, Eyebrow pills).
-->
<script lang="ts">
	import type { IconName } from "../icons";
	import Icon from "./Icon.svelte";

	let {
		text,
		icon,
		live = false,
		class: className = "",
	}: {
		text: string;
		icon?: IconName;
		live?: boolean;
		class?: string;
	} = $props();
</script>

<span class={["pill", className]}>
	{#if live}
		<i class="live" aria-hidden="true"></i>
	{:else if icon}
		<Icon name={icon} />
	{/if}
	{text}
</span>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.3;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	.pill:hover :global(svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	.live {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ok);
		position: relative;
		transform-origin: center;
	}
	.live::after {
		content: "";
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		border: 2px solid var(--ok);
		opacity: 0;
		animation: db-ping 2.2s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;
	}
	.pill:hover .live {
		animation: pfx-ping 0.9s ease-out;
	}
	@keyframes db-ping {
		0% {
			transform: scale(0.5);
			opacity: 0.7;
		}
		100% {
			transform: scale(1.9);
			opacity: 0;
		}
	}
	@keyframes pfx-ping {
		0% {
			box-shadow: 0 0 0 0 rgba(47, 158, 68, 0.45);
			transform: scale(1);
		}
		40% {
			transform: scale(1.25);
		}
		100% {
			box-shadow: 0 0 0 9px rgba(47, 158, 68, 0);
			transform: scale(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live::after,
		.pill:hover .live {
			animation: none;
		}
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
