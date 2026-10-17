<!-- "Unsere Mission": text with a link to /upgrade-now, and the deadline card. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { mission } from "../content";
	import DeadlineCard from "./DeadlineCard.svelte";

	const clock = getDeadlineClock();
</script>

<section class="ms" aria-labelledby="ms-h">
	<div class="wrap grid">
		<div>
			<SectionHead id="ms-h" eyebrow={mission.eyebrow} heading={mission.h2}>
				{#snippet icon()}
					<path
						d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
					/>
				{/snippet}
			</SectionHead>
			{#if clock.expired}
				<p class="lead rv" data-placeholder="">{mission.leadExpired}</p>
			{:else}
				<p class="lead rv">{mission.lead}</p>
			{/if}
			<a class="ghost rv" href={mission.link.href}>
				{mission.link.text} <span class="ar" aria-hidden="true">→</span>
			</a>
		</div>
		<DeadlineCard />
	</div>
</section>

<style>
	.ms {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
		gap: 64px;
		align-items: center;
	}
	.lead {
		color: var(--muted);
		font-size: clamp(16px, 1.5vw, 19px);
		margin-top: 16px;
		max-width: 52ch;
	}
	.ghost {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		margin-top: 28px;
		border: 1px solid var(--hair);
		background: #fff;
		border-radius: 11px;
		padding: 13px 18px;
		font-size: 15.5px;
		font-weight: 600;
		color: var(--ink);
		transition: border-color 0.2s;
	}
	.ghost:hover {
		border-color: #c3cdc8;
	}
	.ghost .ar {
		transition: transform 0.25s;
	}
	.ghost:hover .ar {
		transform: translateX(4px);
	}
	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
	}
	@media (max-width: 640px) {
		.ms {
			padding: 72px 0;
		}
		.ghost {
			justify-content: center;
		}
	}
</style>
