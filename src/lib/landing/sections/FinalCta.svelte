<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "$lib/landing/components/SignupForm.svelte";

	let {
		title,
		sub,
		form,
		submitLabel,
		compact = false,
	}: {
		title: string;
		sub: string;
		form: SuperValidated<SwitchInquiry>;
		submitLabel?: string;
		/** Less bottom padding, for pages where another section follows. */
		compact?: boolean;
	} = $props();
</script>

<section class={["final wrap", compact && "compact"]}>
	<h2>{title}</h2>
	<p class="final-sub">{sub}</p>
	<SignupForm {form} {submitLabel} placement="final" inputId="email-bottom" />
</section>

<style>
	.final {
		text-align: center;
		padding-block: 120px 160px;
	}
	h2 {
		font-size: clamp(28px, 3vw, 38px);
	}
	.final.compact {
		padding-bottom: 88px;
	}
	@media (max-width: 640px) {
		.final.compact {
			padding-bottom: 72px;
		}
	}
	.final-sub {
		color: var(--muted);
		font-size: 18px;
		margin-top: 12px;
	}
</style>
