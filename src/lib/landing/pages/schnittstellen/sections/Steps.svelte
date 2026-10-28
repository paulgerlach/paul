<!-- "So starten Sie" (.si-go): three numbered steps. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { steps as t } from "../content";
</script>

<section class="pg-sec" aria-labelledby="go-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="go-h" eyebrow={t.pill} heading={t.h2} center>
				{#snippet icon()}
					<path d="M4 10h12M11 5l5 5-5 5" />
				{/snippet}
			</SectionHead>
		</div>
		<ol class="go">
			{#each t.items as item, i (item.title)}
				<li class="rv">
					<span class="gn">{i + 1}</span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.go {
		list-style: none;
		padding: 0;
		margin: 52px 0 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	li {
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 28px;
		background: #fff;
	}
	.gn {
		display: inline-flex;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--accent);
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 16px;
	}
	/* `.go h3`: beats the landing reset of heading margins. */
	.go h3 {
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
	@media (max-width: 860px) {
		.go {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
