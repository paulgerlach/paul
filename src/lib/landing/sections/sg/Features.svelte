<!-- "So arbeitet Heidi" (.fr-sec): the five feature rows, alternating sides, each with its animated tile. -->
<script lang="ts">
	import Billing from "./features/Billing.svelte";
	import Hub from "./features/Hub.svelte";
	import Meter from "./features/Meter.svelte";
	import Monthly from "./features/Monthly.svelte";
	import Rollout from "./features/Rollout.svelte";
	import FeatureRow from "./FeatureRow.svelte";
	import type { Features } from "./types";

	let { features }: { features: Features } = $props();
</script>

<section class="fr-sec" aria-label={features.label}>
	<div class="wrap">
		<FeatureRow id="fr1" row={features.meter} tone="g">
			<Meter tile={features.meter.tile} />
		</FeatureRow>
		<FeatureRow id="fr2" row={features.billing} rev>
			<Billing tile={features.billing.tile} />
		</FeatureRow>
		<FeatureRow id="fr3" row={features.monthly}>
			<Monthly tile={features.monthly.tile} />
		</FeatureRow>
		<FeatureRow id="fr4" row={features.hub} rev>
			<Hub tile={features.hub.tile} />
		</FeatureRow>
		<FeatureRow id="fr5" row={features.rollout}>
			<Rollout tile={features.rollout.tile} />
		</FeatureRow>
	</div>
</section>

<style>
	.fr-sec {
		padding: 40px 0 64px;
	}
</style>
