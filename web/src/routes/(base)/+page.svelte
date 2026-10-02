<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import MobileDifference from "$lib/components/Basic/MobileDifference/MobileDifference.svelte";
	import Subscription from "$lib/components/Basic/Subscription/Subscription.svelte";
	import ChatBot from "$lib/components/Common/ChatBot/ChatBot.svelte";
	import HomeHero from "$lib/components/Hero/HomeHero.svelte";
	import Benefits from "$lib/components/Home/Benefits.svelte";
	import Customers from "$lib/components/Home/Customers.svelte";
	import FeatureCards from "$lib/components/Home/FeatureCards.svelte";
	import InstallSteps from "$lib/components/Home/InstallSteps.svelte";
	import { structuredDataScript } from "$lib/components/Home/structuredData";
	import FunctionsList from "$lib/components/Swipers/FunctionsList.svelte";
	import FunctionsSwiper from "$lib/components/Swipers/FunctionsSwiper.svelte";
	import NewsList from "$lib/components/Swipers/NewsList.svelte";
	import NewsSwiper from "$lib/components/Swipers/NewsSwiper.svelte";
	import PersonSwiper from "$lib/components/Swipers/PersonSwiper.svelte";
	import { eu_gdpr, eu_lock, right_arrow } from "$lib/assets/icons";
	import { ROUTE_FUNKTIONEN } from "$lib/routes";
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static JSON-LD, `<` escaped -->
	{@html structuredDataScript}
</svelte:head>

<main id="content">
	<HomeHero />
	<Benefits />
	<FeatureCards />
	<Customers />
	<PersonSwiper />
	<InstallSteps />
	<div class="px-[72px] max-large:px-6">
		<h2
			class="section-title relative mt-48 mb-5 text-center text-[50px] leading-[60px] text-dark_text max-medium:mt-24 max-small:text-2xl max-small:leading-7"
		>
			Essenzielle Funktionen
		</h2>
		<p
			class="mx-auto mb-32 max-w-4xl text-center text-base leading-[19.2px] text-dark_text max-medium:mb-16 max-small:text-sm"
		>
			Profitieren Sie von maßgeschneiderten Lösungen, die Zeit und Kosten
			sparen. Unsere intelligente Technologie nimmt Ihnen Arbei t ab, damit Sie
			sich auf das Wesentliche konzentrieren können.
		</p>
		<MobileDifference>
			{#snippet desktopComponent()}<FunctionsList />{/snippet}
			{#snippet mobileComponent()}<FunctionsSwiper />{/snippet}
		</MobileDifference>
		<a
			class="group mx-auto my-10 flex items-center justify-center gap-2 text-base leading-[19.2px] text-link"
			href={ROUTE_FUNKTIONEN}
		>
			Erfahren Sie mehr
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="arrowLink duration-300 group-hover:translate-x-1.5 group-hover:-rotate-90"
				src={right_arrow}
				alt="chevron"
			/>
		</a>
	</div>
	<div class="bg-section-bg pt-[70px] pb-[100px] max-medium:py-16">
		<h2
			class="relative mx-auto mb-5 max-w-4xl px-[72px] text-center text-[50px] leading-[60px] text-dark_text max-large:px-6 max-medium:text-2xl max-medium:leading-7 max-small:text-xl"
		>
			Wir sind Ihr langfristiger Partner für Klimaschutz-Technologie
		</h2>
		<p
			class="mx-auto mb-10 max-w-4xl px-[72px] text-center text-base leading-[19.2px] text-dark_text max-large:px-6 max-small:text-sm"
		>
			Wir installieren Funksender für Warmwasser, Kaltwasser, für den Verbrauch
			von Heizungen und Rauchmelder.
		</p>
		<MobileDifference>
			{#snippet desktopComponent()}<NewsList />{/snippet}
			{#snippet mobileComponent()}<NewsSwiper />{/snippet}
		</MobileDifference>
		<h2
			class="relative mx-auto mb-5 max-w-4xl text-center text-[25px] leading-[30px] text-dark_text max-small:hidden"
		>
			Nach der EU-Heizkostenverordnung (Artikel 9c) müssen bis 2027 alle
			herkömmlichen Zähler auf fernablesbare Modelle umgerüstet werden, um
			Effizienz und Transparenz zu verbessern.
		</h2>
		<p
			class="mx-auto mb-[84px] max-w-4xl text-center text-base leading-[19.2px] text-dark_text max-small:hidden"
		>
			Immobilienbesitzer müssen daher ihre Systeme entsprechend umrüsten. Wir
			helfen Ihnen
		</p>
		<div
			class="flex items-center justify-center gap-4 max-small:flex-col max-small:gap-4 max-small:px-4"
		>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="h-[269px] w-[313px] max-small:h-auto max-small:w-[220px]"
				src={eu_lock}
				alt="eu_lock"
			/>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="h-[269px] w-[313px] max-small:h-auto max-small:w-[220px]"
				src={eu_gdpr}
				alt="eu_gdpr"
			/>
		</div>
	</div>
	<Subscription />
	<ChatBot isExistingClient={false} />
</main>
