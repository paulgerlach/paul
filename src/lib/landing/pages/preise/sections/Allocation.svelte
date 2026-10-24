<!-- "Umlage" (.pg-sec.alt): what the tenants pay, beside the list of costs with their badges. -->
<script lang="ts">
	import Icon from "../components/Icon.svelte";
	import { allocation } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="pr-uh">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="users" />{allocation.pill}</span>
			<h2 class="h2 rv" id="pr-uh">
				{allocation.h2}<br /><span>{allocation.h2Accent}</span>
			</h2>
			{#each allocation.paragraphs as text (text)}
				<p class="p rv">{text}</p>
			{/each}
		</div>
		<div class="costs rv">
			{#each allocation.rows as row (row.text)}
				<div class="row">
					<span>{row.text}</span><em class={[row.yes && "y"]}>{row.badge}</em>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
		gap: 64px;
		align-items: center;
	}
	.p {
		font-size: 16px;
		color: var(--muted);
		line-height: 1.6;
		margin: 16px 0 0;
		max-width: 56ch;
	}
	.costs {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 8px 22px;
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 14px;
		padding: 14px 0;
		border-top: 1px solid #eef1ef;
		font-size: 15px;
	}
	.row:first-child {
		border-top: 0;
	}
	.row em {
		font-style: normal;
		font-size: 12.5px;
		font-weight: 600;
		white-space: nowrap;
		padding: 4px 10px;
		border-radius: 999px;
		background: #f1f4f2;
		color: var(--muted);
	}
	.row em.y {
		background: #e3f3e4;
		color: #2f6a39;
	}
	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 28px;
		}
	}
</style>
