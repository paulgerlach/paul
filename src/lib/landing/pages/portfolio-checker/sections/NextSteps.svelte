<!-- "Für jede Liegenschaft der nächste Schritt." (.pg-sec.pc-nx): the centred head with its lead and the shared per-property list (52 px below, rows indented 48 px below 860 px, as this design). -->
<script lang="ts">
	import NextSteps from "$lib/landing/sections/NextSteps.svelte";
	import Head from "../components/Head.svelte";
	import { nextStepsHead as head } from "../content";
</script>

<section class="pg-sec" aria-labelledby="rep-h">
	<div class="wrap">
		<Head
			id="rep-h"
			pill={head.pill}
			symbol="chart"
			heading={head.heading}
			lead={head.lead}
			center
		/>
		<NextSteps top={52} indent={48} tick="green" />
	</div>
</section>
