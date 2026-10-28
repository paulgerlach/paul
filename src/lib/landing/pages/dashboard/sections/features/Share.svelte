<!--
  Bento "Dashboard teilen" (`.sh`): an invite field, the people the dashboard
  is shared with, and the button. Example addresses only; nothing is sent.
-->
<script lang="ts">
	import { loopInView } from "$lib/landing/attachments/loopInView";
	import { share } from "../../content";

	let typed = $state("");
	let pressed = $state(false);
	/** Invitees shown under "Sie" (the server shows the first one). */
	let people = $state([{ id: 0, invitee: share.invitees[0], fresh: false }]);
	let next = 1;
	let lastId = 0;

	function add() {
		const invitee = share.invitees[next % share.invitees.length];
		next++;
		people = [...people, { id: ++lastId, invitee, fresh: true }].slice(-2);
	}

	/** One pass: type the next address, press the button, add the invitee. */
	function run() {
		const text = share.invitees[next % share.invitees.length][0];
		const timers: ReturnType<typeof setTimeout>[] = [];
		const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
		typed = "";
		for (let i = 1; i <= text.length; i++)
			at(i * 60, () => (typed = text.slice(0, i)));
		const end = text.length * 60;
		at(end + 600, () => (pressed = true));
		at(end + 760, () => {
			pressed = false;
			typed = "";
			add();
		});
		return () => {
			for (const t of timers) clearTimeout(t);
			typed = "";
			pressed = false;
		};
	}
</script>

<div class="sh" {@attach loopInView({ run, every: 5600, delay: 500 })}>
	<div class="in" aria-hidden="true">
		<span class="mail">{typed}</span>
		<span class="perm">{share.invite}</span>
	</div>
	<ul class="ls">
		<li>
			<span class="av" aria-hidden="true">{share.you.initials}</span>
			<span><b>{share.you.name}</b><small>{share.you.sub}</small></span>
		</li>
		{#each people as p (p.id)}
			<li class={[p.fresh && "new"]}>
				<span class="av b" aria-hidden="true">{p.invitee[1]}</span>
				<span><b>{p.invitee[0]}</b><small>{share.status}</small></span>
			</li>
		{/each}
	</ul>
	<button class={["go", pressed && "press"]} type="button" onclick={add}
		>{share.button}</button
	>
</div>

<style>
	.sh {
		width: min(360px, 100%);
		display: grid;
		gap: 12px;
	}
	.in {
		display: flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 10px 12px;
		font-size: 14px;
		box-shadow: 0 16px 34px -22px rgba(30, 50, 45, 0.35);
	}
	.mail {
		flex: 1;
		min-width: 0;
		min-height: 20px;
		overflow: hidden;
		white-space: nowrap;
	}
	.perm {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 12px;
		color: var(--muted);
		background: #f2f4f2;
		border-radius: 6px;
		padding: 3px 8px;
		white-space: nowrap;
	}
	.ls {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 8px;
	}
	.ls li {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13.5px;
		min-width: 0;
	}
	.ls li > span:last-child {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.ls li.new {
		animation: slide-in 0.4s both;
	}
	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	.av {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-size: 12px;
		font-weight: 600;
		flex: none;
	}
	.av.b {
		background: #e3e8f5;
		color: #3c5ba8;
	}
	small {
		display: block;
		color: var(--faint);
		font-size: 12px;
	}
	.go {
		justify-self: start;
		border: 0;
		background: var(--accent);
		color: var(--ink);
		font-size: 14px;
		font-weight: 600;
		border-radius: 9px;
		padding: 10px 16px;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.go:hover {
		background: var(--accent-deep);
	}
	.go.press {
		transform: scale(0.95);
	}
	@media (prefers-reduced-motion: reduce) {
		.ls li.new {
			animation: none;
		}
	}
</style>
