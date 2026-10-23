<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import { checkmark_bold } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN, ROUTE_KONTAKT } from "$lib/routes";
</script>

{#snippet feature(text: string)}
	<li
		class="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={checkmark_bold}
			alt="checkmark bold"
		/>
		{text}
	</li>
{/snippet}

<div class="px-8 max-medium:px-5">
	<div class="grid grid-cols-3 gap-5 max-medium:grid-cols-1">
		<div class="relative rounded-base border border-dark_green/20 px-7 py-12">
			<span
				class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-[20px] bg-green px-9 py-1"
			>
				Einstiegspreis
			</span>
			<p class="mb-2 text-center text-[25px] text-dark_text">Heidi</p>
			<p class="mb-7 text-center text-[15px] text-dark_text/20">
				ab <span class="text-[40px] text-dark_text">€200</span> pro Jahr
			</p>
			<p class="mx-auto mb-9 max-w-xs text-center text-[15px] text-dark_text">
				Geeignet für Hausverwaltungen, deren Anforderung geringe Komplexität und
				minimale Verwaltungsarbeit sind.
			</p>
			<a
				href={ROUTE_KONTAKT}
				class="mb-2 flex w-full items-center justify-center rounded-base border border-dark_green/20 py-4 text-lg text-dark_text transition hover:border-dark_green/10"
			>
				Beraten lassen
			</a>
			<a
				href={ROUTE_FRAGEBOGEN}
				class="mb-9 flex w-full items-center justify-center rounded-base border border-transparent bg-dark_green py-4 text-lg text-white transition hover:opacity-80"
			>
				Jetzt starten
			</a>
			<p
				class="mb-4 border-t border-dark_green/20 pt-6 text-lg font-bold text-dark_text"
			>
				Heidi features:
			</p>
			<ul class="space-y-4">
				{@render feature("Rechtssichere Heizkostenabrechnung")}
				{@render feature("Kostenfreie Installation")}
			</ul>
		</div>
		<div class="relative rounded-base border border-dark_green/20 px-7 py-12">
			<span
				class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-[20px] bg-green px-9 py-1"
			>
				25% sparen
			</span>
			<p class="mb-2 text-center text-[25px] text-dark_text">
				Heidi<span
					class="ml-1.5 rounded-base bg-green px-2 py-0.5 text-lg text-dark_text"
					>Plus</span
				>
			</p>
			<p class="mb-7 text-center text-[15px] text-dark_text/20">
				ab <span class="text-[40px] text-dark_text">€150</span> pro Jahr
			</p>
			<p class="mx-auto mb-9 max-w-xs text-center text-[15px] text-dark_text">
				Geeignet für Hausverwaltungen, deren Anforderung effiziente Prozesse und
				geringer Verwaltungsaufwand sind.
			</p>
			<a
				href={ROUTE_KONTAKT}
				class="mb-2 flex w-full items-center justify-center rounded-base border border-dark_green/20 py-4 text-lg text-dark_text transition hover:border-dark_green/10"
			>
				Angebot sichern
			</a>
			<a
				href={ROUTE_FRAGEBOGEN}
				class="mb-9 flex w-full items-center justify-center rounded-base border border-transparent bg-green py-4 text-lg text-white transition hover:opacity-80"
			>
				Kostenvoranschlag erhalten
			</a>
			<p
				class="mb-4 border-t border-dark_green/20 pt-6 text-lg font-bold text-dark_text"
			>
				Heidi features:
			</p>
			<ul class="space-y-4">
				{@render feature("Kostenfreie Installation und Wartung")}
				{@render feature("Rechtssichere Heizkostenabrechnung")}
				{@render feature("Verbrauchs- & Mieter-Information")}
			</ul>
		</div>
		<div class="relative rounded-base border border-dark_green/20 px-7 py-12">
			<span
				class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-[20px] bg-[#EFEEEC] px-9 py-1"
			>
				personalisiert
			</span>
			<p class="mb-2 text-center text-[25px] text-dark_text">
				Heidi<span
					class="ml-1.5 rounded-base bg-[#D9D9D9] px-2 py-0.5 text-lg text-dark_text"
					>Großkunde</span
				>
			</p>
			<p class="mb-7 text-center text-[15px] text-dark_text/20">
				Kontaktieren Sie uns für ein Angebot
			</p>
			<p
				class="mx-auto mt-16 mb-9 max-w-xs text-center text-[15px] text-dark_text max-megalarge:mt-10"
			>
				Geeignet für Hausverwaltungen, deren Anforderung es ist, Prozesse zu
				automatisieren und skalierbar zu arbeiten.
			</p>
			<a
				href={ROUTE_KONTAKT}
				class="mb-2 flex w-full items-center justify-center rounded-base border border-dark_green/20 py-4 text-lg text-dark_text transition hover:border-dark_green/10"
			>
				Angebot sichern
			</a>
			<a
				href={ROUTE_FRAGEBOGEN}
				class="mb-9 flex w-full items-center justify-center rounded-base border border-transparent bg-green py-4 text-lg text-white transition hover:opacity-80"
			>
				Kostenvoranschlag erhalten
			</a>
			<p
				class="mb-4 border-t border-dark_green/20 pt-6 text-lg font-bold text-dark_text"
			>
				Heidi features:
			</p>
			<ul class="space-y-4">
				{@render feature("API Schnittstelle zu ERP & CRM System")}
				{@render feature("Persönlicher Ansprechpartner vorort")}
				{@render feature("Rechtssichere Heizkostenabrechnung")}
			</ul>
		</div>
	</div>
</div>
