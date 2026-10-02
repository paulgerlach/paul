<script lang="ts">
	import type { Snippet } from "svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import type { ImageAsset } from "$lib/components/Basic/Image/types";
	import { clock, doc, instruments, weight } from "$lib/assets/icons";
	import { ROUTE_DATENSCHUTZHINWEISE, ROUTE_FRAGEBOGEN } from "$lib/routes";

	type Benefit = {
		icon: ImageAsset;
		alt: string;
		title: string;
		text: string;
		cta: Snippet;
		class?: string;
	};

	const benefits: Benefit[] = [
		{
			icon: weight,
			alt: "weight",
			title: "EU-Vorschriften einhalten",
			text: "Mit unseren fernablesbaren Zählern erfüllen Sie alle gesetzlichen Vorgaben und profitieren gleichzeitig von höherer Effizienz und Transparenz. Modernste Energiemanagement- Technologie sorgt für eine zukunftssichere Lösung.",
			cta: moreLink,
		},
		{
			icon: clock,
			alt: "clock",
			title: "Zeit- und Kostenersparnis",
			text: "Reduzieren Sie manuelle Aufwände und sparen Sie wertvolle Zeit. Unsere automatisierten Prozesse übernehmen die Verbrauchserfassung effizient und zuverlässig.",
			cta: savingsLink,
		},
		{
			icon: instruments,
			alt: "instruments",
			title: "Kostenfreie Installation",
			text: "Steigen Sie ohne Mehrkosten auf unsere innovative Technologie um. Die Umrüstung erfolgt für Sie völlig kostenlos und ohne Aufwand.",
			cta: installLink,
		},
		{
			icon: doc,
			alt: "doc",
			title: "Heizkostenabrechnung erstellen",
			text: "Unsere drahtlosen Messgeräte erfassen alle Verbrauchsdaten automatisch und bereiten sie für eine präzise und effiziente Nebenkostenabrechnung auf.",
			cta: moreLink,
			class: "max-small:hidden",
		},
	];
</script>

{#snippet moreLink()}
	<a
		href={ROUTE_DATENSCHUTZHINWEISE}
		class="hidden text-sm leading-4 text-link underline max-medium:block"
	>
		mehr erfahren
	</a>
{/snippet}

{#snippet savingsLink()}
	<!-- svelte-ignore a11y_invalid_attribute (dead link in Next too; no calculator exists yet) -->
	<a
		href="#"
		class="hidden items-center justify-center rounded-halfbase border border-green bg-transparent px-4 py-2 text-sm text-green duration-300 hover:opacity-80 max-medium:flex"
	>
		Kosteneinsparung berechnen
	</a>
{/snippet}

{#snippet installLink()}
	<a
		href={ROUTE_FRAGEBOGEN}
		class="hidden items-center justify-center rounded-halfbase border border-green bg-green px-4 py-2 text-sm text-white duration-300 hover:opacity-80 max-medium:flex"
	>
		Jetzt installieren lassen
	</a>
{/snippet}

<div
	class="hero mt-28 px-[140px] max-megalarge:px-16 max-large:px-6 max-medium:px-5 max-small:mt-6"
>
	<h2
		class="section-title hero-title relative mb-10 hidden text-center text-[50px] leading-[60px] text-dark_text max-large:block max-medium:text-4xl max-medium:leading-tight max-small:mb-12 max-small:text-3xl"
	>
		Jetzt Vorteile sichern
	</h2>
	<div
		class="hero-1 mb-32 grid grid-cols-4 items-stretch justify-center gap-20 max-large:gap-8 max-medium:grid-cols-2 max-medium:gap-16 max-small:grid-cols-1 max-small:gap-14"
	>
		{#each benefits as item (item.alt)}
			<div
				class={[
					"space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start",
					item.class,
				]}
			>
				<span
					class="circleIcon inline-block shrink-0 max-small:!h-9 max-small:!w-9"
				>
					<Image
						width={25}
						height={25}
						priority
						sizes="25px"
						class="size-[25px] max-small:size-[18px]"
						src={item.icon}
						alt={item.alt}
					/>
				</span>
				<p
					class="text-xl font-bold text-dark_text max-medium:text-center max-small:text-lg"
				>
					{item.title}
				</p>
				<p
					class="text-[15px] leading-[18px] text-dark_text max-medium:text-center max-small:text-sm"
				>
					{item.text}
				</p>
				{@render item.cta()}
			</div>
		{/each}
	</div>
</div>
