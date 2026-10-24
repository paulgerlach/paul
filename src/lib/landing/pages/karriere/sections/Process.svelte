<!-- "Bewerbungsprozess": three numbered steps. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { process } from "../content";
</script>

{#snippet arrow()}
	<path d="M4 10h12M11 5l5 5-5 5" />
{/snippet}

<section class="sec" aria-labelledby="pz-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="pz-h"
				eyebrow={process.eyebrow}
				icon={arrow}
				heading={process.h2}
				center
			/>
		</div>
		<ol>
			{#each process.steps as step, i (step.title)}
				<li class="rv">
					<span aria-hidden="true">{i + 1}</span>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		background: var(--bg);
	}
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	ol {
		list-style: none;
		padding: 0;
		margin: 52px 0 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	li {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 28px;
	}
	li > span {
		display: inline-flex;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--accent);
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}
	h3 {
		font-size: 19px;
		font-weight: 600;
		margin-top: 20px;
	}
	p {
		font-size: 15px;
		color: var(--muted);
		margin-top: 8px;
		line-height: 1.5;
	}
	@media (max-width: 760px) {
		ol {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
	}
</style>
