<!--
  Step "Weitere Leistungen" (several), and behind "Weitere
  Service-Dienstleistungen dazubuchen" the further services (open when one
  of them is chosen).
-->
<script lang="ts">
	import reltix from "$lib/assets/landing/self-service/reltix.webp?enhanced";
	import { prefersReducedMotion } from "$lib/landing/motion";
	import { ROUTE_ENERGIEAUSWEIS } from "$lib/routes";
	import { tick } from "svelte";
	import { EXTRAS, MORE_EXTRAS } from "../data";
	import Options, { type Card } from "../ui/Options.svelte";
	import Question from "../ui/Question.svelte";
	import { getSelfService } from "../wizard.svelte";

	const w = getSelfService();
	const order = EXTRAS.map((z) => z.v as string);
	const card = (z: (typeof EXTRAS)[number]): Card => ({
		v: z.v,
		label: z.title,
		icon: z.icon,
		price: [z.price, z.per],
		small: z.small,
		more: z.text,
		logo: z.v === "bk" ? [reltix.img.src, "Reltix"] : undefined,
	});
	const main = EXTRAS.filter((z) => !MORE_EXTRAS.includes(z.v)).map(card);
	const more = EXTRAS.filter((z) => MORE_EXTRAS.includes(z.v)).map(card);
	let open = $state(w.s.zusatz.some((k) => MORE_EXTRAS.includes(k)));
	let box = $state<HTMLDivElement>();

	function pick(v: string) {
		const next = w.s.zusatz.includes(v)
			? w.s.zusatz.filter((x) => x !== v)
			: [...w.s.zusatz, v];
		w.s.zusatz = order.filter((k) => next.includes(k));
	}

	async function toggle() {
		open = !open;
		if (!open) return;
		await tick();
		box?.scrollIntoView({
			behavior: prefersReducedMotion() ? "auto" : "smooth",
			block: "nearest",
		});
	}
</script>

<Question
	text="Wofür wünschen Sie ein Angebot?"
	hint="Mehrfachauswahl möglich"
/>
<Options class="zus" options={main} value={w.s.zusatz} onpick={pick} />
<p class="ss-zmore">
	Einstiegspreise als Richtwert, netto. Den genauen Preis ergänzen wir in Ihrem
	Angebot.
</p>
<p class="ss-zmore">
	Mehr zum Thema: <a
		class="ss-zl"
		href={ROUTE_ENERGIEAUSWEIS}
		target="_blank"
		rel="noopener">Energieausweis von Heidi →</a
	>
</p>
<button
	type="button"
	class="ss-add ss-xmore"
	aria-expanded={open}
	aria-controls="ss-xbox"
	onclick={toggle}
	><span class="ss-xch" aria-hidden="true">+</span>Weitere
	Service-Dienstleistungen dazubuchen</button
>
<div class="ss-xbox" id="ss-xbox" hidden={!open} bind:this={box}>
	<p class="ss-q">Weitere Service-Dienstleistungen</p>
	<Options class="zus zus2" options={more} value={w.s.zusatz} onpick={pick} />
	<p class="ss-zmore">Preise netto zzgl. MwSt.</p>
</div>
