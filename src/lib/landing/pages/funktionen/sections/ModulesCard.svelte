<!--
  The hero's card (.fm, example data): the Heidi Plattform with six modules
  that light up one after the other. Server-rendered with all of them done;
  with motion, after holding that while in view, each pass turns them off and
  on again one by one (`loopInView`), nothing with reduced motion.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Icon from "../components/Icon.svelte";
	import { modules } from "../content";

	const count = modules.items.length;
	/** How many modules are done, from the first. */
	let lit = $state(count);

	const pass = () => {
		lit = 0;
		const timers = modules.items.map((_, i) =>
			setTimeout(() => (lit = i + 1), modules.firstMs + i * modules.stepMs),
		);
		return () => timers.forEach(clearTimeout);
	};
	const every = modules.firstMs + count * modules.stepMs + modules.holdMs;
</script>

<div
	class="fm rv"
	role="img"
	aria-label={modules.label}
	{@attach loopInView({ run: pass, every, delay: modules.holdMs })}
>
	<div class="fm-h">
		<span class="fm-l">
			<svg viewBox="0 0 14 14" aria-hidden="true"
				><rect x="1" y="2" width="3" height="10" rx="1.5" fill="#fff" /><rect
					x="5.5"
					y="2"
					width="3"
					height="10"
					rx="1.5"
					fill="#fff"
				/><rect x="10" y="2" width="3" height="10" rx="1.5" fill="#fff" /></svg
			>
		</span>
		<span><b>{modules.title}</b><small>{modules.sub}</small></span>
		<span class="tag">{modules.tag}</span>
	</div>
	<div class="fm-g">
		{#each modules.items as item, i (item.title)}
			<div class={["fm-t", i < lit && "on"]}>
				<span class="fm-ic"><Icon name={item.icon} /></span>
				<b>{item.title}</b>
				<small>{item.text}</small>
				<i class="fm-ok">
					<svg viewBox="0 0 12 10" width="10" aria-hidden="true"
						><path
							d="M1 5l3.5 3.5L11 1"
							stroke="#1E322D"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
						/></svg
					>
				</i>
			</div>
		{/each}
	</div>
</div>

<style>
	.fm {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 16px;
		box-shadow: 0 40px 80px -48px rgba(30, 50, 45, 0.45);
	}
	.fm-h {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 10px;
		align-items: center;
		padding: 2px 4px 14px;
		border-bottom: 1px solid var(--hair);
	}
	.fm-l {
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: var(--ink);
		display: grid;
		place-items: center;
	}
	.fm-l svg {
		width: 15px;
		height: 15px;
	}
	.fm-h b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.fm-h small {
		font-size: 12px;
		color: var(--muted);
	}
	.tag {
		font-size: 11px;
		font-weight: 600;
		color: #2f7a3c;
		background: #e6f5e7;
		border-radius: 999px;
		padding: 3px 9px;
	}
	.fm-g {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-top: 14px;
	}
	.fm-t {
		position: relative;
		border: 1px solid var(--hair);
		border-radius: 14px;
		padding: 14px;
		background: #fff;
		transition:
			border-color 0.4s,
			box-shadow 0.4s,
			transform 0.4s;
	}
	.fm-ic {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: #f1f4f2;
		color: var(--ink);
		display: grid;
		place-items: center;
		transition:
			background 0.4s,
			color 0.4s;
	}
	.fm-ic :global(svg) {
		width: 16px;
		height: 16px;
	}
	.fm-t b {
		display: block;
		font-size: 14px;
		font-weight: 600;
		margin-top: 12px;
	}
	.fm-t small {
		display: block;
		font-size: 12px;
		color: var(--muted);
		margin-top: 2px;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.fm-ok {
		position: absolute;
		right: 12px;
		top: 12px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--accent);
		display: grid;
		place-items: center;
		transform: scale(0);
		transition: transform 0.4s cubic-bezier(0.3, 1.6, 0.5, 1);
	}
	.fm-ok svg {
		width: 11px;
		height: 11px;
	}
	.fm-t.on {
		border-color: #bfe3c2;
		box-shadow: 0 14px 30px -22px rgba(30, 50, 45, 0.45);
	}
	.fm-t.on .fm-ic {
		background: var(--ink);
		color: var(--accent);
	}
	.fm-t.on small {
		opacity: 1;
		transform: none;
	}
	.fm-t.on .fm-ok {
		transform: none;
	}
	@media (max-width: 560px) {
		.fm-t {
			padding: 12px;
		}
		.fm-t small {
			font-size: 11px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fm * {
			transition: none !important;
			animation: none !important;
		}
	}
</style>
