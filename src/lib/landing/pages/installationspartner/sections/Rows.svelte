<script lang="ts">
	import Rows from "$lib/landing/sections/uv/Rows.svelte";
	import Bill from "$lib/landing/sections/uv/tiles/Bill.svelte";
	import Calendar from "$lib/landing/sections/uv/tiles/Calendar.svelte";
	import Doc from "$lib/landing/sections/uv/tiles/Doc.svelte";
	import { bill, calendar, doc, rows } from "../content";
	import MeterPhoto from "./MeterPhoto.svelte";
	import TrackingPhone from "./TrackingPhone.svelte";
	import TwinPhone from "./TwinPhone.svelte";
</script>

<Rows idPrefix="ip-row" {...rows}>
	{#snippet tile(kind)}
		{#if kind === "doc"}<Doc {...doc} />
		{:else if kind === "twin"}<TwinPhone />
		{:else if kind === "calendar"}<Calendar {...calendar} />
		{:else if kind === "tracking"}<TrackingPhone />
		{:else}<Bill {...bill}>
				{#snippet media(on)}<MeterPhoto {on} />{/snippet}
			</Bill>{/if}
	{/snippet}
</Rows>
