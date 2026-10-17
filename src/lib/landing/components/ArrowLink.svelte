<!-- The design's CTA button with an arrow: light green ("bk-next inv") or, with `ink`, dark ("bk-next"). -->
<script lang="ts">
	import { focusSignup, START_HREF } from "$lib/landing/cta";

	let {
		href = START_HREF,
		label,
		ink = false,
		class: className = "",
		...rest
	}: {
		href?: string;
		label: string;
		ink?: boolean;
		class?: string;
		target?: string;
		rel?: string;
	} = $props();
</script>

<a
	class={["bk", ink && "ink", className]}
	{href}
	onclick={href === START_HREF ? focusSignup : undefined}
	{...rest}
>
	{label} <span class="ar" aria-hidden="true">→</span>
</a>

<style>
	.bk {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--accent);
		color: var(--ink);
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 18px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #fff;
	}
	.bk.ink {
		background: var(--ink);
		color: #fff;
	}
	.bk.ink:hover {
		background: #2a443d;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
</style>
