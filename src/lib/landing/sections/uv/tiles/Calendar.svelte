<!--
  A row's tile: the twelve months, ticked done up to the current one, which
  is being prepared, with a note pill naming the latest step. Every 7.6 s in
  view the months reset to "offen" and tick through again. Optional per-cell
  kinds: a placeholder (no label, no tick, leaves the note alone) and a
  milestone (lime when done, with its own label and note).
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "../Tick.svelte";
	import type { CalendarCell, CalendarTile } from "../types";

	let {
		months,
		long,
		cells,
		current,
		done = "",
		doing = "",
		open,
		noteDone = "",
		noteDoing = "",
	}: CalendarTile = $props();

	/** Months processed so far (the current one included): all of them on the server. */
	// svelte-ignore state_referenced_locally
	let step = $state(current + 1);

	const cell = (i: number): CalendarCell => cells?.[i] ?? {};
	const blank = (i: number) => cell(i).kind === "placeholder";

	const phase = (i: number) =>
		i >= step ? "open" : i < current ? "done" : "now";
	function label(i: number) {
		if (blank(i)) return "";
		const p = phase(i);
		return p === "open"
			? open
			: (cell(i).label ?? (p === "done" ? done : doing));
	}
	const noteOf = (i: number) =>
		cell(i).note ??
		(i < current ? noteDone : noteDoing).replace("{x}", (long ?? months)[i]);
	/**
	 * The latest processed cell that moves the note (the current one, or a
	 * done cell that isn't a placeholder). Before it, the note still names the
	 * last pass's final step, as the design's never resets.
	 */
	const note = $derived.by(() => {
		for (let i = step - 1; i >= 0; i--)
			if (i >= current || !blank(i)) return noteOf(i);
		return noteOf(current);
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
		<li
			class={[
				phase(i),
				blank(i) && "blank",
				cell(i).kind === "milestone" && "milestone",
			]}
		>
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
	/* Milestones (the design's span.tag): ink label, lime when done. The
	   current one keeps the accent label (plan README, open question 4). */
	.milestone:not(.now) small {
		color: var(--ink);
	}
	.done.milestone {
		background: var(--lime);
	}
	.done.milestone small i {
		background: var(--ink);
		border-color: var(--ink);
	}
	/* Placeholders (the design's span.pl): no tick, a faint done state */
	.blank small i {
		opacity: 0;
	}
	.done.blank small {
		color: var(--faint);
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
