<script lang="ts">
	import Rows from "$lib/landing/sections/uv/Rows.svelte";
	import Bill from "$lib/landing/sections/uv/tiles/Bill.svelte";
	import Calendar from "$lib/landing/sections/uv/tiles/Calendar.svelte";
	import Doc from "$lib/landing/sections/uv/tiles/Doc.svelte";
	import Phone from "$lib/landing/sections/uv/tiles/Phone.svelte";
	import PhoneList from "$lib/landing/sections/uv/tiles/PhoneList.svelte";
	import { bill, calendar, doc, phone, rows } from "../content";
</script>

<Rows idPrefix="mw-row" {...rows}>
	{#snippet tile(kind)}
		{#if kind === "bill"}<Bill {...bill} />
		{:else if kind === "doc"}<Doc {...doc} />
		{:else if kind === "calendar"}<Calendar {...calendar} />
		{:else}<Phone
				time={phone.time}
				app={phone.app}
				title={phone.title}
				sub={phone.sub}
			>
				{#snippet screen()}<PhoneList
						items={phone.items}
						badges={phone.badges}
					/>{/snippet}
			</Phone>{/if}
	{/snippet}
</Rows>
