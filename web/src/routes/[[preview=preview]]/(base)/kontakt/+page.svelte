<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Kostenfrei from "$lib/components/Basic/Kostenfrei/Kostenfrei.svelte";
	import Subscription from "$lib/components/Basic/Subscription/Subscription.svelte";
	import ContactForm from "$lib/components/Kontakt/ContactForm.svelte";
	import ChartSwiper from "$lib/components/Swipers/ChartSwiper.svelte";
	import ReviewsSwiper from "$lib/components/Swipers/ReviewsSwiper.svelte";
	import {
		fewocare,
		flyla,
		haus_hirst,
		ki_akademie,
		parkdepot,
		sameday,
		star,
		vitolos,
		wemolo,
	} from "$lib/assets/icons";

	const ratings = ["5/5 Google Bewertungen", "4.8 / 5 Trustpilot"];

	// The alt texts don't match the logos; kept as in Next.
	const logos = [
		{ src: fewocare, alt: "accentro", class: "h-10" },
		{ src: sameday, alt: "vonovia", class: "h-10" },
		{ src: flyla, alt: "deutsche_wohnen", class: "h-10" },
		{ src: vitolos, alt: "deutsche_wohnen", class: "h-7" },
		{ src: ki_akademie, alt: "viessmann", class: "h-10" },
		{ src: haus_hirst, alt: "accentro", class: "h-10" },
		{ src: parkdepot, alt: "accentro", class: "col-span-2 h-8" },
		{ src: wemolo, alt: "vonovia", class: "h-8" },
	];
</script>

<main id="content">
	<div class="grid min-h-screen grid-cols-2 max-medium:grid-cols-1">
		<div
			class="flex flex-col items-center justify-center gap-11 bg-green/10 pt-4 pb-28 max-medium:py-16 max-small:gap-6 max-small:px-4 max-small:pt-20 max-small:pb-8"
		>
			<p
				class="text-center text-[35px] text-dark_text max-medium:text-2xl max-small:text-xl"
			>
				+1.000 Kunden vertrauen uns
			</p>
			<div
				class="flex w-full items-center justify-around max-small:flex-col max-small:gap-6"
			>
				{#each ratings as rating (rating)}
					<div class="space-y-7">
						<div class="flex items-center justify-center gap-1">
							{#each { length: 5 }, i (i)}
								<Image
									width={0}
									height={0}
									sizes="100vw"
									class="golden-star"
									src={star}
									alt="star"
								/>
							{/each}
						</div>
						<p class="text-lg text-dark_text max-small:text-base">{rating}</p>
					</div>
				{/each}
			</div>
			<div
				class="grid max-w-md grid-cols-3 items-center gap-9 max-medium:grid-cols-2"
			>
				{#each logos as logo, i (i)}
					<Image
						width={0}
						height={0}
						sizes="100vw"
						class={["mx-auto opacity-20", logo.class]}
						src={logo.src}
						alt={logo.alt}
					/>
				{/each}
			</div>
		</div>
		<ContactForm />
	</div>
	<Kostenfrei />
	<ChartSwiper />
	<ReviewsSwiper />
	<Subscription />
</main>
