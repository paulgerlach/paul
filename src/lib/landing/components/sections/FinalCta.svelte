<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import SignupForm from "../SignupForm.svelte";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<section class="final wrap">
	<h2>Wechseln war nie einfacher.</h2>
	<p class="final-sub">
		Ein Gespräch, ein Vertrag, fertig. Den Rest übernimmt Heidi.
	</p>
	<SignupForm {form} placement="final" inputId="email-bottom" />
</section>

<style>
	.final {
		text-align: center;
		padding-block: 120px 160px;
	}
	h2 {
		font-size: clamp(28px, 3vw, 38px);
	}
	.final-sub {
		color: var(--muted);
		font-size: 18px;
		margin-top: 12px;
	}
</style>
