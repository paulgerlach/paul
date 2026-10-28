<!--
  Row 3's tile (the design's .ip-chk, "Prüfung Gerätegruppe"): four group
  tabs; the current group's three checks spin and tick one after another,
  then "Wird eingebunden" shows and the next group follows. A group every
  5.6 s while in view; stopping leaves the shown group checked. Server-
  rendered with the first group checked (the design's reduced-motion
  state). The tile is hidden from screen readers (Rows).
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Tick from "$lib/landing/sections/uv/Tick.svelte";
	import DevicePhoto from "../components/DevicePhoto.svelte";
	import { check } from "../content";
	import { CHECK } from "../scenes";

	const n = check.items.length;
	let group = $state(0);
	/** Per item: waiting, running or ticked. */
	let items = $state<("" | "run" | "ok")[]>(check.items.map(() => "ok"));
	let done = $state(true);
	/** The group the next pass shows. */
	let next = 0;

	function run() {
		group = next;
		next = (next + 1) % check.groups.length;
		items = check.items.map(() => "");
		done = false;
		const timers: ReturnType<typeof setTimeout>[] = [];
		check.items.forEach((_, j) => {
			const t = CHECK.first + j * CHECK.item;
			timers.push(setTimeout(() => (items[j] = "run"), t));
			timers.push(setTimeout(() => (items[j] = "ok"), t + CHECK.tick));
		});
		timers.push(
			setTimeout(
				() => (done = true),
				CHECK.first + n * CHECK.item + CHECK.doneAfter,
			),
		);
		return () => {
			timers.forEach(clearTimeout);
			items = check.items.map(() => "ok");
			done = true;
		};
	}

	const current = $derived(check.groups[group]);
</script>

<div
	class={["chk", done && "done"]}
	{@attach loopInView({ run, every: CHECK.every })}
>
	<div class="tabs">
		{#each check.groups as g, i (g.tab)}
			<span class={[i === group && "on"]}
				><DevicePhoto image={g.image} size={30} /><i>{g.tab}</i></span
			>
		{/each}
	</div>
	<div class="ch">
		<small>{check.title}</small><b>{current.name}</b><span>{current.count}</span
		>
	</div>
	<ul class="cl">
		{#each check.items as item, j (item)}
			<li class={items[j]}><i></i><span>{item}</span></li>
		{/each}
	</ul>
	<div class="cr">
		<span class="ck"><Tick /></span>{check.result}
	</div>
</div>

<style>
	.chk {
		background: #fff;
		border-radius: 20px;
		width: 100%;
		max-width: 420px;
		padding: 16px 18px 18px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.45);
		color: var(--ink);
	}
	.tabs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
		background: #f2f6f3;
		border-radius: 14px;
		padding: 5px;
	}
	.tabs span {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		padding: 8px 2px 6px;
		border-radius: 10px;
		font-size: 11.5px;
		color: var(--muted);
		transition:
			background 0.3s,
			color 0.3s,
			box-shadow 0.3s;
	}
	.tabs i {
		font-style: normal;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 100%;
	}
	.tabs span.on {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 6px 14px -10px rgba(30, 50, 45, 0.5);
	}
	.ch {
		padding: 18px 4px 6px;
	}
	.ch small {
		display: block;
		font-size: 12px;
		color: var(--muted);
	}
	.ch b {
		display: block;
		font-size: 20px;
		font-weight: 600;
		letter-spacing: -0.01em;
		margin-top: 4px;
	}
	.ch span {
		font-size: 13.5px;
		color: var(--muted);
	}
	.cl {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 4px;
	}
	.cl li {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 6px;
		border-top: 1px solid #eef1ef;
		font-size: 14.5px;
		color: var(--muted);
		transition: color 0.3s;
	}
	.cl li i {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid #dde5e0;
		flex: none;
		position: relative;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.cl li.run i {
		border-color: #8ad68f;
		border-right-color: transparent;
		animation: ipSpin 0.7s linear infinite;
	}
	.cl li.ok {
		color: var(--ink);
	}
	.cl li.ok i {
		background: #8ad68f;
		border-color: #8ad68f;
	}
	.cl li.ok i::after {
		content: "";
		position: absolute;
		left: 6px;
		top: 3px;
		width: 5px;
		height: 9px;
		border: solid #1e322d;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}
	@keyframes ipSpin {
		to {
			transform: rotate(360deg);
		}
	}
	.cr {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
		padding: 12px 14px;
		border-radius: 12px;
		background: #f4f8f5;
		font-size: 14px;
		font-weight: 600;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	.done .cr {
		opacity: 1;
		transform: none;
	}
	.ck {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #8ad68f;
		color: #1e322d;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ck :global(svg) {
		width: 12px;
		height: 12px;
	}
	@media (prefers-reduced-motion: reduce) {
		.cr {
			transition: none;
		}
		.cl li.run i {
			animation: none;
		}
	}
</style>
