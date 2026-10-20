<!--
  "Das ganze Jahr auf einen Blick" (`.aw-sec` + `.ah`): each property's
  heating per month against the previous year, coloured in five steps. The
  grid is decorative; its values are in the `sr-only` table below it. The
  cells scale in once when the card scrolls into view; hovering or clicking
  one shows its value in the tooltip (pointer only, as the design).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Head from "../components/Head.svelte";
	import { heatmap, MONTHS, properties } from "../content";
	import { heatColor, HEAT_SCALE, heatTip } from "../metrics";

	let card: HTMLDivElement;
	let shown = $state(true);
	let tip = $state<{ r: number; j: number; x: number; y: number } | null>(null);

	const entrance = enterView({
		threshold: 0.2,
		prepare: () => (shown = false),
		play: () => {
			shown = true;
		},
	});

	/**
	 * The cell under the pointer, placed from its box against the card's (which
	 * scrolls sideways); none over a gap or a name.
	 */
	function show(event: Event) {
		const cell = (event.target as Element).closest<HTMLElement>("i[data-j]");
		if (!cell) {
			tip = null;
			return;
		}
		const box = cell.getBoundingClientRect();
		const frame = card.getBoundingClientRect();
		tip = {
			r: Number(cell.dataset.r),
			j: Number(cell.dataset.j),
			x: box.left - frame.left + card.scrollLeft + box.width / 2,
			y: box.top - frame.top,
		};
	}
</script>

<section class="sec aw-sec" aria-labelledby="ah-h">
	<Head id="ah-h" pill={heatmap.pill} h2={heatmap.h2} lead={heatmap.lead} />
	<div class="wrap">
		<div class={["ah rv", shown && "in"]} bind:this={card} {@attach entrance}>
			<div
				class="ah-g"
				aria-hidden="true"
				onpointerover={show}
				onclick={show}
				onpointerleave={() => (tip = null)}
			>
				<div class="ah-r ah-hd">
					<span class="ah-n"></span>
					{#each MONTHS as m (m)}<span>{m}</span>{/each}
				</div>
				{#each heatmap.rows as row, r (r)}
					<div class="ah-r" style:--r={r}>
						<span class="ah-n">{properties[r].name}</span>
						{#each row as v, j (j)}
							<i
								class={[tip?.r === r && tip.j === j && "on"]}
								data-r={r}
								data-j={j}
								style:--j={j}
								style:background={heatColor(v)}
							></i>
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
			<div
				class={["ah-tip", tip && "on"]}
				aria-hidden="true"
				style:left="{tip?.x ?? 0}px"
				style:top="{tip?.y ?? 0}px"
			>
				{#if tip}
					<b>{properties[tip.r].name} · {MONTHS[tip.j]}</b>{heatTip(
						heatmap.rows[tip.r][tip.j],
					)}
				{/if}
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
	.ah-r i:hover,
	.ah-r i.on {
		box-shadow: 0 0 0 2px var(--g1);
		transition-delay: 0s !important;
	}
	.ah-tip {
		position: absolute;
		pointer-events: none;
		background: var(--g1);
		color: #fff;
		font-size: 12px;
		line-height: 1.4;
		border-radius: 9px;
		padding: 8px 11px;
		transform: translate(-50%, -110%);
		opacity: 0;
		transition: opacity 0.15s;
		white-space: nowrap;
		z-index: 3;
	}
	.ah-tip.on {
		opacity: 1;
	}
	.ah-tip b {
		display: block;
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
