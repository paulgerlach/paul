<!-- The hero (`.db-hero`): /dashboard's frame with one line. -->
<script lang="ts">
	import HeroFrame from "$lib/landing/pages/dashboard/components/HeroFrame.svelte";
	import { hero } from "../content";
</script>

<HeroFrame
	pill={hero.pill}
	h1={hero.h1}
	primary={hero.primary}
	secondary={hero.secondary}
>
	{#snippet line()}
		<span class="l1">{hero.line}</span>
	{/snippet}
</HeroFrame>
