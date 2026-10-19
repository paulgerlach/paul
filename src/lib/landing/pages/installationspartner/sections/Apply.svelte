<!--
  "Werden Sie Heidi-Installationspartner." (the design's .ipf, #bewerben):
  the three steps beside the partner form. Every "Partner werden" leads here.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { PartnerInquiry } from "$lib/forms/partnerInquiry";
	import { APPLY_ID, apply } from "../content";
	import PartnerForm from "./PartnerForm.svelte";

	let { form }: { form: SuperValidated<PartnerInquiry> } = $props();
</script>

<section class="ipf" id={APPLY_ID} aria-labelledby="ip-apply-h">
	<div class="wrap">
		<div class="g">
			<div class="l">
				<span class="pill">{apply.pill}</span>
				<h2 id="ip-apply-h">{apply.h2[0]}<br />{apply.h2[1]}</h2>
				<p>{apply.text}</p>
				<ol>
					{#each apply.steps as step, i (step.title)}
						<li>
							<span aria-hidden="true">{i + 1}</span><b>{step.title}</b><small
								>{step.text}</small
							>
						</li>
					{/each}
				</ol>
			</div>
			<PartnerForm {form} />
		</div>
	</div>
</section>

<style>
	.ipf {
		padding: 110px 0;
		background: var(--ink);
		color: #fff;
		scroll-margin-top: 72px;
	}
	.g {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: clamp(32px, 6vw, 88px);
		align-items: start;
	}
	.pill {
		display: inline-flex;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 999px;
		padding: 6px 14px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.8);
	}
	/* Beats the landing heading reset (tokens.css). */
	.l h2 {
		font-size: clamp(34px, 4vw, 56px);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 1.04;
		margin-top: 22px;
	}
	.l > p {
		color: rgba(255, 255, 255, 0.72);
		font-size: clamp(16px, 1.4vw, 18px);
		line-height: 1.55;
		margin: 18px 0 0;
		max-width: 46ch;
	}
	ol {
		list-style: none;
		padding: 0;
		margin: 34px 0 0;
		display: grid;
		gap: 18px;
	}
	li {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr);
		column-gap: 14px;
	}
	li span {
		grid-row: span 2;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #8ad68f;
		color: var(--ink);
		display: grid;
		place-items: center;
		font-weight: 600;
	}
	li b {
		font-size: 16px;
		font-weight: 600;
	}
	li small {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.6);
	}
	@media (max-width: 900px) {
		.ipf {
			padding: 72px 0;
		}
		.g {
			grid-template-columns: 1fr;
		}
	}
</style>
