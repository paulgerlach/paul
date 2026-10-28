<!--
  "Unsere Kunden" (the design's logo wall `#rf-wall`): the twelve shared
  customer logos in the default order, grey until hovered, the name under
  the logo on hover.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { customerLogos, DEFAULT_LOGO_ORDER } from "$lib/landing/data/logos";
	import Icon from "../components/Icon.svelte";
	import { wall } from "../content";
</script>

<!-- The logos are unconfirmed: see the go-live gate (§2). -->
<section class="pg-sec" aria-labelledby="lw-h">
	<div class="wrap">
		<div class="head c">
			<span class="pill rv"><Icon name="building" />{wall.pill}</span>
			<h2 class="h2 c rv" id="lw-h">
				{wall.h2} <span>{wall.h2Accent}</span>
			</h2>
		</div>
		<ul class="wall">
			{#each DEFAULT_LOGO_ORDER as key (key)}
				{@const logo = customerLogos[key]}
				<li class="logo rv">
					<Image src={logo.src} alt={logo.alt} style="--h:{logo.h}px" /><span
						aria-hidden="true">{logo.alt}</span
					>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.wall {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 12px;
		margin: 44px 0 0;
		padding: 0;
		list-style: none;
	}
	.logo {
		height: 120px;
		border: 1px solid var(--hair);
		border-radius: 18px;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
		position: relative;
		transition:
			transform 0.3s,
			box-shadow 0.3s,
			border-color 0.3s;
	}
	.logo :global(img) {
		max-height: calc(var(--h) * 1.15);
		max-width: 78%;
		width: auto;
		height: auto;
		filter: grayscale(1);
		opacity: 0.75;
		transition:
			filter 0.3s,
			opacity 0.3s;
	}
	.logo:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px -26px rgba(30, 50, 45, 0.35);
		border-color: #d3dcd7;
	}
	.logo:hover :global(img) {
		filter: none;
		opacity: 1;
	}
	.logo span {
		position: absolute;
		bottom: 10px;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 11.5px;
		color: var(--faint);
		opacity: 0;
		transition: opacity 0.25s;
	}
	.logo:hover span {
		opacity: 1;
	}

	@media (max-width: 1040px) {
		.wall {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.wall {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.logo {
			height: 96px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.logo:hover {
			transform: none;
		}
	}
</style>
