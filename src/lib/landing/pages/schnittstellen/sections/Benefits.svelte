<!-- "Warum eine Plattform" (.si-ben): four numbered cards, the first one dark. -->
<script lang="ts">
	import SectionHead from "$lib/landing/components/SectionHead.svelte";
	import { benefits as t } from "../content";
</script>

<section class="pg-sec alt" aria-labelledby="vt-h">
	<div class="wrap">
		<div class="head">
			<SectionHead id="vt-h" eyebrow={t.pill} heading={t.h2}>
				{#snippet icon()}
					<path
						d="M10 2.5l1.6 4.4 4.4 1.6-4.4 1.6L10 14.5l-1.6-4.4L4 8.5l4.4-1.6zM15.5 13.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"
					/>
				{/snippet}
			</SectionHead>
		</div>
		<div class="ben">
			{#each t.items as item, i (item.title)}
				<article class={["rv", i === 0 && "dark"]}>
					<span class="bn">{i + 1}</span>
					<h3>{item.title}</h3>
					<p>{item.text}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
	}
	.ben {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
		margin-top: 48px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 20px;
		padding: 26px 24px;
		transition:
			transform 0.3s,
			box-shadow 0.3s;
	}
	article:hover {
		transform: translateY(-3px);
		box-shadow: 0 20px 40px -28px rgba(30, 50, 45, 0.35);
	}
	article.dark {
		background: var(--ink);
		color: #fff;
		border-color: var(--ink);
	}
	.bn {
		display: inline-flex;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		background: var(--bg);
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 14px;
	}
	.dark .bn {
		background: var(--accent);
		color: var(--ink);
	}
	/* `.ben h3`: beats the landing reset of heading margins. */
	.ben h3 {
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
		.ben {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.ben {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		article:hover {
			transform: none;
		}
	}
</style>
