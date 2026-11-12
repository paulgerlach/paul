<!-- "Drei Fragen. Dann wissen Sie es." (the template's check). -->
<script lang="ts">
	import SvcCheck from "$lib/landing/sections/svc/Check.svelte";
	import { answer, progress } from "../check";
	import { CHECK_ID, check } from "../content";
</script>

<SvcCheck {check} id={CHECK_ID} {answer} {progress} />
