<!-- "Warum Heidi": 4 reasons, the first one dark. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import Icon from "../components/Icon.svelte";
	import { reasons } from "../content";
</script>

{#snippet sparkle()}
	<path
		d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
	/>
{/snippet}

<section class="sec" aria-labelledby="wh-h">
	<div class="wrap">
		<div class="head">
			<SectionHead
				id="wh-h"
				eyebrow={reasons.eyebrow}
				icon={sparkle}
				heading={reasons.h2}
			/>
		</div>
		<div class="why">
			{#each reasons.items as item (item.title)}
				<article class={["rv", "dark" in item && item.dark && "dark"]}>
					<span class="wi"><Icon name={item.icon} /></span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.sec {
		padding: 104px 0;
		border-top: 1px solid var(--hair);
	}
	.head {
		max-width: 760px;
	}
	.why {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	article {
		background: var(--bg);
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px 24px;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	@media (hover: hover) {
		article:hover {
			transform: translateY(-3px);
			box-shadow: 0 20px 40px -28px rgba(30, 50, 45, 0.35);
		}
	}
	article.dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.wi {
		width: 42px;
		height: 42px;
		border-radius: 12px;
		background: #fff;
		border: 1px solid var(--hair);
		display: grid;
		place-items: center;
	}
	.wi :global(svg) {
		width: 19px;
		height: 19px;
	}
	.dark .wi {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--ink);
	}
	h3 {
		font-size: 19px;
		font-weight: 600;
		margin-top: 22px;
		letter-spacing: -0.01em;
	}
	p {
		font-size: 15px;
		color: var(--muted);
		margin-top: 8px;
		line-height: 1.5;
	}
	.dark p {
		color: rgba(255, 255, 255, 0.7);
	}
	@media (max-width: 1040px) {
		.why {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.sec {
			padding: 72px 0;
		}
		.why {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
