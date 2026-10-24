<!--
  The hero's middle panel on a `uv` page: a white app window with the
  portal's sidebar (logo, nav, foot) on a mint panel. The window is hidden
  from screen readers; `sr` gives them its content in words. Extra props
  (attachments) go to the panel.
-->
<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import Icon from "./Icon.svelte";
	import type { AppNavItem } from "./types";

	let {
		label,
		brand,
		nav,
		navFoot,
		children,
		sr,
		...rest
	}: {
		/** The panel's accessible name. */
		label: string;
		brand: string;
		/** The first item is the active one. */
		nav: AppNavItem[];
		navFoot: string;
		children: Snippet;
		sr: Snippet;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<figure class="pk mid" aria-label={label} {...rest}>
	<div class="app" aria-hidden="true">
		<div class="side">
			<b class="logo">
				<svg viewBox="0 0 14 14"
					><rect x="1" y="2" width="3" height="10" rx="1.5" /><rect
						x="5.5"
						y="2"
						width="3"
						height="10"
						rx="1.5"
					/><rect x="10" y="2" width="3" height="10" rx="1.5" /></svg
				>
				{brand}
			</b>
			{#each nav as item, i (item.text)}
				<span class={[i === 0 && "on"]}
					><Icon name={item.icon} />{item.text}</span
				>
			{/each}
			<small>{navFoot}</small>
		</div>
		<div class="main">{@render children()}</div>
	</div>
	{@render sr()}
</figure>

<style>
	.pk {
		margin: 0;
		border-radius: 26px;
		overflow: hidden;
		height: clamp(360px, 42vw, 600px);
		position: relative;
	}
	.mid {
		background: #e4efe6;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding: clamp(24px, 5vw, 72px) clamp(18px, 4vw, 64px) 0;
	}
	.app {
		width: 100%;
		max-width: 820px;
		background: #fff;
		color: var(--ink);
		border-radius: 14px 14px 0 0;
		display: grid;
		grid-template-columns: 150px minmax(0, 1fr);
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.55);
		min-height: 86%;
	}
	.side {
		border-right: 1px solid var(--hair);
		padding: 14px 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: 12.5px;
		color: var(--muted);
	}
	.logo {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 15px;
		color: var(--ink);
		font-weight: 600;
		margin: 0 4px 10px;
	}
	.logo svg {
		width: 18px;
		height: 18px;
		fill: var(--ink);
	}
	.side span {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 7px 8px;
		border-radius: 7px;
	}
	.side span :global(svg) {
		width: 14px;
		height: 14px;
	}
	.side span.on {
		background: var(--bg);
		color: var(--ink);
		font-weight: 600;
	}
	.side small {
		margin-top: auto;
		padding: 8px;
		font-size: 11px;
		color: var(--faint);
	}
	.main {
		padding: 16px clamp(14px, 3vw, 34px) 18px;
		display: flex;
		flex-direction: column;
	}
	@media (max-width: 620px) {
		.pk {
			height: auto;
			min-height: 440px;
			border-radius: 20px;
		}
		.mid {
			padding: 20px 12px 0;
		}
		.app {
			grid-template-columns: 1fr;
		}
		.side {
			display: none;
		}
	}
</style>
