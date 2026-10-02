<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { checkmarks3, counter, doc_phone } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN, ROUTE_FUNKTIONEN } from "$lib/routes";
</script>

{#snippet moreLink()}
	<a
		href={ROUTE_FUNKTIONEN}
		class="mx-auto mb-10 block w-fit text-center text-base leading-[19.2px] text-green underline"
	>
		mehr erfahren
	</a>
{/snippet}

<div
	class="hero-2 px-[140px] max-megalarge:px-16 max-large:px-6 max-medium:px-5 max-small:pt-20"
>
	<h2
		class="section-title relative mb-5 text-center text-[50px] leading-[60px] text-dark_text max-small:text-2xl max-small:leading-7"
	>
		Jetzt auf Funkzähler umsteigen
	</h2>
	<p
		class="mx-auto mb-16 max-w-3xl text-center text-base leading-[19.2px] text-dark_text max-small:text-sm"
	>
		Revolutionieren Sie Ihr Energiemanagement: Reduzieren Sie Kosten, steigern
		Sie die Effizienz und profitieren Sie von automatisierten Überwachungs- und
		Steuerungslösungen für eine zukunftssichere Verbrauchserfassung.
	</p>
	<div class="mb-[18px] grid grid-cols-2 gap-6 max-medium:grid-cols-1">
		<div
			class="flex flex-col items-center justify-end rounded-base bg-card_dark_bg px-5 pt-8"
		>
			<p
				class="mb-2 text-center text-[25px] leading-[30px] font-bold break-all text-dark_text max-small:text-xl"
			>
				Kostenfreie Installation
			</p>
			<p
				class="text-center text-base leading-[19.2px] text-dark_text max-small:text-sm"
			>
				Wir rüsten Sie kostenlos mit modernsten Funkzählern zur digitalen
				Erfassung Ihres Warm-, Kaltwasser- und Heizungsverbrauchs aus.
			</p>
			<a
				href={ROUTE_FRAGEBOGEN}
				class="mx-auto my-4 flex w-fit items-center justify-center rounded-base border border-dark_green/20 px-6 py-3 text-base leading-[19.2px] text-dark_text/20 duration-300 hover:border-green hover:bg-green hover:text-white"
			>
				Jetzt umrüsten lassen
			</a>
			<div
				class="flex items-center justify-center rounded-t-[20px] bg-white/90 px-[116px] pt-[60px] max-megalarge:px-20"
			>
				<Image
					width={300}
					height={400}
					priority
					sizes="(max-width: 768px) 100vw, 300px"
					src={counter}
					alt="counter"
				/>
			</div>
		</div>
		<div
			class="flex flex-col items-center justify-end rounded-base bg-card_dark_bg px-5 pt-8"
		>
			<p
				class="mb-2 text-center text-[25px] leading-[30px] font-bold break-all text-dark_text max-small:text-xl"
			>
				Dokumenten-Management
			</p>
			<p
				class="text-center text-base leading-[19.2px] text-dark_text max-small:text-sm"
			>
				Alle Verbrauchsdaten werden automatisch erfasst und stehen Ihnen direkt
				für die Betriebskostenabrechnung zur Verfügung.
			</p>
			{@render moreLink()}
			<Image
				width={400}
				height={300}
				priority
				sizes="(max-width: 768px) 100vw, 400px"
				src={doc_phone}
				alt="screenshot"
			/>
		</div>
	</div>
	<div class="mb-20 grid grid-cols-3 gap-[18px] max-medium:grid-cols-1">
		<div
			class="flex flex-col items-center justify-between overflow-hidden rounded-base bg-card_dark_bg px-[25px] pt-8"
		>
			<p
				class="relative z-[2] mb-2 text-center text-[25px] leading-[30px] font-bold break-all text-dark_text max-small:text-xl"
			>
				Dashboard
			</p>
			<p
				class="relative z-[2] mb-12 text-center text-base leading-[19.2px] text-dark_text max-small:text-sm"
			>
				Alle Verbrauchswerte für Warmwasser, Kaltwasser und Heizkosten in einer
				übersichtlichen Darstellung.
			</p>
			<LazyLottie
				animationName="Animation_3"
				id="animation3"
				wrapperClassName="overflow-hidden relative z-[0]"
			/>
		</div>
		<div
			class="flex flex-col items-center justify-between rounded-base bg-card_dark_bg pt-8"
		>
			<p
				class="mb-2 px-[25px] text-center text-[25px] leading-[30px] font-bold break-all text-dark_text max-small:text-xl"
			>
				Digitale Funkablesung
			</p>
			<p
				class="px-[25px] text-center text-base leading-[19.2px] text-dark_text max-small:text-sm"
			>
				Erfassen Sie Verbrauchsdaten über alle Sparten hinweg – komplett ohne
				manuelles Ablesen oder Vor-Ort-Termine.
			</p>
			{@render moreLink()}
			<LazyLottie
				animationName="Animation_2"
				id="animation21"
				wrapperClassName="overflow-hidden pl-10 relative"
			/>
		</div>
		<div
			class="flex flex-col items-center justify-between rounded-base bg-card_dark_bg px-[25px] pt-8"
		>
			<p
				class="mb-2 text-center text-[25px] leading-[30px] font-bold break-all text-dark_text max-small:text-xl"
			>
				Heizkostenabrechnung
			</p>
			<p
				class="text-center text-base leading-[19.2px] text-dark_text max-small:text-sm"
			>
				Erstellen Sie Ihre Betriebskostenabrechnung schnell, einfach und
				präzise.
			</p>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="mt-auto mb-0 block w-full px-16"
				src={checkmarks3}
				alt="checkmarks3"
			/>
		</div>
	</div>
</div>
