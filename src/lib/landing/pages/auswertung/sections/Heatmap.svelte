<!--
  "Das ganze Jahr auf einen Blick" (`.aw-sec` + `.ah`): each property's
  heating per month against the previous year, coloured in five steps. The
  grid is decorative; its values are in the `sr-only` table below it.
-->
<script lang="ts">
	import Head from "../components/Head.svelte";
	import { heatmap, MONTHS, properties } from "../content";
	import { heatColor, HEAT_SCALE, heatTip } from "../metrics";
</script>

<section class="sec aw-sec" aria-labelledby="ah-h">
	<Head id="ah-h" pill={heatmap.pill} h2={heatmap.h2} lead={heatmap.lead} />
	<div class="wrap">
		<div class="ah rv in">
			<div class="ah-g" aria-hidden="true">
				<div class="ah-r ah-hd">
					<span class="ah-n"></span>
					{#each MONTHS as m (m)}<span>{m}</span>{/each}
				</div>
				{#each heatmap.rows as row, r (r)}
					<div class="ah-r" style:--r={r}>
						<span class="ah-n">{properties[r].name}</span>
						{#each row as v, j (j)}
							<i style:--j={j} style:background={heatColor(v)}></i>
						{/each}
					</div>
				{/each}
			</div>
			<div class="ah-f" aria-hidden="true">
				<span>{heatmap.less}</span>
				<span class="ah-sc"
					>{#each HEAT_SCALE as c (c)}<i style:--c={c}></i>{/each}</span
				>
				<span>{heatmap.more}</span>
				<span class="ah-demo">{heatmap.demo}</span>
			</div>
			<table class="sr-only">
				<caption>{heatmap.caption}</caption>
				<thead>
					<tr>
						<td></td>
						{#each MONTHS as m (m)}<th scope="col">{m}</th>{/each}
					</tr>
				</thead>
				<tbody>
					{#each heatmap.rows as row, r (r)}
						<tr>
							<th scope="row">{properties[r].name}</th>
							{#each row as v, j (j)}<td>{heatTip(v)}</td>{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<style>
	.aw-sec {
		padding: clamp(80px, 9vw, 120px) 0;
	}
	.ah {
		position: relative;
		margin-top: 48px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 22px;
		text-align: left;
		overflow-x: auto;
	}
	.ah-g {
		display: grid;
		gap: 5px;
		min-width: 720px;
	}
	.ah-r {
		display: grid;
		grid-template-columns: 150px repeat(12, minmax(0, 1fr));
		gap: 5px;
		align-items: center;
	}
	.ah-hd span {
		font-size: 11px;
		color: var(--muted);
		text-align: center;
	}
	.ah-r .ah-n {
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
		color: var(--ink);
	}
	.ah-r i {
		height: 34px;
		border-radius: 7px;
		transform: scale(0.6);
		opacity: 0;
		transition:
			transform 0.45s cubic-bezier(0.2, 1.2, 0.4, 1),
			opacity 0.35s,
			box-shadow 0.2s;
		cursor: pointer;
	}
	.ah.in .ah-r i {
		transform: none;
		opacity: 1;
		transition-delay: calc(var(--j) * 0.04s + var(--r) * 0.05s);
	}
	.ah-r i:hover {
		box-shadow: 0 0 0 2px var(--g1);
		transition-delay: 0s !important;
	}
	.ah-f {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 18px;
		font-size: 12px;
		color: var(--muted);
		min-width: 720px;
	}
	.ah-sc {
		display: inline-flex;
		gap: 3px;
	}
	.ah-sc i {
		width: 22px;
		height: 10px;
		border-radius: 3px;
		background: var(--c);
	}
	.ah-demo {
		margin-left: auto;
		font-size: 11px;
		font-weight: 600;
		background: #e6f5e7;
		color: #2f7a3c;
		border-radius: 999px;
		padding: 2px 9px;
	}
</style>
