<!--
  The designs' segmented control: a radiogroup of buttons with a roving
  tabindex; the arrow keys, Home and End move the choice. Two looks: `track`
  (grey track, white pill: /karriere's areas) and `ink` (white track, dark
  pill, equal columns: /fernablesung-umruesten's risk calculator).
-->
<script lang="ts" generics="T extends string | number">
	let {
		options,
		value = $bindable(),
		label,
		look = "track",
		class: className = "",
	}: {
		options: readonly { value: T; label: string }[];
		value: T;
		/** Accessible name of the group. */
		label: string;
		look?: "track" | "ink";
		class?: string;
	} = $props();

	let buttons: HTMLButtonElement[] = $state([]);

	const KEYS: Record<string, (i: number, n: number) => number> = {
		ArrowRight: (i, n) => (i + 1) % n,
		ArrowDown: (i, n) => (i + 1) % n,
		ArrowLeft: (i, n) => (i - 1 + n) % n,
		ArrowUp: (i, n) => (i - 1 + n) % n,
		Home: () => 0,
		End: (_, n) => n - 1,
	};

	function onkeydown(event: KeyboardEvent, index: number) {
		const move = KEYS[event.key];
		if (!move) return;
		event.preventDefault();
		const next = move(index, options.length);
		value = options[next].value;
		buttons[next]?.focus();
	}
</script>

<div
	class={["seg", look, className]}
	role="radiogroup"
	aria-label={label}
	style:--n={options.length}
>
	{#each options as option, i (option.value)}
		<button
			bind:this={buttons[i]}
			type="button"
			role="radio"
			aria-checked={value === option.value}
			tabindex={value === option.value ? 0 : -1}
			class={[value === option.value && "on"]}
			onclick={() => (value = option.value)}
			onkeydown={(event) => onkeydown(event, i)}>{option.label}</button
		>
	{/each}
</div>

<style>
	.seg button {
		border: 0;
		background: none;
		font: inherit;
		font-weight: 500;
		color: var(--muted);
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.seg button:hover {
		color: var(--ink);
	}

	/* `.pg-seg` */
	.track {
		display: inline-flex;
		background: #eef1ef;
		border-radius: 10px;
		padding: 3px;
		gap: 2px;
	}
	.track button {
		white-space: nowrap;
		font-size: 13.5px;
		padding: 7px 12px;
		border-radius: 8px;
	}
	.track button.on {
		background: #fff;
		color: var(--ink);
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.12);
	}

	/* /fernablesung-umruesten's `.seg` */
	.ink {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		gap: 4px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 12px;
		padding: 4px;
	}
	.ink button {
		font-size: 14.5px;
		padding: 10px 6px;
		border-radius: 9px;
	}
	.ink button.on {
		background: var(--ink);
		color: #fff;
	}
</style>
