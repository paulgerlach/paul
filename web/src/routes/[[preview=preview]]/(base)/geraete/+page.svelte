<script lang="ts">
	import FAQSection from "$lib/components/Basic/FAQ/FAQSection.svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Subscription from "$lib/components/Basic/Subscription/Subscription.svelte";
	import GeraeteHeroTicker from "$lib/components/Basic/Ticker/GeraeteHeroTicker.svelte";
	import ChessSection from "$lib/components/Geraete/ChessSection.svelte";
	import Eigenschaften from "$lib/components/Geraete/Eigenschaften.svelte";
	import GeraeteHero from "$lib/components/Hero/GeraeteHero.svelte";
	import GeraeteangebotSwiper from "$lib/components/Swipers/GeraeteangebotSwiper.svelte";
	import InstallFaq from "$lib/components/Swipers/InstallFaq.svelte";
	import NumberedSwiper from "$lib/components/Swipers/NumberedSwiper.svelte";
	import ReviewsSwiper from "$lib/components/Swipers/ReviewsSwiper.svelte";
	import { checkmark_icon, paket_im } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";

	const paketItems = [
		"Heizungszähler-Funkgerät",
		"Kaltwasserzähler-Funkgerät",
		"Warmwasserzähler -Funkgerät",
		"Funk-Rauchmelder",
	];
</script>

<main id="content">
	<GeraeteHero />
	<GeraeteHeroTicker />
	<NumberedSwiper />
	<Eigenschaften />
	<ChessSection />
	<div
		class="py-16 pr-[60px] pl-[100px] max-large:px-16 max-medium:px-10 max-medium:pr-10 max-small:px-5 max-small:py-10 max-small:pr-5"
	>
		<div
			class="grid grid-cols-2 gap-20 rounded-base bg-[#EFEDEC] px-[72px] pt-[92px] pb-[57px] max-large:grid-cols-1 max-large:p-16 max-medium:p-10 max-small:p-5"
		>
			<Image width={0} height={0} sizes="100vw" src={paket_im} alt="paket" />
			<div class="space-y-6">
				<h4
					class="text-[45px] leading-[54px] text-dark_text max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px]"
				>
					Alles in einem Paket
				</h4>
				<p class="max-small:text-[14px]">
					Wir übernehmen die Installation für Sie
				</p>
				<ul class="space-y-4 max-small:text-[14px]">
					{#each paketItems as item (item)}
						<li class="flex items-center justify-start gap-5">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								src={checkmark_icon}
								alt="checkmark"
							/>
							{item}
						</li>
					{/each}
				</ul>
				<a
					class="flex w-fit cursor-pointer items-center justify-center rounded-halfbase bg-green px-[104px] py-5 text-center text-lg text-white transition hover:opacity-80 max-medium:w-full max-medium:px-0 max-medium:text-center max-small:py-4 max-small:text-base"
					href={ROUTE_FRAGEBOGEN}
				>
					Jetzt installieren lassen
				</a>
			</div>
		</div>
	</div>
	<InstallFaq />
	<ReviewsSwiper />
	<FAQSection />
	<GeraeteangebotSwiper />
	<Subscription />
</main>
