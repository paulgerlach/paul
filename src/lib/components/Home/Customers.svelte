<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import {
		berlin_bear_green,
		dumax_green,
		harte_green,
		hsp_green,
		neckar_green,
		niesen_green,
		progera_green,
		raum_green,
		schleicher_green,
		vitec_green,
		wagner_green,
		werne_green,
	} from "$lib/assets/icons";

	// prettier-ignore
	const logos = [
		{ src: berlin_bear_green, alt: "berlinBear", width: 120, class: "w-[120px] max-small:w-[85px]" },
		{ src: dumax_green, alt: "dumax", width: 130, class: "w-[130px] max-small:w-[90px]" },
		{ src: harte_green, alt: "harte", width: 130, class: "w-[130px] max-small:w-[90px]" },
		{ src: hsp_green, alt: "hsp", width: 120, class: "w-[120px] max-small:w-[85px]" },
		{ src: raum_green, alt: "raum", width: 125, class: "w-[125px] max-small:w-[88px]" },
		{ src: schleicher_green, alt: "schleicher_green", width: 135, class: "w-[135px] max-small:w-[95px]" },
		{ src: vitec_green, alt: "vitec", width: 100, class: "w-[100px] max-small:w-[70px]" },
		{ src: wagner_green, alt: "wagner", width: 125, class: "w-[125px] max-small:w-[88px]" },
		{ src: werne_green, alt: "werne_green", width: 130, class: "w-[130px] max-small:w-[90px]" },
		{ src: neckar_green, alt: "neckar_green", width: 125, class: "w-[125px] max-small:w-[88px]" },
		{ src: niesen_green, alt: "niesen_green", width: 120, class: "w-[120px] max-small:w-[85px]" },
		{ src: progera_green, alt: "progera_green", width: 130, class: "w-[130px] max-small:w-[90px]" },
	];
</script>

<div
	class="hero-3 px-[140px] max-megalarge:px-16 max-large:px-6 max-medium:px-5 max-small:px-6"
>
	<div
		class="flex gap-8 max-medium:flex-col max-medium:items-center max-medium:gap-6"
	>
		<p
			id="kunden"
			class="scroll-mt-[85px] text-lg font-bold whitespace-nowrap text-dark_text max-medium:text-center max-medium:whitespace-normal max-small:mb-4 max-small:text-xl"
		>
			Die Wahl führender Innovatoren und Branchenführer
		</p>
		<!-- Desktop: 4 columns, evenly spaced. Mobile: 2 columns with space between -->
		<div
			class="grid flex-1 grid-cols-4 items-center justify-items-center gap-x-12 gap-y-8 max-medium:grid-cols-3 max-small:grid-cols-2 max-small:gap-x-10 max-small:gap-y-6"
		>
			{#each logos as logo (logo.alt)}
				<Image
					width={logo.width}
					height={45}
					sizes="100vw"
					class={["h-[45px] object-contain max-small:h-[32px]", logo.class]}
					src={logo.src}
					alt={logo.alt}
				/>
			{/each}
		</div>
	</div>
</div>
