<script lang="ts">
	import Rows from "$lib/landing/sections/uv/Rows.svelte";
	import Bill from "$lib/landing/sections/uv/tiles/Bill.svelte";
	import Calendar from "$lib/landing/sections/uv/tiles/Calendar.svelte";
	import { bill, calendar, rows } from "../content";
	import Decoder from "./Decoder.svelte";
	import GroupCheck from "./GroupCheck.svelte";
</script>

<Rows idPrefix="iop-row" {...rows}>
	{#snippet tile(kind)}
		{#if kind === "decoder"}<Decoder />
		{:else if kind === "bill"}<Bill {...bill} />
		{:else if kind === "check"}<GroupCheck />
		{:else}<Calendar {...calendar} />{/if}
	{/snippet}
</Rows>
