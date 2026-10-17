<!--
  The design's contact card (.ar-ct): text left, the contact photo right. It's
  the page's only form, so it carries the `start` anchor every "Angebot
  einholen" and "Demo buchen" leads to; the signup form takes the place of the
  design's two buttons (plan README, Signup). `final` lets the floating CTA
  hide while it's in view.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import photo from "$lib/assets/landing/region/contact.webp?enhanced";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import { contact } from "../content";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<section class="final" id="start" aria-labelledby="vg-contact-h">
	<div class="wrap">
		<div class="card rv">
			<div class="txt">
				<h2 id="vg-contact-h">{contact.h2}</h2>
				<p>{contact.text}</p>
				<small>{contact.caption}</small>
				<SignupForm
					{form}
					placement="final"
					inputId="email-bottom"
					submitLabel={contact.submitLabel}
				/>
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
		scroll-margin-top: 72px;
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
	/* The shared form, left-aligned and white on the soft card. */
	.txt :global(.signup-box.final) {
		margin: 22px 0 0;
		max-width: 480px;
	}
	.txt :global(.signup) {
		background: #fff;
	}
	.txt :global(.final .status),
	.txt :global(.final .error) {
		text-align: left;
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
