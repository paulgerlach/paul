<!-- "Bewerben": the text column and the application form. -->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { Application } from "$lib/forms/application";
	import Check from "$lib/landing/components/icons/Check.svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { APPLY_ID } from "../application.svelte";
	import { apply } from "../content";
	import ApplicationForm from "./ApplicationForm.svelte";

	let { form }: { form: SuperValidated<Application> } = $props();
</script>

{#snippet file()}
	<path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M8 10h5M8 13h5" />
{/snippet}

<section class="sec" id={APPLY_ID} aria-labelledby="bw-h">
	<div class="wrap bw">
		<div>
			<SectionHead
				id="bw-h"
				eyebrow={apply.eyebrow}
				icon={file}
				heading={apply.h2}
			/>
			<p class="lead rv">{apply.lead}</p>
			<ul class="rv">
				{#each apply.ticks as tick (tick)}
					<li><Check />{tick}</li>
				{/each}
			</ul>
		</div>
		<ApplicationForm {form} />
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.bw {
		display: grid;
		grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
		gap: 64px;
		align-items: start;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 26px 0 0;
		display: grid;
		gap: 10px;
		font-size: 15px;
		color: var(--muted);
	}
	li {
		display: flex;
		gap: 10px;
		align-items: center;
	}
	li :global(svg) {
		flex: none;
		width: 10px;
	}
	@media (max-width: 1040px) {
		.bw {
			grid-template-columns: minmax(0, 1fr);
			gap: 36px;
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
	}
</style>
