<script lang="ts">
	import Rows from "$lib/landing/sections/uv/Rows.svelte";
	import Bill from "$lib/landing/sections/uv/tiles/Bill.svelte";
	import Calendar from "$lib/landing/sections/uv/tiles/Calendar.svelte";
	import Phone from "$lib/landing/sections/uv/tiles/Phone.svelte";
	import { bill, calendar, phone, rows } from "../content";
	import CameraPhone from "./CameraPhone.svelte";
</script>

<Rows idPrefix="it-row" {...rows}>
	{#snippet tile(kind)}
		{#if kind === "phone"}<Phone {...phone} />
		{:else if kind === "camera"}<CameraPhone />
		{:else if kind === "calendar"}<Calendar {...calendar} />
		{:else}<Bill {...bill} />{/if}
	{/snippet}
</Rows>
