<!-- Step "Weitere Leistungen" (several). -->
<script lang="ts">
	import { ROUTE_ENERGIEAUSWEIS } from "$lib/routes";
	import { EXTRAS } from "../data";
	import Options from "../ui/Options.svelte";
	import Question from "../ui/Question.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const order = EXTRAS.map((z) => z.v as string);
</script>

<Question
	text="Wofür wünschen Sie ein Angebot?"
	hint="Mehrfachauswahl möglich"
/>
<Options
	class="zus"
	options={EXTRAS.map((z) => ({
		v: z.v,
		label: z.title,
		icon: z.icon,
		small: z.small,
		more: z.text,
	}))}
	value={w.s.zusatz}
	onpick={(v) => {
		const next = w.s.zusatz.includes(v)
			? w.s.zusatz.filter((x) => x !== v)
			: [...w.s.zusatz, v];
		w.s.zusatz = order.filter((k) => next.includes(k));
	}}
/>
<p class="ss-zmore">
	Mehr zum Thema: <a
		class="ss-zl"
		href={ROUTE_ENERGIEAUSWEIS}
		target="_blank"
		rel="noopener">Energieausweis von Heidi →</a
	>
</p>
