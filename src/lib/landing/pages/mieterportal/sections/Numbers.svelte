<script lang="ts">
	import Numbers from "$lib/landing/sections/uv/Numbers.svelte";
	import { numbers } from "../content";
	import DashboardTile from "./DashboardTile.svelte";
</script>

<Numbers id="mp-num-h" {...numbers} mediaKind="tile">
	{#snippet media()}<DashboardTile />{/snippet}
</Numbers>
