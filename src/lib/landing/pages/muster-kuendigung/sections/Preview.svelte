<!--
  The letter as the design's preview sheet (.kd-pv): one paragraph per block,
  lines by `<br>`, empty fields as highlighted placeholders. A labelled
  document, not a live region (the design's `aria-live` would read the whole
  letter on every keystroke; plan README, Key decisions).
-->
<script lang="ts">
	import { generator } from "../content";
	import type { Paragraph } from "../letter";

	let { letter }: { letter: Paragraph[] } = $props();
</script>

<div class="pv" role="document" aria-label={generator.previewLabel}>
	{#each letter as p, i (i)}
		<p class={p.kind}>
			{#if p.kind === "sg"}<span class="sig-l">{generator.signature}</span>{/if}
			{#each p.lines as line, j (j)}
				{#if j}<br />{/if}{#each line as seg, k (k)}{#if seg.placeholder}<span
							class="ph">{seg.text}</span
						>{:else}{seg.text}{/if}{/each}
			{/each}
		</p>
	{/each}
</div>

<style>
	.pv {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 6px;
		box-shadow: 0 30px 60px -36px rgba(30, 50, 45, 0.4);
		padding: 44px 48px;
		font-size: 12.5px;
		line-height: 1.6;
		color: #222;
		min-height: 640px;
		overflow-wrap: anywhere;
	}
	/* The letter's face; the landing styles set Geist on every element. */
	.pv,
	.pv :global(*) {
		font-family: Arial, Helvetica, sans-serif;
	}
	p {
		margin: 0 0 11px;
	}
	.ab {
		font-size: 10.5px;
		color: #666;
		margin-bottom: 22px;
	}
	.to {
		margin-bottom: 26px;
	}
	.dt {
		text-align: right;
		margin-bottom: 22px;
	}
	.bt {
		font-weight: 700;
		margin-bottom: 14px;
	}
	.ph {
		background: #fff4d6;
		border-radius: 3px;
		padding: 0 3px;
		color: #7a5a00;
	}
	.sg {
		margin-top: 28px;
	}
	.sig-l {
		display: block;
		width: 180px;
		border-top: 1px solid #999;
		margin-top: 42px;
		padding-top: 4px;
		font-size: 11px;
		color: #666;
	}
	@media (max-width: 640px) {
		.pv {
			padding: 26px 22px;
			min-height: 0;
			font-size: 12px;
		}
	}
</style>
