<!--
  "Ein kurzes Gespräch. Alle Antworten." (.pv-end): the dark card with the
  page's signup form in place of the design's "Gespräch vereinbaren" (plan
  open question 1), its "Häufige Fragen" button and a photo. It's the page's
  only form, so it carries the `start` anchor every "Angebot anfragen" leads
  to; `final` hides the floating CTA while it's in view.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import talk from "$lib/assets/landing/private-vermieter/talk.jpg?enhanced";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";
	import { closing } from "../content";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<section class="end final" id="start" aria-labelledby="pv-eh">
	<div class="wrap">
		<div class="ec rv">
			<div>
				<h2 id="pv-eh">
					{#each closing.h2 as line, i (line)}{#if i > 0}<br
							/>{/if}{line}{/each}
				</h2>
				<p>{closing.text}</p>
				<SignupForm
					{form}
					placement="final"
					inputId="email-bottom"
					submitLabel={closing.submitLabel}
				/>
				<div class="pv-ctas">
					<a class="pv-btn d" href={closing.faq.href}>{closing.faq.text}</a>
				</div>
			</div>
			<figure>
				<Image src={talk} alt="" sizes="(max-width: 900px) 100vw, 380px" />
			</figure>
		</div>
	</div>
</section>

<style>
	.end {
		padding: 20px 0 0;
		overflow: hidden;
	}
	.ec {
		display: grid;
		grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.7fr);
		gap: clamp(24px, 4vw, 56px);
		align-items: center;
		background: var(--card);
		border-radius: 24px;
		padding: clamp(22px, 4vw, 44px);
		max-width: 1000px;
		margin: 0 auto;
	}
	/* The size stays plain `h2`, so #hs-css's sizes (the page) win below
	   1040 px as in the design. */
	h2 {
		font-size: clamp(28px, 3vw, 42px);
		line-height: 1.08;
	}
	/* `.ec h2`: beats the landing reset. */
	.ec h2 {
		font-weight: 400;
		letter-spacing: -0.035em;
	}
	p {
		color: var(--mute);
		font-size: 16px;
		line-height: 1.55;
		margin-top: 16px;
		max-width: 42ch;
	}
	figure {
		margin: 0;
		border-radius: 18px;
		overflow: hidden;
		aspect-ratio: 1/1;
	}
	figure :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	/* The signup form is styled for white backgrounds; here it sits on the
	   dark card (as in CtaCard). */
	.ec :global(.signup-box.final) {
		margin: 24px 0 0;
		max-width: 480px;
	}
	.ec :global(.signup) {
		border-color: transparent;
	}
	.ec :global(.signup input[type="email"]) {
		color: var(--ink);
	}
	.ec :global(.signup input[type="email"]::placeholder) {
		color: var(--muted);
	}
	.ec :global(.final .status),
	.ec :global(.final .error) {
		text-align: left;
	}
	.ec :global(.final .status) {
		color: var(--accent);
	}
	.ec :global(.final .error) {
		color: #f2b8a0;
	}
	.ec :global(.pv-ctas) {
		margin-top: 14px;
	}
	@media (max-width: 900px) {
		.ec {
			grid-template-columns: 1fr;
		}
		figure {
			aspect-ratio: 16/10;
		}
	}
</style>
