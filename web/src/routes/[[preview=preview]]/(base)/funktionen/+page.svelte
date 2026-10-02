<script lang="ts">
	import FAQSection from "$lib/components/Basic/FAQ/FAQSection.svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Kostenfrei from "$lib/components/Basic/Kostenfrei/Kostenfrei.svelte";
	import GeraeteHeroTicker from "$lib/components/Basic/Ticker/GeraeteHeroTicker.svelte";
	import AnimationsSection from "$lib/components/Funktionen/AnimationsSection.svelte";
	import FunktionenGrid from "$lib/components/Funktionen/Grid.svelte";
	import FunktionenHero from "$lib/components/Hero/FunktionenHero.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import ChartSwiper from "$lib/components/Swipers/ChartSwiper.svelte";
	import InstallFaq from "$lib/components/Swipers/InstallFaq.svelte";
	import ReviewsSwiper from "$lib/components/Swipers/ReviewsSwiper.svelte";
	import {
		checkmark_shield,
		chess_shield,
		eu_elipse,
		lock,
		vitolos,
	} from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";

	const badges = [
		{
			icon: chess_shield,
			alt: "chess_shield",
			title: "Gesetzeskonform",
			subtitle: "§ 229 Artikel 3",
		},
		{
			icon: checkmark_shield,
			alt: "checkmark_shield",
			title: "Datenschutzkonform",
			subtitle: "Nach DSGVO",
		},
		{
			icon: lock,
			alt: "lock",
			title: "SSL Verschlüsselung",
			subtitle: "Zertifiziert und Sicher",
		},
		{
			icon: eu_elipse,
			alt: "eu_elipse",
			title: "Server in Europa",
			subtitle: "EU Datenschutz",
		},
	];
</script>

<main id="content">
	<FunktionenHero />
	<GeraeteHeroTicker />
	<FunktionenGrid />
	<div
		class="my-16 px-[100px] max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
	>
		<div
			class="flex items-center justify-center gap-24 max-large:grid max-large:grid-cols-2 max-large:gap-16 max-medium:grid-cols-1 max-medium:gap-10 max-small:gap-5"
		>
			{#each badges as badge (badge.alt)}
				<div
					class="flex items-center justify-start gap-5 max-medium:justify-center max-small:justify-start"
				>
					<Image
						width={0}
						height={0}
						sizes="100vw"
						src={badge.icon}
						alt={badge.alt}
					/>
					<div>
						<p class="text-[15px] text-dark_text max-small:text-xs">
							{badge.title}
						</p>
						<p class="text-[15px] text-dark_text/50 max-small:text-xs">
							{badge.subtitle}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<AnimationsSection />
	<div
		class="my-16 space-y-12 px-20 max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
	>
		<h5
			class="mx-auto max-w-2xl text-center text-[30px] text-dark_text max-small:text-xl"
		>
			&bdquo;Dank Heidi erfüllen wir alle gesetzlichen Vorgaben zur
			Verbrauchserfassung und sparen gleichzeitig wertvolle Zeit. Die
			automatische Datenerfassung und digitale Abrechnung machen unsere Prozesse
			effizienter und zuverlässiger.&ldquo;
		</h5>
		<p class="text-center text-lg text-dark_text max-small:text-base">
			<b>Fabian Höhne</b>, Vitolus
		</p>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="mx-auto block"
			src={vitolos}
			alt="vitolos"
		/>
	</div>

	<div
		class="my-16 space-y-2.5 px-20 max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
	>
		<h5
			class="mx-auto max-w-3xl text-center text-[50px] leading-[60px] text-dark_text max-medium:text-2xl max-medium:leading-7 max-small:text-xl"
		>
			Alle Verbräuche einer Wohnung als Übersicht
		</h5>
		<p
			class="mx-auto max-w-xl text-center text-lg text-dark_text max-small:text-sm"
		>
			Etablierte Branchengrößen vertrauen den Systemen von Heidi und setzten
			damit auf Innovation des 21. Jahrhunderts
		</p>
		<a
			class="mx-auto !mb-12 flex w-fit items-center justify-center rounded-halfbase bg-green px-10 py-5 text-lg text-dark_text duration-300 hover:opacity-80 max-small:px-8 max-small:py-3 max-small:text-base"
			href={ROUTE_FRAGEBOGEN}
		>
			Zugang sichern
		</a>
		<LazyLottie
			animationName="Animation_10"
			id="score_chart_main"
			wrapperClassName="relative mx-auto max-w-3xl w-fit"
		/>
	</div>
	<ChartSwiper />
	<InstallFaq />
	<ReviewsSwiper />
	<FAQSection />
	<Kostenfrei />
</main>
