<!--
  Bento "Heizkostenabrechnung per Klick" (`.ab`): three properties "Bereit",
  the button that creates their statements, the hint and the toast.
-->
<script lang="ts">
	import Icon from "../../components/Icon.svelte";
	import { billingRun } from "../../content";

	type Status = "ready" | "working" | "done";
	let statuses = $state<Status[]>(billingRun.properties.map(() => "ready"));
	let finished = $state(false);
	let running = $state(false);
</script>

<div class="ab">
	{#each billingRun.properties as p, i (p.name)}
		<div class="r">
			<span class="ic"><Icon name="building" /></span>{p.name}
			<small>· {p.units} WE</small>
			<span class={["st", statuses[i]]}>{billingRun.status[statuses[i]]}</span>
		</div>
	{/each}
	<div class="ft">
		<button class="go" type="button" disabled={running}>
			<Icon name="bolt" />{finished ? billingRun.reset : billingRun.button}
		</button>
		<span class="hint" role="status">
			{#if running}{billingRun.working}{:else if !finished}{billingRun.hint}{/if}
			{#if finished}<span class="sr-only">{billingRun.toast}</span>{/if}
		</span>
	</div>
	<div aria-hidden="true">
		<span class={["toast", finished && "show"]}>
			<span class="okb"><Icon name="check" /></span>{billingRun.toast}
		</span>
	</div>
</div>

<style>
	.ab {
		width: min(520px, 100%);
		display: grid;
		gap: 10px;
	}
	.r {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #fafbfa;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 10px 12px;
		font-size: 14px;
	}
	.r small {
		color: var(--faint);
		margin-left: -8px;
	}
	.ic {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		flex: none;
	}
	.ic :global(svg) {
		width: 15px;
	}
	.st {
		margin-left: auto;
		font-size: 12px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 10px;
		background: #eef1ef;
		color: var(--muted);
		transition:
			background 0.3s,
			color 0.3s;
	}
	.st.done {
		background: #e6f5e7;
		color: #2f7a3c;
	}
	.st.working {
		background: #eaf0fa;
		color: #3c5ba8;
	}
	.ft {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 6px;
		flex-wrap: wrap;
	}
	.go {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--accent);
		color: var(--ink);
		border: 0;
		border-radius: 9px;
		padding: 11px 16px;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.go:hover {
		background: var(--accent-deep);
	}
	.go:active {
		transform: scale(0.96);
	}
	.go :global(svg) {
		width: 16px;
		height: 16px;
	}
	.go[disabled] {
		opacity: 0.6;
		cursor: default;
	}
	.hint {
		font-size: 12.5px;
		color: var(--faint);
	}
	.toast {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		background: var(--ink);
		color: #fff;
		border-radius: 999px;
		padding: 9px 16px 9px 10px;
		font-size: 13px;
		box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.4);
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.toast.show {
		opacity: 1;
		transform: none;
	}
</style>
