<!-- "Was für Blei gilt." (the template's definition list). -->
<script lang="ts">
	import SvcDuties from "$lib/landing/sections/svc/Duties.svelte";
	import { DUTIES_ID, duties } from "../content";
</script>

<SvcDuties {duties} id={DUTIES_ID} />
