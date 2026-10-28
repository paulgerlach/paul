<!--
  "Selbst machen, klassischer Messdienst oder Heidi?" (.pv-tb): eight rows,
  three columns, Heidi's highlighted. The marks pop in one after another when
  the table comes into view (below the fold only; the server renders them).
-->
<script lang="ts">
	import { enterView } from "$lib/landing/attachments/enterView";
	import Head from "../components/Head.svelte";
	import { compare, type Mark } from "../content";

	let waiting = $state(false);
	const entrance = enterView({
		prepare: () => (waiting = true),
		play: () => {
			waiting = false;
		},
	});

	const PATHS: Record<Mark, { d: string; width: number; fill?: boolean }> = {
		yes: { d: "M5.5 10.5l3 3 6-7", width: 2.2 },
		no: { d: "M7 7l6 6M13 7l-6 6", width: 1.8 },
		depends: { d: "M6.5 10h7", width: 2 },
	};
	const CLASS: Record<Mark, string> = { yes: "y", no: "n", depends: "t" };
</script>

<section class="cmp" aria-labelledby="pv-ch">
	<div class="wrap">
		<Head id="pv-ch" eyebrow={compare.eyebrow} lines={compare.h2} center />
		<div
			class={["tb rv", waiting && "wait"]}
			role="table"
			aria-label={compare.label}
			{@attach entrance}
		>
			<div class="tr h" role="row">
				<span role="columnheader"></span>
				{#each compare.columns as col, c (col)}
					<span role="columnheader" class={[c === 2 && "hi"]}>{col}</span>
				{/each}
			</div>
			{#each compare.rows as row, r (row.label)}
				<div class="tr" role="row">
					<span role="cell">{row.label}</span>
					{#each row.values as mark, c (c)}
						<span role="cell" class={[c === 2 && "hi"]}
							><span
								class="k {CLASS[mark]}"
								role="img"
								aria-label={compare.marks[mark]}
								style:transition-delay="{r * 0.07 + c * 0.05}s"
								><svg viewBox="0 0 20 20" aria-hidden="true"
									><path
										d={PATHS[mark].d}
										stroke="currentColor"
										stroke-width={PATHS[mark].width}
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								></span
							></span
						>
					{/each}
				</div>
			{/each}
		</div>
		<p class="note rv">{compare.note}</p>
	</div>
</section>

<style>
	.cmp {
		padding: 40px 0 120px;
	}
	.tb {
		margin: 56px auto 0;
		max-width: 1000px;
		position: relative;
	}
	/* Heidi's column */
	.tb::before {
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		width: calc(100% / 4.5);
		background: var(--accent);
		border-radius: 16px;
		opacity: 0.96;
	}
	.tr {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) repeat(3, minmax(0, 1fr));
		align-items: center;
		border-bottom: 1px solid var(--line);
		position: relative;
	}
	.tr > span {
		padding: 14px 10px;
		font-size: 15px;
		text-align: center;
		position: relative;
		z-index: 1;
	}
	.tr > span:first-child {
		text-align: left;
		padding-left: 0;
	}
	.tr.h > span {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--mute);
		padding-bottom: 18px;
	}
	.tr .hi,
	.tr.h > span.hi {
		color: var(--ink);
	}
	.k {
		display: inline-grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		transition:
			transform 0.45s cubic-bezier(0.3, 1.5, 0.5, 1),
			opacity 0.3s;
	}
	.k svg {
		width: 13px;
		height: 13px;
	}
	.k.y {
		background: rgba(255, 255, 255, 0.16);
		color: #fff;
	}
	.k.t {
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.55);
	}
	.k.n {
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
	}
	.hi .k {
		background: var(--ink);
		color: var(--accent);
	}
	.wait .k {
		transform: scale(0.4);
		opacity: 0;
	}
	.note {
		text-align: center;
		color: var(--mute);
		font-size: 13px;
		margin-top: 18px;
	}
	@media (max-width: 900px) {
		.tr {
			grid-template-columns: minmax(0, 1.3fr) repeat(3, minmax(0, 0.8fr));
		}
		.tr > span {
			font-size: 13.5px;
			padding: 12px 4px;
		}
		.tr.h > span {
			font-size: 10.5px;
			letter-spacing: 0.04em;
		}
		.tb::before {
			width: calc(100% * 0.8 / 3.7);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.k {
			transition: none;
		}
	}
</style>
