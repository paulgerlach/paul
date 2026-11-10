<!--
  "Was die Verordnung verlangt." (.pg-sec.alt#pflichten): six rows of label
  and text (the design's .lg-vs, a definition list here) and the source.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { duties } from "../content";
</script>

<section class="pg-sec alt dty" id="pflichten" aria-labelledby="pf-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="pf-h" eyebrow={duties.pill} heading={duties.h2}>
				{#snippet icon()}
					<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path
						d="M12 2.5V6h3.5M8 10h5M8 13h5"
					/>
				{/snippet}
			</SectionHead>
		</div>
		<dl class="vs rv">
			{#each duties.rows as row (row.label)}
				<div class="vr">
					<dt>{row.label}</dt>
					<dd>{row.text}</dd>
				</div>
			{/each}
		</dl>
		<p class="src rv">{duties.source}</p>
	</div>
</section>

<style>
	/* The landing heading reset takes SectionHead's 18 px top margin. */
	.dty :global(h2) {
		margin-top: 18px;
	}
	.head {
		max-width: 760px;
	}
	.vs {
		margin: 40px 0 0;
		border: 1px solid var(--hair);
		border-radius: 20px;
		overflow: hidden;
		background: #fff;
	}
	.vr {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		border-bottom: 1px solid var(--hair);
	}
	.vr:last-child {
		border-bottom: 0;
	}
	dt {
		padding: 16px 20px;
		font-size: 13px;
		font-weight: 600;
		color: var(--muted);
		background: #fafbfa;
	}
	dd {
		margin: 0;
		padding: 16px 20px;
		font-size: 15px;
		line-height: 1.5;
	}
	.src {
		margin-top: 18px;
		font-size: 13px;
		color: var(--faint);
	}
	@media (max-width: 640px) {
		.vr {
			grid-template-columns: minmax(0, 1fr);
		}
		dt {
			padding: 12px 14px 2px;
			background: none;
		}
		dd {
			padding: 2px 14px 12px;
			font-size: 14px;
		}
	}
</style>
