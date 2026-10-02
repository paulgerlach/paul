<script lang="ts">
	import CopyLinkButton from "$lib/components/Basic/CopyLinkButton/CopyLinkButton.svelte";
	import FAQSection from "$lib/components/Basic/FAQ/FAQSection.svelte";
	import Kostenfrei from "$lib/components/Basic/Kostenfrei/Kostenfrei.svelte";
	import Loading from "$lib/components/Basic/Loading/Loading.svelte";
	import MobileDifference from "$lib/components/Basic/MobileDifference/MobileDifference.svelte";
	import GeraeteHeroTicker from "$lib/components/Basic/Ticker/GeraeteHeroTicker.svelte";
	import BlogHero from "$lib/components/Hero/BlogHero.svelte";
	import FunktionenHero from "$lib/components/Hero/FunktionenHero.svelte";
	import GeraeteHero from "$lib/components/Hero/GeraeteHero.svelte";
	import HomeHero from "$lib/components/Hero/HomeHero.svelte";
	import ChartSwiper from "$lib/components/Swipers/ChartSwiper.svelte";
	import NumberedSwiper from "$lib/components/Swipers/NumberedSwiper.svelte";
	import FunctionsList from "$lib/components/Swipers/FunctionsList.svelte";
	import FunctionsSwiper from "$lib/components/Swipers/FunctionsSwiper.svelte";
	import GeraeteangebotSwiper from "$lib/components/Swipers/GeraeteangebotSwiper.svelte";
	import InstallFaq from "$lib/components/Swipers/InstallFaq.svelte";
	import NewsList from "$lib/components/Swipers/NewsList.svelte";
	import NewsSwiper from "$lib/components/Swipers/NewsSwiper.svelte";
	import PersonSwiper from "$lib/components/Swipers/PersonSwiper.svelte";
	import ReviewsSwiper from "$lib/components/Swipers/ReviewsSwiper.svelte";
	import Subscription from "$lib/components/Basic/Subscription/Subscription.svelte";
</script>

{#snippet section(name: string)}
	<p
		class="bg-dark_green px-5 py-2 font-mono text-sm text-white"
		data-testid="section-{name}"
	>
		{name}
	</p>
{/snippet}

<main class="pt-24">
	{@render section("HomeHero")}
	<HomeHero />
	{@render section("FunktionenHero")}
	<FunktionenHero />
	{@render section("GeraeteHero")}
	<GeraeteHero />
	{@render section("BlogHero")}
	<BlogHero />
	{@render section("GeraeteHeroTicker")}
	<GeraeteHeroTicker />
	{@render section("NumberedSwiper")}
	<div data-testid="numbered-swiper"><NumberedSwiper /></div>
	{@render section("ChartSwiper")}
	<div data-testid="chart-swiper"><ChartSwiper /></div>
	{@render section("FunctionsSwiper")}
	<div data-testid="functions-swiper"><FunctionsSwiper /></div>
	{@render section("FunctionsList")}
	<FunctionsList />
	{@render section("GeraeteangebotSwiper")}
	<div data-testid="geraeteangebot-swiper"><GeraeteangebotSwiper /></div>
	{@render section("InstallFaq")}
	<div data-testid="install-faq"><InstallFaq /></div>
	{@render section("NewsSwiper")}
	<div data-testid="news-swiper"><NewsSwiper /></div>
	{@render section("NewsList")}
	<NewsList />
	{@render section("PersonSwiper")}
	<div data-testid="person-swiper"><PersonSwiper /></div>
	{@render section("ReviewsSwiper")}
	<div data-testid="reviews-swiper"><ReviewsSwiper /></div>
	{@render section("Subscription")}
	<Subscription />
	{@render section("FAQSection")}
	<FAQSection />
	{@render section("Kostenfrei")}
	<Kostenfrei />
	{@render section("MobileDifference")}
	<MobileDifference>
		{#snippet desktopComponent()}<p class="p-5">Desktop variant</p>{/snippet}
		{#snippet mobileComponent()}<p class="p-5">Mobile variant</p>{/snippet}
	</MobileDifference>
	{@render section("CopyLinkButton")}
	<div class="px-5"><CopyLinkButton /></div>
	{@render section("Loading")}
	<div class="h-32"><Loading /></div>
</main>
