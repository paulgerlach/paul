<script lang="ts">
	import type { FAQItemType } from "$lib/types";
	import FAQItem from "./FAQItem.svelte";

	const items1: FAQItemType[] = [
		{
			question: "Bin ich verpflichtet, auf Funktechnik umzurüsten?",
			answer:
				"Die Umrüstung auf Funkzähler ist in vielen Fällen gesetzlich vorgeschrieben oder wird empfohlen, um den Energieverbrauch effizienter zu verwalten. Zudem profitieren Sie von automatischer Ablesung und reduziertem Verwaltungsaufwand.",
		},
		{
			question:
				"Gibt es eine gesetzliche Pflicht zum Einbau von Funkmessgeräten?",
			answer:
				"Ja, in Deutschland gibt es gesetzliche Vorgaben zur Einführung von intelligenten Messsystemen. Die genauen Regelungen hängen von Verbrauchsgrenzen und Gebäudearten ab.",
		},
		{
			question: "Welche Daten werden per Funk ausgelesen?",
			answer:
				"Unsere Geräte messen den Verbrauch von Warmwasser, Kaltwasser und Heizenergie. Die erfassten Daten werden sicher und verschlüsselt übertragen, um Datenschutz und Datensicherheit zu gewährleisten.",
		},
		{
			question: "Kann ich meine Verbrauchsdaten in Echtzeit abrufen?",
			answer:
				"Ja, unsere Funkzähler ermöglichen die automatische Erfassung und digitale Übertragung der Verbrauchsdaten, sodass Sie jederzeit aktuelle Werte einsehen können.",
		},
		{
			question: "Wer übernimmt die Installation der Funkgeräte?",
			answer:
				"Die Installation erfolgt durch unsere zertifizierten Experten direkt vor Ort und ist für Sie kostenlos.",
		},
		{
			question: "Welche Kosten entstehen für die Installation?",
			answer:
				"Die Installation der Funkzähler ist für Sie komplett kostenfrei. Es fallen keine zusätzlichen Gebühren an.",
		},
	];
	const items2: FAQItemType[] = [
		{
			question: "Was ist ein Smart-Meter-Gateway (SMGW)?",
			answer:
				"Ein Smart-Meter-Gateway ist eine zentrale Kommunikationsschnittstelle, die Messwerte sicher an Energiedienstleister überträgt und eine intelligente Verbrauchssteuerung ermöglicht.",
		},
		{
			question: "Was versteht man unter einem intelligenten Messgerät?",
			answer:
				"Intelligente Messgeräte erfassen Verbrauchsdaten digital, übertragen sie automatisch und ermöglichen eine präzise Analyse sowie eine effizientere Energienutzung.",
		},
		{
			question:
				"Kann ich mit den Funkzählern eine Betriebskostenabrechnung erstellen?",
			answer:
				"Ja, alle erfassten Verbrauchsdaten stehen Ihnen digital zur Verfügung und können problemlos für die Betriebskostenabrechnung genutzt werden.",
		},
		{
			question: "Ist die Wartung der Geräte inbegriffen?",
			answer:
				"Ja, wir übernehmen die regelmäßige Wartung aller installierten Funkgeräte kostenlos und gewährleisten einen zuverlässigen Betrieb.",
		},
		{
			question: "Welche Kosten fallen für den Service an?",
			answer:
				"Die Installation und Wartung der Geräte ist kostenfrei. Für die weiteren Services fällt ein monatlicher Fixbetrag an.",
		},
		{
			question: "Welche Geräte bietet Heidi an?",
			answer:
				"Wir bieten digitale Funkzähler für Warmwasser, Kaltwasser und Heizung sowie smarte Rauchmelder und weitere Messlösungen für eine effiziente Verbrauchsverwaltung.",
		},
	];

	let openIndex = $state<number | null>(null);
	let openSecondIndex = $state<number | null>(null);

	const handleClick = (index: number) => {
		openIndex = openIndex === index ? null : index;
	};

	const handleSecondClick = (index: number) => {
		openSecondIndex = openSecondIndex === index ? null : index;
	};
</script>

<div
	class="bg-section-bg px-[72px] pt-16 pb-32 max-large:px-6 max-large:pt-8 max-large:pb-20"
>
	<h3
		class="mb-14 text-[45px] leading-[54px] text-dark_text max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px]"
	>
		FAQ
	</h3>
	<div
		class="faq-tabs-answers grid grid-cols-2 gap-[88px] max-large:gap-11 max-medium:grid-cols-1 max-medium:gap-6"
	>
		<div class="faq-answers-container" data-tab="1">
			{#each items1 as item, index (index)}
				<FAQItem
					isOpen={openIndex === index}
					onClick={handleClick}
					{index}
					{item}
				/>
			{/each}
		</div>
		<div class="faq-answers-container" data-tab="2">
			{#each items2 as item, index (index)}
				<FAQItem
					isOpen={openSecondIndex === index}
					onClick={handleSecondClick}
					{index}
					{item}
				/>
			{/each}
		</div>
	</div>
</div>
