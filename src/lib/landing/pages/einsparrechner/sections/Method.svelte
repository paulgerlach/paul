<!-- "So entsteht das Ergebnis." (.pg-sec with .es-how): the centred head and the three cards with their formulas. -->
<script lang="ts">
	import StrokeIcon from "$lib/landing/components/icons/StrokeIcon.svelte";
	import { method } from "../content";
</script>

<section class="pg-sec" aria-labelledby="es-wh">
	<div class="wrap">
		<div class="head">
			<span class="pill rv"
				><StrokeIcon
					><rect x="4.5" y="2.5" width="11" height="15" rx="2" /><path
						d="M7.5 6h5M7.5 10h.01M10 10h.01M12.5 10h.01M7.5 13h.01M10 13h.01M12.5 13h.01"
					/></StrokeIcon
				>{method.pill}</span
			>
			<h2 class="rv" id="es-wh">{method.h2}</h2>
		</div>
		<div class="how">
			{#each method.cards as card (card.title)}
				<article class="rv">
					<span class="ic"
						><StrokeIcon>
							{#if card.icon === "clock"}
								<circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" />
							{:else if card.icon === "warning"}
								<path d="M10 3l7.5 13h-15z" /><path d="M10 8v4M10 14.3v.1" />
							{:else}
								<path d="M5 10.5l3.2 3L15 7" />
							{/if}
						</StrokeIcon></span
					>
					<h3>{card.title}</h3>
					<p>{card.text}</p>
					<code>{card.formula}</code>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.head {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 500;
		box-shadow: 0 1px 2px rgba(30, 50, 45, 0.06);
	}
	.pill :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--faint);
		transform-origin: 50% 50%;
		transition:
			color 0.3s,
			transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	/* #pillfx */
	.pill:hover :global(svg) {
		transform: scale(1.12);
		color: var(--ok);
	}
	/* .dm-h2.c; `.head h2` beats the landing reset of heading margins. */
	.head h2 {
		font-size: clamp(30px, 3.6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-top: 18px;
		text-wrap: balance;
	}
	.how {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
		margin-top: 48px;
	}
	article {
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 18px;
		padding: 24px;
		display: flex;
		flex-direction: column;
	}
	.ic {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		background: #eef4ef;
		color: #2f7a3c;
		display: grid;
		place-items: center;
	}
	.ic :global(svg) {
		width: 20px;
		height: 20px;
	}
	article h3 {
		font-size: 17px;
		font-weight: 600;
		margin-top: 14px;
	}
	p {
		color: var(--muted);
		font-size: 15px;
		line-height: 1.5;
		margin-top: 6px;
		flex: 1;
	}
	code {
		display: block;
		margin-top: 14px;
		font-family: inherit;
		font-size: 13px;
		background: #f6f7f6;
		border-radius: 10px;
		padding: 9px 12px;
		color: var(--ink);
	}

	@media (max-width: 900px) {
		.how {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pill:hover :global(svg) {
			transform: none;
		}
	}
</style>
