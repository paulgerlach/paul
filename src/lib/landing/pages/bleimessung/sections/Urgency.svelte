<!--
  "Bleileitungen müssen raus. Jetzt." (the template's dark band). The first
  card counts the days since 12.1.2026 for the Berlin day of the page's
  DeadlineClock (never `Date.now()` here).
-->
<script lang="ts">
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import SvcUrgency from "$lib/landing/sections/svc/Urgency.svelte";
	import { urgency } from "../content";
	import { daysSinceDeadline, thousands } from "../deadline";

	const clock = getDeadlineClock();
	const days = $derived(daysSinceDeadline(clock.today));
	const content = $derived({
		...urgency,
		cards: [
			{
				label: urgency.since.label,
				value: thousands(days) + urgency.since.suffix,
				sub: urgency.since.sub,
				hot: true,
				count: { to: days, suffix: urgency.since.suffix },
			},
			...urgency.cards,
		],
	});
</script>

<SvcUrgency urgency={content} />
