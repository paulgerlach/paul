<script lang="ts">
	import facade from "$lib/assets/landing/vorgehen/facade.webp?enhanced";
	import tenant from "$lib/assets/landing/mieterportal/tenant.jpg?enhanced";
	import Hero from "$lib/landing/sections/uv/Hero.svelte";
	import { hero } from "../content";
	import PortalMock from "./PortalMock.svelte";
</script>

<Hero
	id="mp-h1"
	size="lg"
	{...hero}
	photos={[
		{ src: facade, sizes: "25vw" },
		{ src: tenant, sizes: "35vw", objectPosition: "45% 35%" },
	]}
>
	{#snippet mock()}<PortalMock />{/snippet}
</Hero>
