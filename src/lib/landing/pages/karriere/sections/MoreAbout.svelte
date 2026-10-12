<!-- The dark "Mehr über Heidi erfahren?" card (the design's .dm-end / .dm-cta). -->
<script lang="ts">
	import ArrowLink from "$lib/landing/components/ArrowLink.svelte";
	import { more } from "../content";
</script>

<section class="end" aria-labelledby="mh-h">
	<div class="wrap">
		<div class="cta rv">
			<h2 id="mh-h">{more.title}</h2>
			<ArrowLink href={more.cta.href} label={more.cta.text} />
		</div>
	</div>
</section>

<style>
	.end {
		padding: 0 0 110px;
	}
	.cta {
		background: var(--ink);
		color: #fff;
		border-radius: 22px;
		padding: 56px clamp(24px, 5vw, 64px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		flex-wrap: wrap;
	}
	h2 {
		font-size: clamp(26px, 3vw, 40px);
		letter-spacing: -0.03em;
		font-weight: 500;
		max-width: 20ch;
	}
	@media (max-width: 640px) {
		.cta {
			padding: 40px 22px;
		}
	}
</style>
