<!-- Hero (.pr-hero, white): the giant H1 "Hallo, Presse." and the lead set to the right. No `#start`: that's the signup form in the closing card. -->
<script lang="ts">
	import { hero } from "../content";
</script>

<section class="hero" aria-labelledby="pr-h1">
	<div class="wrap">
		<h1 data-hs class="word rv" id="pr-h1">
			{hero.h1}<br />
			<em>{hero.h1Accent}</em>
		</h1>
		<p class="lead rv">{hero.lead}</p>
	</div>
</section>

<style>
	.hero {
		padding: 72px 0 64px;
	}
	/* `.hero h1`: beats the landing reset of heading weights and spacing. */
	.hero h1.word {
		font-size: clamp(64px, 13vw, 200px);
		font-weight: 400;
		letter-spacing: -0.06em;
		line-height: 0.88;
		margin: 0;
	}
	.word em {
		font-style: normal;
		color: var(--ok);
	}
	.lead {
		max-width: 640px;
		margin: 48px 0 0 auto;
		font-size: clamp(17px, 1.4vw, 20px);
		line-height: 1.55;
		color: #3e4d49;
	}
	@media (max-width: 900px) {
		.lead {
			margin-left: 0;
		}
	}
	@media (max-width: 560px) {
		.hero {
			padding: 44px 0 40px;
		}
	}
</style>
