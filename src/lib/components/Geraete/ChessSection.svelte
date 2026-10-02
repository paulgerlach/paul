<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { box_brands, daten, payment, right_arrow } from "$lib/assets/icons";
	import { ROUTE_DATENSCHUTZHINWEISE, ROUTE_FRAGEBOGEN } from "$lib/routes";
</script>

{#snippet arrow()}
	<Image
		width={0}
		height={0}
		sizes="100vw"
		class="colored-to-blue -rotate-90 transition group-hover:translate-x-1"
		src={right_arrow}
		alt="right_arrow"
	/>
{/snippet}

<div
	class="pr-[60px] pl-[100px] max-large:px-16 max-medium:px-10 max-small:px-5"
>
	<div
		class="flex items-center justify-between gap-8 border-t border-dark_green/10 py-16 max-large:flex-col max-medium:py-8"
	>
		<div class="max-w-xl space-y-6">
			<h4
				class="text-[45px] leading-[54px] text-dark_text max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px]"
			>
				Verbrauchsdaten in Echtzeit ablesen
			</h4>
			<p>
				Behalten Sie den Überblick über Ihren Warm- und Kaltwasserverbrauch
				–jederzeit und bequem von überall aus.
			</p>
			<a
				class="group flex cursor-pointer items-center justify-start gap-1.5 text-link"
				href={ROUTE_DATENSCHUTZHINWEISE}
			>
				Mehr erfahren
				{@render arrow()}
			</a>
		</div>
		<Image width={0} height={0} sizes="100vw" src={daten} alt="daten" />
	</div>
	<div
		class="flex items-center justify-between gap-8 border-t border-dark_green/10 py-16 max-large:flex-col max-medium:py-8"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="relative z-10 w-full max-w-[655px]"
			src={payment}
			alt="payment"
		/>
		<div class="max-w-xl space-y-6">
			<h4
				class="text-[45px] leading-[54px] text-dark_text max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px]"
			>
				Zeit- und Geldersparnis
			</h4>
			<p>
				Mit digitalen Funkzählern von Heidi entfällt das manuelle Ablesen sowie
				die Terminabstimmung mit Mietern.
			</p>
			<a
				class="group flex cursor-pointer items-center justify-start gap-1.5 text-link"
				href={ROUTE_FRAGEBOGEN}
			>
				Kostenrechener
				{@render arrow()}
			</a>
		</div>
	</div>
	<div
		class="flex items-center justify-between gap-8 border-t border-dark_green/10 py-16 max-large:flex-col max-medium:py-8"
	>
		<div class="max-w-xl space-y-6">
			<h4
				class="text-[45px] leading-[54px] text-dark_text max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px]"
			>
				Kostenfreie Installation
			</h4>
			<p>
				Wir übernehmen die vollständige Installation der Geräte direkt vor Ort,
				schnell und ohne zusätzliche Kosten für Sie.
			</p>
			<a
				class="flex w-fit cursor-pointer items-center justify-center rounded-xl bg-[#6083CC] px-[104px] py-5 text-center text-lg text-white transition hover:opacity-80 max-small:w-full max-small:px-0 max-small:py-4 max-small:text-base"
				href={ROUTE_FRAGEBOGEN}
			>
				Anfrage stellen
			</a>
		</div>
		<LazyLottie
			wrapperClassName="relative"
			id="installation"
			animationName="Animation_1"
		/>
	</div>
	<div
		class="flex items-center justify-between gap-8 border-t border-dark_green/10 py-16 max-large:flex-col max-medium:py-8"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			src={box_brands}
			alt="box_brands"
		/>
		<div class="max-w-xl space-y-6">
			<h4
				class="text-[45px] leading-[54px] text-dark_text max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px]"
			>
				Das Vertrauen von Branchenexperten
			</h4>
			<p>
				Etablierte Branchengrößen vertrauen den Systemen von Heidi und setzten
				damit auf Innovation des 21. Jahrhunderts
			</p>
			<a
				class="group flex cursor-pointer items-center justify-start gap-1.5 text-[#6083CC]"
				href={ROUTE_DATENSCHUTZHINWEISE}
			>
				Mehr erfahren
				{@render arrow()}
			</a>
		</div>
	</div>
</div>
