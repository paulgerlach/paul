<script lang="ts">
	import Rows from "$lib/landing/sections/uv/Rows.svelte";
	import Bill from "$lib/landing/sections/uv/tiles/Bill.svelte";
	import Calendar from "$lib/landing/sections/uv/tiles/Calendar.svelte";
	import Doc from "$lib/landing/sections/uv/tiles/Doc.svelte";
	import Phone from "$lib/landing/sections/uv/tiles/Phone.svelte";
	import { bill, calendar, doc, phone, rows } from "../content";
</script>

<Rows idPrefix="wv-row" {...rows}>
	{#snippet tile(kind)}
		{#if kind === "calendar"}<Calendar {...calendar} />
		{:else if kind === "doc"}<Doc {...doc} />
		{:else if kind === "phone"}<Phone {...phone} />
		{:else}<Bill {...bill} />{/if}
	{/snippet}
</Rows>
