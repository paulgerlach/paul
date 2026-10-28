<!--
  "Stichtage" (.pg-sec#stichtage, .fr-st): the shared head and four cards,
  each with its date, title, text, law and a badge ("gilt" / "in N Tagen")
  for today; the last card dark.
-->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import { milestones, STICHTAGE_ID } from "../content";
	import { milestoneBadge, parseIso, todayOf } from "../fristen";

	const clock = getDeadlineClock();
	const today = $derived(todayOf(clock.today));
</script>

{#snippet clockIcon()}
	<circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" />
{/snippet}

<section class="pg-sec" id={STICHTAGE_ID} aria-labelledby="fr-st-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="fr-st-h"
				eyebrow={milestones.pill}
				icon={clockIcon}
				heading={milestones.h2}
				center
			/>
		</div>
		<div class="cards">
			{#each milestones.items as item (item.date)}
				<article class={["rv", item.hot && "hot"]}>
					<time datetime={item.date}>{item.dateText}</time>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
					<small>{item.law}</small>
					<span class="sb">{milestoneBadge(parseIso(item.date)!, today)}</span>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	section {
		scroll-margin-top: 72px;
	}
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		margin-top: 48px;
		position: relative;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 20px;
		position: relative;
		display: flex;
		flex-direction: column;
	}
	time {
		font-size: 13px;
		color: var(--muted);
		font-weight: 500;
	}
	/* `.cards h3`: beats the landing reset of heading margins. */
	.cards h3 {
		font-size: 17px;
		font-weight: 600;
		margin-top: 10px;
	}
	p {
		color: var(--muted);
		font-size: 14.5px;
		line-height: 1.5;
		margin-top: 6px;
		flex: 1;
	}
	small {
		display: block;
		font-size: 12px;
		color: var(--faint);
		margin-top: 12px;
	}
	.sb {
		position: absolute;
		top: 18px;
		right: 18px;
		font-size: 11px;
		font-weight: 600;
		border-radius: 999px;
		padding: 3px 8px;
		background: #eef1ef;
		color: var(--muted);
	}
	article.hot {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.hot :is(time, p, small) {
		color: rgba(255, 255, 255, 0.7);
	}
	.hot .sb {
		background: var(--accent);
		color: var(--ink);
	}
	@media (max-width: 900px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 560px) {
		.cards {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
