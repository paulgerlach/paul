<script lang="ts">
	import bved from "$lib/assets/landing/partners/bved.webp?enhanced";
	import deumess from "$lib/assets/landing/partners/deumess.webp?enhanced";
	import vdiv from "$lib/assets/landing/partners/vdiv.webp?enhanced";
	import Rows from "$lib/landing/sections/uv/Rows.svelte";
	import Doc from "$lib/landing/sections/uv/tiles/Doc.svelte";
	import { doc, logos, rows } from "../content";
	import LogoTile from "./LogoTile.svelte";

	const images = { vdiv, deumess, bved };
</script>

<Rows idPrefix="vb-row" {...rows}>
	{#snippet tile(kind)}
		{#if kind === "doc"}<Doc {...doc} />
		{:else}<LogoTile logo={images[kind]} line={logos[kind]} />{/if}
	{/snippet}
</Rows>
