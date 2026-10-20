<!--
  "Ein Bericht für Eigentümer. In wenigen Klicks." (`.aw-2` + `.arp`): the
  text with the three formats beside the report fanning out of its stack.
-->
<script lang="ts">
	import Icon from "$lib/landing/pages/dashboard/components/Icon.svelte";
	import Mark from "../components/Mark.svelte";
	import Split from "../components/Split.svelte";
	import Tick from "../components/Tick.svelte";
	import { report } from "../content";

	const { doc } = report;
</script>

<Split id="ar-h" pill={report.pill} h2={report.h2} text={report.text}>
	{#snippet extra()}
		<div class="arp-f rv">
			{#each report.formats as f (f.text)}
				<span><Icon name={f.icon} />{f.text}</span>
			{/each}
		</div>
	{/snippet}
	{#snippet visual()}
		<div class="arp rv in">
			<div class="arp-pg b" aria-hidden="true"></div>
			<div class="arp-pg a" aria-hidden="true"></div>
			<article class="arp-doc">
				<header>
					<span class="arp-l"><Mark /></span>
					<span><b>{doc.title}</b><small>{doc.sub}</small></span>
				</header>
				<div class="arp-k">
					{#each doc.kpis as k (k.label)}
						<div>
							<small>{k.label}</small><b class={[k.good && "g"]}
								>{k.value}{#if k.unit}
									<em>{k.unit}</em>{/if}</b
							>
						</div>
					{/each}
				</div>
				<div class="arp-ch">
					{#each doc.bars as h, i (i)}<i style:--h="{h}%" style:--i={i}
						></i>{/each}
				</div>
				<div class="arp-ls">
					{#each doc.checks as c (c)}<span><i></i>{c}</span>{/each}
				</div>
				<span class="arp-demo">{doc.demo}</span>
			</article>
			<span class="arp-ok"><span class="tk"><Tick /></span> {report.done}</span>
		</div>
	{/snippet}
</Split>

<style>
	.arp-f {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-top: 22px;
	}
	.arp-f span {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 10px;
		padding: 8px 12px;
		font-size: 13.5px;
		font-weight: 500;
	}
	.arp-f :global(svg) {
		width: 15px;
		height: 15px;
	}
	.arp {
		position: relative;
		height: 440px;
		display: grid;
		place-items: center;
	}
	.arp-pg,
	.arp-doc {
		position: absolute;
		width: min(340px, 86%);
		height: 400px;
		background: #fff;
		border-radius: 12px;
		border: 1px solid var(--hair);
		box-shadow: 0 30px 60px -40px rgba(30, 50, 45, 0.5);
	}
	.arp-pg {
		transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s;
	}
	.arp.in .arp-pg.a {
		transform: translate(34px, 14px) rotate(5deg);
	}
	.arp.in .arp-pg.b {
		transform: translate(-34px, 14px) rotate(-5deg);
	}
	.arp-doc {
		padding: 20px;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.arp-doc header {
		display: flex;
		gap: 10px;
		align-items: center;
		border-bottom: 1px solid var(--hair);
		padding-bottom: 12px;
	}
	.arp-l {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: var(--g1);
		display: grid;
		place-items: center;
	}
	.arp-l :global(svg) {
		width: 14px;
		height: 14px;
	}
	.arp-doc header b {
		display: block;
		font-size: 14px;
		font-weight: 600;
	}
	.arp-doc header small {
		font-size: 11.5px;
		color: var(--muted);
	}
	.arp-k {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}
	.arp-k div {
		background: var(--bg);
		border-radius: 9px;
		padding: 8px;
	}
	.arp-k small {
		display: block;
		font-size: 10px;
		color: var(--muted);
	}
	.arp-k b {
		font-size: 15px;
		font-weight: 600;
	}
	.arp-k em {
		font-style: normal;
		font-size: 9.5px;
		color: var(--muted);
		font-weight: 500;
	}
	.arp-k b.g {
		color: #2f7a3c;
	}
	.arp-ch {
		flex: 1;
		display: flex;
		align-items: flex-end;
		gap: 6px;
		border-bottom: 1px solid var(--hair);
		padding-bottom: 2px;
	}
	.arp-ch i {
		flex: 1;
		height: var(--h);
		background: #b9d7c0;
		border-radius: 4px 4px 1px 1px;
		transform: scaleY(0);
		transform-origin: bottom;
		transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)
			calc(0.4s + var(--i) * 0.06s);
	}
	.arp-ch i:last-child {
		background: var(--g1);
	}
	.arp.in .arp-ch i {
		transform: none;
	}
	.arp-ls {
		display: grid;
		gap: 6px;
		font-size: 12px;
		color: var(--muted);
	}
	.arp-ls span {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.arp-ls i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--g2);
	}
	.arp-demo {
		position: absolute;
		right: 16px;
		bottom: 12px;
		font-size: 10px;
		color: var(--faint);
	}
	.arp-ok {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, 10px);
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: var(--g1);
		color: #fff;
		border-radius: 999px;
		padding: 8px 16px 8px 9px;
		font-size: 13px;
		font-weight: 600;
		opacity: 0;
		transition:
			opacity 0.4s 1.5s,
			transform 0.4s 1.5s;
		z-index: 2;
	}
	.arp-ok .tk {
		width: 18px;
		height: 18px;
		padding: 3px;
		border-radius: 50%;
		background: #8ad68f;
		display: grid;
		place-items: center;
	}
	.arp-ok .tk :global(svg) {
		width: 12px;
		height: 10px;
	}
	.arp.in .arp-ok {
		opacity: 1;
		transform: translate(-50%, 0);
	}
	@media (max-width: 640px) {
		.arp {
			height: 400px;
		}
	}
</style>
