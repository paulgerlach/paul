<!-- "Was das Gesetz verlangt." (the template's definition list). -->
<script lang="ts">
	import SvcDuties from "$lib/landing/sections/svc/Duties.svelte";
	import { duties } from "../content";
</script>

<SvcDuties {duties} id="pflichten" />
