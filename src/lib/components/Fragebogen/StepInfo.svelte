<script lang="ts">
	import { chevron, info_circle_grey } from "$lib/assets/icons";
	import { slideToggle } from "$lib/attachments/slideToggle";
	import Image from "$lib/components/Basic/Image/Image.svelte";

	let { activeStep }: { activeStep: number } = $props();

	const texts = [
		"Diese Angabe hilft uns, die Größe und Struktur Ihres Immobilienbestands besser einzuordnen. Auf dieser Basis können wir unsere Lösungen und Empfehlungen passgenau auf Ihre Anforderungen abstimmen. Die Informationen werden ausschließlich zur besseren Beratung und Einordnung Ihrer Situation verwendet.",
		"Diese Angabe hilft uns, besser einzuordnen, wie Ihre aktuelle Messdienstleister-Struktur aussieht und wie komplex die Zusammenarbeit organisiert ist. So können wir Ihre Situation besser verstehen und gezielt darauf eingehen.",
		"Mit Ihrer Antwort helfen Sie uns, besser zu verstehen, wie zufrieden Sie aktuell mit der Zusammenarbeit mit Ihrem Messdienstleister sind. Die Einschätzung dient als Grundlage, um Prozesse, Servicequalität und Alternativen besser einordnen zu können.",
		"Mit dieser Frage möchten wir verstehen, ob es aktuell ein Objekt gibt, bei dem zeitnah Unterstützung, Klärung oder eine konkrete Lösung erforderlich ist. So können wir Prioritäten setzen und gezielt reagieren.",
		"Ihre Angaben helfen uns, Ihre Verwaltung besser kennenzulernen und Ihnen ein regional passendes Angebot zu erstellen. So können wir sicherstellen, dass die Lösung genau auf Ihre Gegebenheiten zugeschnitten ist.",
		"Um eine reibungslose und effiziente Bearbeitung Ihrer Anfrage zu gewährleisten, benötigen wir Ihre persönlichen Daten. Diese ermöglichen es uns, bei eventuellen Rückfragen direkt mit Ihnen in Kontakt zu treten.",
	];

	const text = $derived(texts[activeStep] ?? "Keine Informationen verfügbar.");

	let isInfoOpened = $state(false);
</script>

<div
	class="questionare-info mt-2 -mr-10 w-full max-w-[40%] max-large:max-w-full max-medium:mr-0 max-small:order-1 max-small:mt-0"
>
	<div class="questionare-answer-item rounded-2xl bg-dark_green/5">
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (markup kept from Next) -->
		<div
			onclick={() => (isInfoOpened = !isInfoOpened)}
			class={[
				"questionare-answer-header flex cursor-pointer items-center justify-between p-5 max-small:p-4",
				isInfoOpened && "opened",
			]}
		>
			<p
				class="questionare-question flex items-center justify-between gap-3 text-[20px] text-dark_text/40 max-small:gap-2 max-small:text-base"
			>
				<Image
					width={24}
					height={24}
					class="max-small:h-5 max-small:w-5"
					src={info_circle_grey}
					alt="info"
				/>
				Erklärung
			</p>
			<div class="questionare-icon">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					class={[
						isInfoOpened ? "rotate-270" : "rotate-90",
						"colored-to-black size-4 opacity-30 transition-all duration-300",
					]}
					src={chevron}
					alt="chevron"
				/>
			</div>
		</div>
		<div
			class="questionare-answer-content hidden px-5 pb-5 max-small:px-4 max-small:pb-4"
			{@attach slideToggle(isInfoOpened)}
		>
			<p
				class="text-[16px] leading-relaxed text-dark_text/70 max-small:text-sm"
			>
				{text}
			</p>
		</div>
	</div>
</div>
