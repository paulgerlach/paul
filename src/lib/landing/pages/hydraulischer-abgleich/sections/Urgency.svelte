<!--
  "Neue Heizung ohne Abgleich? Das ist ein Verstoß." (the template's dark
  band). The third card counts the days to 30.9.2027 for the Berlin day of
  the page's DeadlineClock (never `Date.now()` here).
-->
<script lang="ts">
	import { getDeadlineClock } from "$lib/landing/deadline/clock.svelte";
	import SvcUrgency from "$lib/landing/sections/svc/Urgency.svelte";
	import { urgency } from "../content";
	import { daysUntilInspection, thousands } from "../deadline";

	const clock = getDeadlineClock();
	const days = $derived(daysUntilInspection(clock.today));
	const content = $derived({
		...urgency,
		cards: [
			...urgency.cards,
			{
				label: urgency.countdown.label,
				value: thousands(days) + urgency.countdown.suffix,
				sub: urgency.countdown.sub,
				count: { to: days, suffix: urgency.countdown.suffix },
			},
		],
	});
</script>

<SvcUrgency urgency={content} />
