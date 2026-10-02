<script lang="ts">
	import HeroTicker from "$lib/components/Basic/Ticker/HeroTicker.svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { counter, google, handyman, star } from "$lib/assets/icons";
	import { ROUTE_BLOG, ROUTE_FRAGEBOGEN } from "$lib/routes";
</script>

<div class="bg-dark_green pt-[1px]">
	<div class="px-4">
		<h1
			class="mt-28 mb-2 text-center text-[65px] leading-[78px] text-white max-large:mt-28 max-medium:mt-28 max-medium:text-5xl max-medium:leading-tight max-small:mt-24 max-small:text-3xl"
		>
			Fernablesung mit Funkgeräten
		</h1>
		<p
			class="mx-auto my-6 max-w-3xl text-center text-2xl leading-[28px] text-white max-medium:text-base max-medium:leading-5 max-medium:text-white/60 max-small:text-sm"
		>
			Effiziente Fernablesung für Warmwasser, Kaltwasser und Heizung – mit
			fortschrittlicher Funktechnologie
		</p>
		<div
			class="mx-auto mb-10 flex w-fit items-center justify-center gap-3 rounded-[40px] border border-white/20 px-4 py-2.5 max-small:mb-6 max-small:gap-2 max-small:px-3 max-small:py-2"
		>
			<span class="flex items-center justify-start gap-2 max-small:gap-1">
				<Image
					width={20}
					height={20}
					sizes="(max-width: 480px) 30px, 20px"
					class="h-auto max-small:w-[20px]"
					src={google}
					alt="google"
				/>
				{#each { length: 5 }, i (i)}
					<Image
						width={16}
						height={16}
						priority
						sizes="16px"
						class="colored-to-white size-4 opacity-80 max-small:size-3"
						src={star}
						alt="rate star"
					/>
				{/each}
			</span>
			<span
				class="text-center text-[15px] leading-[18px] whitespace-nowrap text-white max-small:text-xs"
			>
				4.8 Rating
			</span>
			<span
				class="text-center text-[15px] leading-[18px] whitespace-nowrap text-white/70 max-small:text-xs"
			>
				470 Bewertungen
			</span>
		</div>
		<a
			href={ROUTE_FRAGEBOGEN}
			class="mx-auto mb-4 block w-fit rounded-halfbase bg-green px-10 py-5 text-center text-lg text-dark_text max-medium:w-full max-medium:py-3"
		>
			Jetzt installieren lassen
		</a>
		<a
			href={ROUTE_BLOG}
			class="mx-auto block text-center text-[15px] leading-[18px] text-white"
		>
			Fernablesbare Zähler verpflichtend bis 1. Januar 2027
		</a>
	</div>
	<div
		class="mx-auto mt-[70px] mb-10 grid w-fit grid-cols-4 gap-2 px-[72px] max-medium:flex-col max-medium:justify-end max-medium:px-0 max-medium:pr-0"
	>
		<div
			class="flex items-center justify-center rounded-base bg-card_bg px-9 max-medium:hidden"
		>
			<Image
				width={324}
				height={324}
				priority
				sizes="(max-width: 768px) 0px, 324px"
				src={counter}
				alt="counter"
			/>
		</div>
		<LazyLottie
			animationName="Animation_2"
			id="animation2hero"
			size={{ w: 1456, h: 1082 }}
			wrapperClassName="w-fit col-span-2 max-medium:col-span-4 max-medium:bg-transparent max-medium:ml-auto max-medium:mr-0 bg-card_bg rounded-base max-h-[324px] overflow-hidden"
		/>
		<div
			class="max-h-[324px] w-full overflow-hidden rounded-base max-medium:hidden small:w-full"
		>
			<Image
				width={324}
				height={324}
				priority
				sizes="(max-width: 768px) 0px, 324px"
				class="w-full rounded-base object-contain"
				src={handyman}
				alt="handyman"
			/>
		</div>
	</div>
	<HeroTicker />
</div>
