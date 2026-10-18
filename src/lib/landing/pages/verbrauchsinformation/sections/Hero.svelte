<script lang="ts">
	import building from "$lib/assets/landing/vorgehen/building-wide.webp?enhanced";
	import tenant from "$lib/assets/landing/verbrauchsinformation/tenant.jpg?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import { hero } from "../content";
	import ConsumptionMock from "./ConsumptionMock.svelte";
</script>

<Hero
	id="vi-h1"
	size="md"
	{...hero}
	photos={[
		{ src: building, sizes: "25vw" },
		{ src: tenant, sizes: "35vw" },
	]}
>
	{#snippet mock()}<ConsumptionMock />{/snippet}
</Hero>
