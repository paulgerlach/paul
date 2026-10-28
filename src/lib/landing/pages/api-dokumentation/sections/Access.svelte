<!-- Zugang anfragen (.ad-sec.ad-cta): the dark closing card of the documentation. -->
<script lang="ts">
	import { access, ARTICLE } from "../content";
</script>

<article class="cta" id={ARTICLE.access}>
	<div>
		<h2>{access.h2}</h2>
		<p>{access.text}</p>
	</div>
	<div class="b">
		<a class="bk" href={access.primary.href}
			>{access.primary.text} <span class="ar" aria-hidden="true">→</span></a
		>
		<a class="gh" href={access.secondary.href}>{access.secondary.text}</a>
	</div>
</article>

<style>
	.cta {
		margin-top: 56px;
		scroll-margin-top: 90px;
		background: #1e322d;
		color: #fff;
		border-radius: 22px;
		padding: 40px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 32px;
		align-items: center;
	}
	/* `.cta h2`: beats the landing reset's letter-spacing. */
	.cta h2 {
		font-size: clamp(26px, 2.6vw, 34px);
		letter-spacing: -0.03em;
		font-weight: 500;
		line-height: 1.1;
	}
	/* Not a direct child of the article: the design's `.ad-sec > p` rules
	   don't apply, only the colour. */
	p {
		color: rgba(255, 255, 255, 0.72);
	}
	.b {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	/* .bk-next.inv */
	.bk {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		background: var(--accent);
		color: var(--ink);
		font-size: 15.5px;
		font-weight: 600;
		border-radius: 11px;
		padding: 14px 22px;
		transition:
			background 0.2s,
			transform 0.15s;
	}
	.bk:hover {
		background: #fff;
	}
	.bk:active {
		transform: scale(0.98);
	}
	.ar {
		transition: transform 0.25s;
	}
	.bk:hover .ar {
		transform: translateX(4px);
	}
	.gh {
		display: flex;
		justify-content: center;
		border: 1px solid rgba(255, 255, 255, 0.24);
		border-radius: 11px;
		padding: 13px 20px;
		font-size: 15.5px;
		font-weight: 600;
		color: #fff;
		transition: border-color 0.2s;
	}
	.gh:hover {
		border-color: rgba(255, 255, 255, 0.5);
	}
	@media (max-width: 640px) {
		.cta {
			grid-template-columns: 1fr;
			padding: 28px;
		}
	}
</style>
