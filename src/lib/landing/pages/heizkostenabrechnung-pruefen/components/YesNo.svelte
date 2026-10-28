<!-- A yes/no question (.mc-yn): its label over "Ja", "Nein", "Weiß nicht" as pressed buttons; `flow` is the guided flow's larger look. -->
<script lang="ts">
	import { ANSWERS } from "../content";
	import type { Answer } from "../rules";

	let {
		question,
		value,
		onpick,
		flow = false,
	}: {
		question: string;
		value: Answer;
		onpick: (value: Answer) => void;
		flow?: boolean;
	} = $props();

	const id = $props.id();
</script>

<div class={["yn", flow && "flow"]} role="group" aria-labelledby={id}>
	<span {id}>{question}</span>
	<div>
		{#each ANSWERS as answer (answer.value)}
			<button
				type="button"
				class={[value === answer.value && "on"]}
				aria-pressed={value === answer.value}
				onclick={() => onpick(answer.value)}>{answer.label}</button
			>
		{/each}
	</div>
</div>

<style>
	.yn {
		display: grid;
		gap: 7px;
		margin-top: 12px;
	}
	.yn > span {
		font-size: 13px;
		font-weight: 600;
		line-height: 1.35;
	}
	.yn > div {
		display: flex;
		gap: 6px;
	}
	/* `.yn button`: beats the landing reset of buttons' font. */
	.yn button {
		flex: 1;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 9px;
		font: inherit;
		font-size: 13.5px;
		padding: 8px 6px;
		cursor: pointer;
		color: var(--muted);
		transition: all 0.2s;
	}
	.yn button.on {
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	/* .mc-ws .mc-yn */
	.flow {
		margin-top: 0;
	}
	.flow > span {
		font-size: 15px;
	}
	.flow button {
		padding: 11px 6px;
	}
</style>
