<!--
  The designs' eyebrow pill with the sparkle (`#eb-css`): white, a thin
  border, the sparkle in --faint. `center` centres it in a centred head,
  `onDark` is the variant for dark sections. Same look as `RegionMain`'s
  global `.eyebrow` rule.
-->
<script lang="ts">
	let {
		text,
		center = false,
		onDark = false,
		class: className = "",
	}: {
		text: string;
		center?: boolean;
		onDark?: boolean;
		class?: string;
	} = $props();
</script>

<span class={["eb", center && "c", onDark && "dark", className]}>{text}</span>

<style>
	.eb {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		max-width: 100%;
		background: #fff;
		color: var(--ink);
		border: 1px solid #e4e8e6;
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		line-height: 1.3;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
		margin: 0 0 18px;
	}
	.eb::before {
		content: "";
		width: 15px;
		height: 15px;
		flex: none;
		background: var(--faint);
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='black' stroke-width='1.5' stroke-linejoin='round'%3E%3Cpath d='M8.5 2.5l1.4 4.1 4.1 1.4-4.1 1.4-1.4 4.1-1.4-4.1-4.1-1.4 4.1-1.4z'/%3E%3Cpath d='M15 11.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z'/%3E%3C/svg%3E")
			center/contain no-repeat;
	}
	.c {
		margin-inline: auto;
	}
	.dark {
		background: rgba(255, 255, 255, 0.06);
		color: #fff;
		border-color: rgba(255, 255, 255, 0.18);
		box-shadow: none;
	}
	.dark::before {
		background: var(--accent);
	}
</style>
