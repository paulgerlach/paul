<!--
  One of the preview's top-bar menus (portfolio, period, share, account): a
  disclosure button and its popup, rendered only while open. Escape, a click
  outside or picking an entry closes it (plan 03, 3A.2).
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import { clickOutside } from "$lib/attachments/clickOutside";
	import type { Menu } from "./demo.svelte";
	import { getDemo } from "./demo.svelte";

	let {
		menu,
		label,
		buttonClass = "sel",
		align = "left",
		class: className = "",
		button,
		children,
	}: {
		menu: Menu;
		/** Accessible name of the popup. */
		label: string;
		buttonClass?: string;
		align?: "left" | "right" | "up";
		class?: string;
		button: Snippet;
		children: Snippet;
	} = $props();

	const demo = getDemo();
	const uid = $props.id();
	const open = $derived(demo.openMenu === menu);
	let trigger = $state<HTMLButtonElement>();

	function close(focus = true) {
		if (demo.openMenu === menu) demo.openMenu = null;
		if (focus) trigger?.focus();
	}

	// Picking an entry removes the popup with the focused button in it:
	// send focus back to the menu's button (a click outside keeps its target).
	let wasOpen = false;
	$effect(() => {
		const isOpen = open;
		if (wasOpen && !isOpen) {
			const active = document.activeElement;
			if (!active || active === document.body) trigger?.focus();
		}
		wasOpen = isOpen;
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key === "Escape" && open) {
			event.stopPropagation();
			close();
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={["dd", open && "open", className]}
	{onkeydown}
	{@attach clickOutside(() => open && close(false))}
>
	<button
		bind:this={trigger}
		type="button"
		class={buttonClass}
		aria-expanded={open}
		aria-controls="{uid}-pop"
		onclick={() => demo.toggleMenu(menu)}
	>
		{@render button()}
	</button>
	{#if open}
		<div class={["pop", align]} id="{uid}-pop" role="group" aria-label={label}>
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.dd {
		position: relative;
		min-width: 0;
	}
	.pop {
		position: absolute;
		top: calc(100% + 8px);
		left: 0;
		min-width: 270px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		box-shadow: 0 24px 50px -18px rgba(30, 50, 45, 0.4);
		padding: 6px;
		z-index: 30;
		animation: pop-in 0.18s ease both;
		max-height: 360px;
		overflow: auto;
	}
	.pop.right {
		left: auto;
		right: 0;
	}
	.pop.up {
		top: auto;
		bottom: calc(100% + 6px);
	}
	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	.open > button :global(svg:last-child) {
		transform: rotate(180deg);
	}
	@media (max-width: 640px) {
		.pop {
			position: fixed;
			left: 12px;
			right: 12px;
			top: auto;
			min-width: 0;
			margin-top: 8px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation: none;
		}
	}
</style>
