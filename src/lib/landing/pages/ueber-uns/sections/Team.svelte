<!-- "Das Team": the founder's card (initials, open question 4) and the text with two links. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { careers, team } from "../content";
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
</script>

{#snippet people()}
	<circle cx="8" cy="7" r="3" /><path
		d="M2.5 17c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M13.5 4.5a3 3 0 0 1 0 5.6M15.5 12.8c1 .7 1.7 2 2 4.2"
	/>
{/snippet}

<section class="team" aria-labelledby="team-h">
	<div class="wrap grid">
		<div class="tc rv">
			<span class="av" aria-hidden="true">{team.initials}</span>
			<b>{team.name}</b>
			<small data-placeholder="">{team.role}</small>
			<span class="loc">
				<StrokeIcon
					><path d="M3 9.5L10 3.5l7 6V17H3z" /><path
						d="M8 17v-4.5h4V17"
					/></StrokeIcon
				>{team.location}
			</span>
		</div>
		<div>
			<SectionHead
				id="team-h"
				eyebrow={team.eyebrow}
				heading={team.h2}
				icon={people}
			/>
			<p class="lead rv">{team.lead}</p>
			<div class="tl rv">
				<a href={team.testimonials.href}>
					<StrokeIcon
						><path
							d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z"
						/></StrokeIcon
					>{team.testimonials.text} <span class="ar" aria-hidden="true">→</span>
				</a>
				{#if careers.show}
					<a href={team.jobs.href}>
						<StrokeIcon>{@render people()}</StrokeIcon>{team.jobs.text}
						<span class="ar" aria-hidden="true">→</span>
					</a>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.team {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
		background: var(--bg);
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
		gap: 64px;
		align-items: center;
	}
	.tc {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 22px;
		padding: 36px 28px;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.av {
		width: 96px;
		height: 96px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--accent);
		display: grid;
		place-items: center;
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.tc b {
		font-size: 20px;
		font-weight: 600;
		margin-top: 18px;
	}
	.tc small {
		font-size: 14px;
		color: var(--muted);
		margin-top: 2px;
	}
	.loc {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 16px;
		font-size: 13px;
		font-weight: 500;
		background: var(--bg);
		border-radius: 999px;
		padding: 5px 12px;
	}
	.loc :global(svg) {
		width: 13px;
		height: 13px;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.tl {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 28px;
	}
	.tl a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 11px 16px;
		font-size: 15px;
		font-weight: 600;
		transition: border-color 0.2s;
	}
	.tl a:hover {
		border-color: #c3cdc8;
	}
	.tl a :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
	}
	.tl .ar {
		transition: transform 0.25s;
	}
	.tl a:hover .ar {
		transform: translateX(4px);
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
	}
	@media (max-width: 640px) {
		.team {
			padding: 72px 0;
		}
	}
</style>
