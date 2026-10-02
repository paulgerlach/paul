<script lang="ts">
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import LazyLottie from "$lib/components/Lottie/LazyLottie.svelte";
	import { list2, right_arrow } from "$lib/assets/icons";
	import { ROUTE_FUNKTIONEN } from "$lib/routes";
	import type { Snippet } from "svelte";

	const lottieWrapper =
		"relative max-w-[537px] w-full overflow-hidden max-large:w-full max-large:object-fill";

	const steps: { title: string; text: string; media: Snippet }[] = [
		{
			title: "1 Bedarfsanalyse",
			text: "Teilen Sie uns mit, welche Funkzähler Sie benötigen –den Rest übernehmen wir. In Zusammenarbeit mit erfahrenen Meisterbetrieben sorgen wir für eine passgenaue Umsetzung, die Ihren Anforderungen entspricht. Effizient, zuverlässig, unkompliziert.",
			media: analysisMedia,
		},
		{
			title: "2 Installation der Funktechnologie",
			text: "Unsere Experten rüsten Ihre Zähler für Warmwasser, Kaltwasser und Heizung mit modernster Funktechnologie aus –komplett kostenfrei. Genießen Sie den Komfort der automatisierten Fernablesung und verabschieden Sie sich von Vor-Ort-Terminen.",
			media: installationMedia,
		},
		{
			title: "3 Intelligente Verbrauchsanalyse",
			text: "Behalten Sie Ihre Verbrauchsdaten jederzeit im Blick. Unsere individuell anpassbaren Dashboards erfassen alle Werte in Echtzeit und ermöglichen präzise Betriebskostenabrechnungen mit nur wenigen Klicks.",
			media: dashboardMedia,
		},
	];
</script>

{#snippet analysisMedia()}
	<div class="max-large:items-center max-large:justify-center large:flex">
		<LazyLottie
			animationName="Animation_1"
			id="animation1"
			wrapperClassName={lottieWrapper}
		/>
	</div>
{/snippet}

{#snippet installationMedia()}
	<div
		class="relative w-full max-w-[537px] overflow-hidden max-large:w-full max-large:object-fill"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="w-full max-w-[537px]"
			src={list2}
			alt="list image"
		/>
	</div>
{/snippet}

{#snippet dashboardMedia()}
	<div class="max-large:items-center max-large:justify-center large:flex">
		<LazyLottie
			animationName="Animation_2"
			id="animation2"
			wrapperClassName={lottieWrapper}
		/>
	</div>
{/snippet}

<div class="px-[72px] max-large:px-6">
	<h2
		class="section-title relative mt-48 mb-5 text-center text-[50px] leading-[60px] text-dark_text max-large:mt-16 max-medium:text-4xl max-medium:leading-tight max-small:text-3xl"
	>
		So funktioniert die Installation
	</h2>
	<p
		class="mx-auto mb-32 max-w-4xl text-center text-base leading-[19.2px] text-dark_text max-medium:mb-24 max-small:text-sm"
	>
		Die innovativen Geräte von Heidi machen manuelles Ablesen überflüssig –Warm-
		und Kaltwasserzähler werden automatisch erfasst, ganz ohne Vor-Ort-Termine.
		Die Verbrauchsdaten werden digital übertragen und direkt in Ihre
		Betriebskostenabrechnung integriert.
	</p>
	<div>
		{#each steps as step (step.title)}
			<div
				class="flex items-stretch justify-center gap-16 border-b border-dark_green/10 py-16 max-large:flex-col max-large:gap-4 max-large:border-transparent max-medium:py-8"
			>
				<div class="flex max-w-lg flex-col items-start justify-between">
					<h3
						class="numberedTitle text-[40px] leading-[48px] text-dark_text max-large:relative max-medium:mb-9 max-medium:text-2xl max-medium:leading-7 max-small:text-xl"
					>
						{step.title}
					</h3>
					<div>
						<p
							class="mt-auto mb-0 text-[25px] leading-[30px] text-dark_text max-small:text-base"
						>
							{step.text}
						</p>
						<a
							class="group mt-10 flex items-center justify-start gap-2 text-base leading-[19.2px] text-link"
							href={ROUTE_FUNKTIONEN}
						>
							Erfahren Sie mehr
							<Image
								width={0}
								height={0}
								sizes="100vw"
								class="arrowLink duration-300 group-hover:translate-x-1.5 group-hover:-rotate-90"
								src={right_arrow}
								alt="chevron"
							/>
						</a>
					</div>
				</div>
				{@render step.media()}
			</div>
		{/each}
	</div>
</div>
