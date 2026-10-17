<!--
  The hero (.uv-hero): the huge word "Mieterportal" (the H1's accessible text
  is the design's visually hidden sentence), the lead and two CTAs, then a
  strip of three panels bleeding past the page edges: a photo, the portal
  mock and a second photo. Below 620 px only the mock is shown.
-->
<script lang="ts">
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import tenant from "$lib/assets/landing/mieterportal/tenant.jpg?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { focusSignup, START_HREF } from "$lib/landing/cta";
	import { hero } from "../content";
	import PortalMock from "./PortalMock.svelte";
</script>

<section class="hero" aria-labelledby="mp-h1">
	<div class="wrap">
		<div class="top rv">
			<h1 id="mp-h1">
				<span class="sr-only">{hero.srTitle}</span>
				<span class="word" aria-hidden="true">{hero.word}</span>
			</h1>
			<div class="sub">
				<p>{hero.lead}</p>
				<div class="ctas">
					<a
						class="uv-btn w"
						href={hero.primary.href}
						onclick={hero.primary.href === START_HREF ? focusSignup : undefined}
						>{hero.primary.text}</a
					>
					<a class="uv-btn d" href={hero.secondary.href}
						>{hero.secondary.text}</a
					>
				</div>
			</div>
		</div>
	</div>
	<div class="peek rv">
		<figure class="pk ph">
			<Image src={facade} alt="" loading="eager" sizes="25vw" />
		</figure>
		<PortalMock />
		<figure class="pk ph">
			<Image
				src={tenant}
				alt=""
				loading="eager"
				sizes="35vw"
				style="object-position: 45% 35%"
			/>
		</figure>
	</div>
</section>

<style>
	.hero {
		padding: 48px 0 0;
		overflow: hidden;
	}
	.top {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: clamp(22px, 3vw, 40px);
		align-items: end;
	}
	h1 {
		margin: 0;
	}
	.word {
		display: block;
		font-size: clamp(40px, 11.4vw, 172px);
		font-weight: 400;
		letter-spacing: -0.065em;
		line-height: 0.86;
		margin: 0 0 -0.02em -0.04em;
		white-space: nowrap;
	}
	.sub {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 28px;
	}
	.sub p {
		max-width: 620px;
		margin: 0;
		font-size: clamp(20px, 2.2vw, 32px);
		line-height: 1.18;
		letter-spacing: -0.025em;
	}
	.ctas {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		flex: none;
	}

	/* The three panels */
	.peek {
		display: grid;
		grid-template-columns: minmax(0, 0.24fr) minmax(0, 1fr) minmax(0, 0.62fr);
		gap: clamp(14px, 2.4vw, 40px);
		margin: clamp(40px, 6vw, 80px) calc(-1 * clamp(40px, 8vw, 140px)) 0;
		padding-bottom: 110px;
	}
	.pk {
		margin: 0;
		border-radius: 26px;
		overflow: hidden;
		height: clamp(360px, 42vw, 600px);
		position: relative;
	}
	.pk :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 980px) {
		.sub {
			flex-direction: column;
			align-items: flex-start;
		}
		.word {
			line-height: 0.8;
		}
		.peek {
			grid-template-columns: minmax(0, 0.12fr) minmax(0, 1fr) minmax(0, 0.12fr);
			margin-inline: calc(-1 * clamp(16px, 4vw, 40px));
		}
	}
	@media (max-width: 620px) {
		.hero {
			padding-top: 28px;
		}
		.word {
			font-size: clamp(34px, 11.6vw, 80px);
		}
		.peek {
			padding-bottom: 72px;
			grid-template-columns: minmax(0, 1fr);
			margin-inline: 0;
		}
		.pk.ph {
			display: none;
		}
	}
</style>
