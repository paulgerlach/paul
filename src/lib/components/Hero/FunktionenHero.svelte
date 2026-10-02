<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { hero_process_bg, hero_process_small } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";
</script>

<div
	class="grid grid-cols-2 items-center gap-7 bg-[#FAFAF9] pt-8 pr-4 pb-4 pl-[120px] max-large:pl-20 max-medium:grid-cols-1 max-medium:pl-10 max-small:px-5"
>
	<div class="max-medium:text-center">
		<h1
			class="mt-20 mb-2 text-[65px] leading-[78px] text-dark_text max-megalarge:text-[50px] max-megalarge:leading-[1] max-large:mt-20 max-large:text-4xl max-medium:mt-16 max-medium:text-2xl max-medium:leading-tight max-small:mt-24 max-small:mb-5 max-small:text-[28px] max-small:leading-[1.2]"
		>
			Daten mit höchster <br class="max-small:hidden" />
			Effizienz bearbeiten
		</h1>
		<p
			class="text-xl text-dark_text max-small:text-sm max-small:text-dark_text/70"
		>
			Auf gesetzlich vorgeschrieben Zähler umstellen
			<br class="max-medium:hidden" />
			und Verbräuche digital ablesen
		</p>
		<a
			href={ROUTE_FRAGEBOGEN}
			class="my-5 block w-fit rounded-halfbase bg-green px-10 py-5 text-center text-lg text-dark_text max-medium:w-full max-medium:py-3 max-small:mt-10 max-small:text-base"
		>
			Jetzt installieren lassen
		</a>
		<p
			class="text-xl text-dark_text max-small:mb-6 max-small:text-sm max-small:text-dark_text/50"
		>
			Kostenfreie Installation der Funkgeräte
		</p>
	</div>
	<div
		class="grid h-full w-full max-w-[689px] grid-cols-2 gap-5 max-small:grid-cols-1 max-small:gap-3"
	>
		<div class="relative mb-20 max-small:mb-10">
			<Image
				width={334}
				height={445}
				sizes="100vw"
				priority
				src={hero_process_bg}
				alt="hero_process_bg"
			/>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				class="absolute bottom-0 left-1/2 -translate-x-1/2"
				src={hero_process_small}
				alt="hero_process_small"
			/>
		</div>
		<LazyLottie
			id="hero-process-animation"
			animationName="Animation_11"
			wrapperClassName="relative mt-20 max-small:mt-0"
		/>
	</div>
</div>
