<!--
  The design's contact card (.ar-ct): text with the two buttons left, the
  facade photo right. `final` lets the floating CTA hide while it's in view.
-->
<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import photo from "$lib/assets/landing/partnerschaften/facade.webp?enhanced";
	import Buttons from "../components/Buttons.svelte";
	import { contact } from "../content";
</script>

<section class="final" aria-labelledby="vg-contact-h">
	<div class="wrap">
		<div class="card rv">
			<div class="txt">
				<h2 id="vg-contact-h">{contact.h2}</h2>
				<p>{contact.text}</p>
				<small>{contact.caption}</small>
				<Buttons />
			</div>
			<figure>
				<Image
					src={photo}
					alt=""
					sizes="(max-width: 980px) 100vw, 480px"
					style={`object-position: ${contact.objectPosition}`}
				/>
			</figure>
		</div>
	</div>
</section>

<style>
	.final {
		padding-block: clamp(72px, 9vw, 128px);
	}
	.wrap {
		max-width: 1280px;
	}
	.card {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.7fr);
		gap: 24px;
		background: var(--soft);
		border-radius: 24px;
		padding: clamp(24px, 3vw, 32px);
		align-items: center;
	}
	.txt {
		padding: clamp(8px, 2vw, 24px);
	}
	h2 {
		font-size: clamp(28px, 3vw, 40px);
		letter-spacing: -0.03em;
		font-weight: 500;
		line-height: 1.1;
	}
	p {
		font-size: 16.5px;
		color: var(--muted);
		line-height: 1.55;
		margin-top: 14px;
		max-width: 44ch;
	}
	small {
		display: block;
		margin-top: 18px;
		font-size: 14px;
		font-weight: 500;
	}
	figure {
		margin: 0;
		border-radius: 18px;
		overflow: hidden;
		aspect-ratio: 4/3.4;
	}
	figure :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	@media (max-width: 980px) {
		.card {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
