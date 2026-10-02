<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { hero_counter, hero_small_counter } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";
</script>

<div
	class="flex items-center justify-center gap-32 bg-[#FAFAF9] pt-24 pr-4 pb-4 pl-[120px] max-large:pl-20 max-medium:flex-col max-medium:pt-20 max-medium:pl-10 max-small:px-5 max-small:pt-32"
>
	<div class="max-medium:text-center">
		<h1
			class="mb-2 text-[65px] leading-[78px] text-dark_text max-medium:text-3xl max-medium:leading-tight max-small:mb-5 max-small:text-[28px] max-small:leading-[1.2]"
		>
			Jetzt auf Funkgeräte <br class="max-small:hidden" />
			umstellen
		</h1>
		<p
			class="text-[15px] text-dark_text max-small:px-2 max-small:text-sm max-small:text-dark_text/70"
		>
			Wechseln Sie auf gesetzlich vorgeschriebene Funkzähler <br
				class="max-medium:hidden"
			/>
			und erfassen Sie Verbrauchsdaten digital
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
	<div class="grid max-w-[686px] grid-cols-2 gap-5 max-medium:hidden">
		<Image
			width={686}
			height={386}
			sizes="100vw"
			priority
			class="col-span-2 aspect-video h-full rounded-base object-cover"
			src={hero_counter}
			alt="hero counter image"
		/>
		<div
			class="flex h-full items-center justify-center rounded-base bg-[#E0DEDB]"
		>
			<Image
				width={0}
				height={0}
				sizes="100vw"
				src={hero_small_counter}
				alt="hero counter image"
			/>
		</div>
		<LazyLottie
			id="hero-pointer"
			wrapperClassName="relative"
			animationName="Animation_1"
		/>
	</div>
</div>
