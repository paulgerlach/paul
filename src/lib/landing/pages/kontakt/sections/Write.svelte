<!--
  "Schreiben Sie uns." (#schreiben, .kt-form on the grey band): the three
  steps and the "Lieber direkt sprechen?" card on the left, the contact form
  on the right (sticky above 1040 px), with the note under it.
-->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import avatar from "$lib/assets/landing/region/avatar-2.webp?enhanced";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ContactInquiry } from "$lib/forms/contactInquiry";
	import Icon from "../components/Icon.svelte";
	import { FORM_ID, form as texts, write } from "../content";
	import ContactForm from "./ContactForm.svelte";

	let { form }: { form: SuperValidated<ContactInquiry> } = $props();
</script>

<section class="pg-sec alt" id={FORM_ID} aria-labelledby="fm-h">
	<div class="wrap cols">
		<div>
			<span class="pill rv"><Icon name="mail" />{write.pill}</span>
			<h2 class="h2 rv" id="fm-h">
				{write.h2}<br /><span>{write.h2Accent}</span>
			</h2>
			<ol class="steps rv">
				{#each write.steps as step, i (step.title)}
					<li>
						<span class="n">{i + 1}</span><span
							><b>{step.title}</b>{step.text}</span
						>
					</li>
				{/each}
			</ol>
			<div class="direct rv">
				<span class="av"
					><Image
						src={avatar}
						alt={write.avatarAlt}
						width={160}
						height={160}
						sizes="42px"
					/></span
				>
				<span
					><b>{write.alt.title}</b><a href={write.alt.link.href}
						>{write.alt.link.text}</a
					>{write.alt.after}</span
				>
			</div>
		</div>

		<div class="side rv">
			<ContactForm {form} />
			<p class="note"><Icon name="lock" />{texts.note}</p>
		</div>
	</div>
</section>

<style>
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 560px);
		gap: 64px;
		align-items: start;
	}
	.steps {
		list-style: none;
		padding: 0;
		margin: 32px 0 0;
		display: grid;
		gap: 20px;
		max-width: 500px;
	}
	.steps li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		font-size: 15px;
		color: var(--muted);
		line-height: 1.45;
	}
	.n {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--ink);
		color: #fff;
		display: grid;
		place-items: center;
		font-size: 13px;
		font-weight: 600;
		flex: none;
	}
	.steps b {
		display: block;
		color: var(--ink);
		font-size: 16px;
		font-weight: 600;
	}
	.direct {
		display: flex;
		gap: 14px;
		align-items: center;
		margin-top: 34px;
		background: #fff;
		border: 1px solid var(--hair);
		border-radius: 16px;
		padding: 14px 18px;
		max-width: 500px;
		font-size: 14.5px;
		color: var(--muted);
	}
	.direct b {
		display: block;
		color: var(--ink);
		font-size: 15px;
	}
	.direct a {
		color: var(--ink);
		font-weight: 600;
		text-decoration: underline;
	}
	/* .bk-av.bk-avp: the round photo with the green dot */
	.av {
		width: 42px;
		height: 42px;
		position: relative;
		flex: none;
	}
	.av :global(img) {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		display: block;
	}
	.av::after {
		content: "";
		position: absolute;
		right: -1px;
		bottom: -1px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #3e9a57;
		border: 2px solid #fff;
	}
	/* .bk-wrap */
	.side {
		position: sticky;
		top: 96px;
	}
	.note {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		font-size: 12.5px;
		color: var(--faint);
		margin: 14px 0 0;
	}
	.note :global(svg) {
		width: 13px;
		height: 13px;
	}
	@media (max-width: 1040px) {
		.cols {
			grid-template-columns: minmax(0, 1fr);
			gap: 44px;
		}
		.side {
			position: static;
			max-width: 560px;
			margin: 0 auto;
			width: 100%;
		}
	}
</style>
