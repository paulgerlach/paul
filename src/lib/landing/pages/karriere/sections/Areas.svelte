<!--
  "Bereiche": the segmented control switches the area panel. The server
  renders Engineering's panel; switching needs JS.
-->
<script lang="ts">
	import type { TransitionConfig } from "svelte/transition";
	import Segmented from "$lib/landing/components/Segmented.svelte";
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import ApplyLink from "../components/ApplyLink.svelte";
	import Icon from "../components/Icon.svelte";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { areas, jobs, jobsInArea, type AreaId } from "../content";

	let area = $state<AreaId>(areas.items[0].id);
	const current = $derived(
		areas.items.find((item) => item.id === area) ?? areas.items[0],
	);
	const open = $derived(jobsInArea(area));
	const options = areas.items.map(({ id, label }) => ({ value: id, label }));

	/**
	 * The design's `kr-in` on a switch. An intro, so the server's panel never
	 * animates; instant with reduced motion.
	 */
	const enter: (node: Element) => TransitionConfig = () => ({
		duration: prefersReducedMotion() ? 0 : 450,
		css: (t: number) =>
			`opacity: ${t}; transform: translateY(${(t - 1) * 10}px) scale(${0.98 + 0.02 * t})`,
	});
</script>

{#snippet building()}
	<path d="M4 17V4h8v13M12 8h4v9M2 17h16M7 7h2M7 10h2M7 13h2" />
{/snippet}

<section class="sec" aria-labelledby="br-h">
	<div class="wrap">
		<div class="top">
			<div class="head">
				<SectionHead
					id="br-h"
					eyebrow={areas.eyebrow}
					icon={building}
					heading={areas.h2}
				/>
			</div>
			<div class="ctl rv">
				<Segmented {options} bind:value={area} label={areas.control} />
			</div>
		</div>
		<div class="area rv" aria-live="polite">
			{#key area}
				<div in:enter>
					<h3>{current.title}</h3>
					<p>{current.text}</p>
					<span class="cnt">
						{#if open > 0}
							{areas.openJobs(open)} ·
							<a href="#stellen">{areas.openJobsLink}</a>
						{:else}
							{areas.initiative} ·
							<ApplyLink role={jobs.initiative.id}
								>{areas.initiativeLink}</ApplyLink
							>
						{/if}
					</span>
				</div>
				<ul in:enter>
					{#each current.points as point (point.text)}
						<li><span><Icon name={point.icon} /></span>{point.text}</li>
					{/each}
				</ul>
			{/key}
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		background: var(--bg);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		flex-wrap: wrap;
	}
	.head {
		max-width: 760px;
	}
	.area {
		margin-top: 40px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 32px;
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
		gap: 40px;
		min-height: 250px;
	}
	h3 {
		font-size: clamp(24px, 2.6vw, 32px);
		font-weight: 500;
		letter-spacing: -0.03em;
	}
	.area p {
		font-size: 16px;
		color: var(--muted);
		margin-top: 12px;
		line-height: 1.55;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 10px;
	}
	li {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		padding: 14px 16px;
		background: var(--bg);
		border-radius: 14px;
		font-size: 15px;
		line-height: 1.45;
	}
	li span {
		flex: none;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: #fff;
		display: grid;
		place-items: center;
	}
	li span :global(svg) {
		width: 15px;
		height: 15px;
	}
	.cnt {
		display: inline-flex;
		gap: 0.3em;
		margin-top: 22px;
		font-size: 13px;
		font-weight: 600;
		color: var(--ok);
	}
	.cnt a,
	.cnt :global(a) {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	@media (max-width: 760px) {
		.area {
			grid-template-columns: minmax(0, 1fr);
			padding: 24px;
			gap: 24px;
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
		.ctl {
			overflow-x: auto;
			max-width: 100%;
		}
	}
</style>
