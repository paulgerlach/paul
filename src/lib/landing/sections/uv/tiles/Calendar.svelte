<!--
  A row's tile: the twelve months, ticked done up to the current one, which
  is being prepared, with a note pill naming the latest step. Every 7.6 s in
  view the months reset to "offen" and tick through again.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "../Tick.svelte";
	import type { CalendarTile } from "../types";

	let {
		months,
		long,
		current,
		done,
		doing,
		open,
		noteDone,
		noteDoing,
	}: CalendarTile = $props();

	/** Months processed so far (the current one included): all of them on the server. */
	// svelte-ignore state_referenced_locally
	let step = $state(current + 1);

	const phase = (i: number) =>
		i >= step ? "open" : i < current ? "done" : "now";
	const label = (i: number) => ({ open, done, now: doing })[phase(i)];
	const note = $derived.by(() => {
		const i = Math.max(0, step - 1);
		const template = i < current ? noteDone : noteDoing;
		return template.replace("{x}", (long ?? months)[i]);
	});

	function run() {
		step = 0;
		const timers = Array.from({ length: current + 1 }, (_, k) =>
			setTimeout(() => (step = k + 1), 300 + k * 380),
		);
		return () => timers.forEach(clearTimeout);
	}
</script>

<ol class="cal" {@attach loopInView({ run, every: 7600 })}>
	{#each months as month, i (month)}
		<li class={phase(i)}>
			{month}
			<small><i><Tick width={9} /></i><em>{label(i)}</em></small>
		</li>
	{/each}
</ol>
<p class="note"><span class="dot"></span><span>{note}</span></p>

<style>
	.cal {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
		width: 100%;
		max-width: 420px;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		background: #fff;
		border-radius: 12px;
		padding: 12px 12px 10px;
		font-size: 13.5px;
		font-weight: 600;
		display: flex;
		flex-direction: column;
		gap: 8px;
		box-shadow: 0 8px 20px -16px rgba(30, 50, 45, 0.4);
		transition:
			background 0.4s,
			transform 0.4s;
	}
	small {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-weight: 500;
		color: var(--faint);
		transition: color 0.3s;
	}
	small i {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 1.5px solid #c9d3ce;
		display: grid;
		place-items: center;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	small i :global(svg) {
		opacity: 0;
		color: #fff;
		transition: opacity 0.3s;
	}
	.done small {
		color: #2f7a3c;
	}
	.done small i {
		background: #2f7a3c;
		border-color: #2f7a3c;
	}
	.done small i :global(svg) {
		opacity: 1;
	}
	.now {
		background: var(--ink);
		color: #fff;
		transform: scale(1.04);
	}
	.now small {
		color: var(--accent);
	}
	.now small i {
		border-color: var(--accent);
		border-top-color: transparent;
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.note {
		position: absolute;
		left: 50%;
		bottom: clamp(16px, 3vw, 32px);
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border-radius: 999px;
		padding: 8px 14px;
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		white-space: nowrap;
		box-shadow: 0 8px 20px -14px rgba(30, 50, 45, 0.4);
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--ok);
		animation: pulse 1.8s infinite;
	}
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0.5);
		}
		70% {
			box-shadow: 0 0 0 8px rgba(62, 154, 87, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(62, 154, 87, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.now small i,
		.dot {
			animation: none;
		}
	}
</style>
