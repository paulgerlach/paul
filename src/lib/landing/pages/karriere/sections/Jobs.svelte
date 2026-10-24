<!--
  "Offene Stellen": one native <details> per job, then the open application.
  Open and close work without JS.
-->
<script lang="ts">
	import Check from "$lib/landing/components/icons/Check.svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import ApplyLink from "../components/ApplyLink.svelte";
	import { areas, jobs } from "../content";

	const areaLabel = (id: string) =>
		areas.items.find((area) => area.id === id)?.label ?? "";
</script>

{#snippet list()}
	<path d="M7 5.5h10M7 10h10M7 14.5h10M3.5 5.5h.01M3.5 10h.01M3.5 14.5h.01" />
{/snippet}

{#snippet summary(title: string, sub: string, tag: string, location: string)}
	<summary>
		<span class="jt"><b>{title}</b><small>{sub}</small></span>
		<span class="tags">
			<i>{tag}</i>
			<i>
				<StrokeIcon
					><path d="M3 9.5L10 3.5l7 6V17H3z" /><path
						d="M8 17v-4.5h4V17"
					/></StrokeIcon
				>{location}
			</i>
		</span>
		<span class="plus" aria-hidden="true">
			<StrokeIcon><path d="M10 4v12M4 10h12" /></StrokeIcon>
		</span>
	</summary>
{/snippet}

{#snippet points(title: string, items: string[])}
	<div>
		<h4>{title}</h4>
		<ul>
			{#each items as item (item)}
				<li><Check />{item}</li>
			{/each}
		</ul>
	</div>
{/snippet}

<section class="sec" id="stellen" aria-labelledby="st-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="st-h"
				eyebrow={jobs.eyebrow}
				icon={list}
				heading={jobs.h2}
			/>
		</div>
		<div class="jobs rv">
			{#each jobs.list as job (job.id)}
				<details class="job">
					{@render summary(
						job.title,
						job.sub,
						areaLabel(job.area),
						job.location,
					)}
					<div class="jd">
						{@render points(jobs.buildTitle, job.build)}
						{@render points(jobs.bringTitle, job.bring)}
						<ApplyLink role={job.id} class="apply">
							{job.applyLabel} <span class="ar" aria-hidden="true">→</span>
						</ApplyLink>
					</div>
				</details>
			{/each}
			<details class="job">
				{@render summary(
					jobs.initiative.title,
					jobs.initiative.sub,
					jobs.initiative.tag,
					jobs.initiative.location,
				)}
				<div class="jd one">
					<p>{jobs.initiative.text}</p>
					<ApplyLink role={jobs.initiative.id} class="apply">
						{jobs.initiative.applyLabel}
						<span class="ar" aria-hidden="true">→</span>
					</ApplyLink>
				</div>
			</details>
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		scroll-margin-top: 72px;
	}
	.head {
		max-width: 760px;
	}
	.jobs {
		margin-top: 40px;
		display: grid;
		gap: 12px;
	}
	.job {
		border: 1px solid var(--hair);
		border-radius: 18px;
		background: #fff;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}
	.job[open] {
		border-color: #c9d2ce;
		box-shadow: 0 20px 40px -30px rgba(30, 50, 45, 0.3);
	}
	summary {
		list-style: none;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto 32px;
		gap: 16px;
		align-items: center;
		padding: 22px 24px;
		cursor: pointer;
		border-radius: 18px;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.jt b {
		display: block;
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.jt small {
		display: block;
		font-size: 14px;
		color: var(--muted);
		margin-top: 2px;
	}
	.tags {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.tags i {
		font-style: normal;
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 12.5px;
		font-weight: 500;
		background: var(--bg);
		border-radius: 999px;
		padding: 5px 11px;
	}
	.tags :global(svg) {
		width: 12px;
		height: 12px;
	}
	.plus {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
		transition:
			transform 0.3s,
			background 0.3s;
	}
	.plus :global(svg) {
		width: 14px;
		height: 14px;
	}
	.job[open] .plus {
		transform: rotate(45deg);
		background: var(--ink);
		border-color: var(--ink);
		color: #fff;
	}
	.jd {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
		padding: 22px 24px 24px;
		border-top: 1px solid var(--hair);
	}
	.jd.one {
		grid-template-columns: 1fr;
	}
	h4 {
		font-size: 14px;
		font-weight: 600;
		color: var(--faint);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	ul {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	li {
		display: flex;
		gap: 10px;
		font-size: 15px;
		line-height: 1.45;
	}
	li :global(svg) {
		flex: none;
		align-self: flex-start;
		width: 10px;
		margin-top: 7px;
	}
	.jd p {
		font-size: 16px;
		color: var(--muted);
		line-height: 1.55;
		max-width: 70ch;
	}
	/* .bk-next.kr-apply */
	.jd :global(.apply) {
		grid-column: 1 / -1;
		justify-self: start;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 4px;
		background: var(--ink);
		color: #fff;
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 13px 18px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.jd :global(.apply:hover) {
		background: #2a443d;
	}
	.jd :global(.apply:active) {
		transform: scale(0.98);
	}
	.jd :global(.apply .ar) {
		transition: transform 0.25s;
	}
	.jd :global(.apply:hover .ar) {
		transform: translateX(4px);
	}
	@media (prefers-reduced-motion: reduce) {
		.job,
		.plus {
			transition: none;
		}
	}
	@media (max-width: 760px) {
		.jd {
			grid-template-columns: minmax(0, 1fr);
		}
		summary {
			grid-template-columns: minmax(0, 1fr) 32px;
		}
		.tags {
			grid-column: 1;
			grid-row: 2;
			justify-content: flex-start;
		}
		.plus {
			grid-column: 2;
			grid-row: 1;
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
	}
</style>
