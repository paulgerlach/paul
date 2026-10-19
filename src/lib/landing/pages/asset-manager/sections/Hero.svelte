<script lang="ts">
	import Hero from "$lib/landing/sections/sg/Hero.svelte";
	import { calc, hero } from "../content";
</script>

<Hero {hero} {calc} />
