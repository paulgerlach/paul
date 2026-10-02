<script lang="ts">
	import {
		berlinBear,
		dumax,
		harte,
		hsp,
		idgim,
		quarterback,
		vitec,
		wagner,
		winfried,
	} from "$lib/assets/icons";
	import TickerItems from "./TickerItems.svelte";

	const logos = {
		berlinBear,
		dumax,
		harte,
		hsp,
		idgim,
		quarterback,
		vitec,
		wagner,
		winfried,
	};
</script>

<div class="ticker-wrap pb-5 max-medium:hidden">
	<TickerItems {logos} />
</div>
