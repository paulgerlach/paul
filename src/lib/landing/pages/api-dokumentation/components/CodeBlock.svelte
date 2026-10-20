<!--
  A code sample (.ad-code): the head with its label and badge and
  "Kopieren", the code (JSON coloured on the server through `jsonTokens`).
  The frame scrolls sideways, so it's focusable and named.
-->
<script lang="ts">
	import { copy, type CodeSample } from "../content";
	import { jsonTokens } from "../highlight";

	let { sample }: { sample: CodeSample } = $props();

	const tokens = $derived(jsonTokens(sample.code));
</script>

<div class="code">
	<div class="head">
		<span
			>{sample.label}
			{#if sample.badge?.kind === "ph"}<em class="ph">{sample.badge.text}</em
				>{:else if sample.badge}<b class="ok">{sample.badge.text}</b>{/if}</span
		>
		<button type="button" class="cp">{copy.button}</button>
	</div>
	<!-- A scrolling region needs focus to scroll by keyboard. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<pre tabindex="0" aria-label={copy.codeLabel(sample.label)}><code
			>{#each tokens as token, i (i)}{#if token.kind}<span class={token.kind}
						>{token.text}</span
					>{:else}{token.text}{/if}{/each}</code
		></pre>
</div>

<style>
	.code {
		margin-top: 20px;
		background: #1e322d;
		border-radius: 14px;
		overflow: hidden;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px 10px 18px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 13px;
		color: rgba(255, 255, 255, 0.6);
	}
	.head > span {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.ph {
		font-style: normal;
		font-size: 11.5px;
		color: #1e322d;
		background: #f3d98b;
		border-radius: 6px;
		padding: 1px 7px;
		font-weight: 500;
	}
	.ok {
		font-family: var(--mono);
		font-weight: 500;
		color: #1e322d;
		background: #8ad68f;
		border-radius: 6px;
		padding: 0 7px;
		font-size: 12px;
	}
	/* `.head .cp`: beats the landing reset of buttons' colour (0,1,1). */
	.head .cp {
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		padding: 5px 10px;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
	}
	.head .cp:hover {
		background: rgba(255, 255, 255, 0.12);
	}
	pre {
		margin: 0;
		padding: 18px;
		overflow: auto;
		font-size: 13.5px;
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.88);
	}
	.k {
		color: #b9e6bc;
	}
	.s {
		color: #fff;
	}
	/* Copying needs JS. */
	@media (scripting: none) {
		.head .cp {
			display: none;
		}
	}
</style>
