<!-- The scene's info card (.pv-info): what a signal point or tag stands for. Placed by the scene; closed with "×". -->
<script lang="ts">
	import type { InfoEntry } from "../content";

	let {
		entry,
		open,
		x,
		y,
		closeLabel,
		onclose,
		el = $bindable(),
	}: {
		entry: InfoEntry | undefined;
		open: boolean;
		x: number;
		y: number;
		closeLabel: string;
		onclose: () => void;
		el?: HTMLElement;
	} = $props();
</script>

<div
	class={["info", open && "on"]}
	role="dialog"
	aria-labelledby="pv-info-t"
	hidden={!entry}
	style:left="{x}px"
	style:top="{y}px"
	bind:this={el}
>
	<button type="button" class="ix" aria-label={closeLabel} onclick={onclose}
		>×</button
	>
	{#if entry}
		<span class="ik">{entry.kind}</span><b id="pv-info-t">{entry.title}</b>
		<p>{entry.text}</p>
		<ul>
			{#each entry.points as point (point)}<li>{point}</li>{/each}
		</ul>
	{/if}
</div>

<style>
	.info {
		position: absolute;
		z-index: 6;
		width: min(320px, calc(100% - 32px));
		background: #fff;
		color: var(--ink);
		border-radius: 16px;
		padding: 16px 16px 14px;
		box-shadow: 0 24px 50px -20px rgba(0, 0, 0, 0.5);
		opacity: 0;
		transform: translateY(8px) scale(0.97);
		transition:
			opacity 0.25s,
			transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.info[hidden] {
		display: none;
	}
	.info.on {
		opacity: 1;
		transform: none;
	}
	.info :global(:focus-visible) {
		outline-color: var(--accent-deep);
	}
	.ik {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #2f7a3c;
	}
	.ik::before {
		content: "";
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #3e9a57;
	}
	b {
		display: block;
		font-size: 17px;
		font-weight: 600;
		margin-top: 6px;
	}
	p {
		font-size: 13.5px;
		line-height: 1.45;
		color: var(--muted);
		margin-top: 6px;
	}
	ul {
		list-style: none;
		margin: 10px 0 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}
	li {
		display: flex;
		gap: 8px;
		font-size: 13px;
		align-items: flex-start;
	}
	li::before {
		content: "✓";
		flex: none;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: #e6f5e7;
		color: #2f7a3c;
		font-size: 10px;
		font-weight: 700;
		display: grid;
		place-items: center;
		margin-top: 1px;
	}
	.ix {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 28px;
		height: 28px;
		border: 0;
		border-radius: 50%;
		background: #f2f3f2;
		color: var(--ink);
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
	}
	.ix:hover {
		background: #e4efe6;
	}
	@media (max-width: 620px) {
		.info {
			left: 16px !important;
			right: 16px;
			top: 16px !important;
			width: auto;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.info {
			transition: none;
		}
	}
</style>
