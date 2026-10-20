<!-- /dashboard's closing card (`.db-end`) with this page's texts. -->
<script lang="ts">
	import type { SuperValidated } from "sveltekit-superforms";
	import type { SwitchInquiry } from "$lib/forms/switchInquiry";
	import Closing from "$lib/landing/pages/dashboard/sections/Closing.svelte";
	import { closing } from "../content";

	let { form }: { form: SuperValidated<SwitchInquiry> } = $props();
</script>

<Closing {form} content={closing} />
