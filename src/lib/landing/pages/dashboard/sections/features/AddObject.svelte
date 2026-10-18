<!--
  Bento "Objekte anlegen" (`.add`): an address field with tags and button,
  the three newest objects below. Illustrative, so hidden from assistive tech.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import Icon from "../../components/Icon.svelte";
	import { addObject } from "../../content";

	const { entries } = addObject;
	/** Newest first; the server shows the first two entries. */
	let rows = $state([
		{ id: 0, entry: entries[0], fresh: false },
		{ id: 1, entry: entries[1], fresh: false },
	]);
	let typed = $state("");
	let pressed = $state(false);
	let next = 2;
	let lastId = 1;

	/** One pass: type the next address, press the button, add the row. */
	function run() {
		const entry = entries[next % entries.length];
		const text = `${entry[0]}, ${entry[1]}`;
		const timers: ReturnType<typeof setTimeout>[] = [];
		const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
		typed = "";
		for (let i = 1; i <= text.length; i++)
			at(i * 80, () => (typed = text.slice(0, i)));
		const end = text.length * 80;
		at(end + 500, () => (pressed = true));
		at(end + 680, () => {
			pressed = false;
			typed = "";
			rows = [{ id: ++lastId, entry, fresh: true }, ...rows].slice(0, 3);
			next++;
		});
		return () => {
			for (const t of timers) clearTimeout(t);
			typed = "";
			pressed = false;
		};
	}
</script>

<div
	class="add"
	aria-hidden="true"
	{@attach loopInView({ run, every: 4600, delay: 600 })}
>
	<div class="in">
		<div class="tx">
			{#if typed}{typed}{:else}<span class="ph">{addObject.placeholder}</span
				>{/if}<i class="cur"></i>
		</div>
		<div class="ft">
			{#each addObject.tags as tag (tag)}<span class="tg">{tag}</span>{/each}
			<span class={["bt", pressed && "press"]}>{addObject.button}</span>
		</div>
	</div>
	<div class="ls">
		{#each rows as row (row.id)}
			<div class={[row.fresh && "new"]}>
				<span class="ic"><Icon name="building" /></span>{row.entry[0]}<small
					>{row.entry[1]}</small
				>
			</div>
		{/each}
	</div>
</div>

<style>
	.add {
		width: min(460px, 100%);
		display: grid;
		gap: 12px;
	}
	.in {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 14px;
		box-shadow: 0 24px 44px -24px rgba(30, 50, 45, 0.35);
		padding: 14px 14px 12px;
	}
	.tx {
		font-size: 15px;
		min-height: 24px;
		display: flex;
		align-items: center;
	}
	.ph {
		color: var(--faint);
	}
	.cur {
		display: inline-block;
		width: 1.5px;
		height: 18px;
		background: var(--ink);
		margin-left: 2px;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.ft {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
	}
	.tg {
		border: 1px solid var(--hair);
		border-radius: 6px;
		padding: 3px 9px;
		font-size: 12px;
		color: var(--muted);
	}
	.bt {
		margin-left: auto;
		background: var(--ink);
		color: #fff;
		border-radius: 8px;
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 500;
		transition: transform 0.15s;
	}
	.bt.press {
		transform: scale(0.94);
	}
	.ls {
		display: grid;
		gap: 8px;
	}
	.ls div {
		display: flex;
		align-items: center;
		gap: 10px;
		background: #fafbfa;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 9px 12px;
		font-size: 14px;
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.ls div.new {
		animation: slide-in 0.4s both;
	}
	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
	}
	.ic {
		width: 28px;
		height: 28px;
		border-radius: 7px;
		background: #eef3f0;
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 15px;
	}
	small {
		color: var(--faint);
		margin-left: auto;
		font-size: 12px;
	}
	@media (prefers-reduced-motion: reduce) {
		.cur,
		.ls div.new {
			animation: none;
		}
	}
</style>
