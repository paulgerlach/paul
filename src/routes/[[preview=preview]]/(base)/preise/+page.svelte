<script lang="ts">
	import FAQSection from "$lib/components/Basic/FAQ/FAQSection.svelte";
	import Image from "$lib/components/Basic/Image/Image.svelte";
	import Kostenfrei from "$lib/components/Basic/Kostenfrei/Kostenfrei.svelte";
	import PriceCards from "$lib/components/Preise/PriceCards.svelte";
	import PriceTable from "$lib/components/Preise/PriceTable.svelte";
	import ChartSwiper from "$lib/components/Swipers/ChartSwiper.svelte";
	import { clock, doc, instruments, vitolos } from "$lib/assets/icons";
	import { ROUTE_FRAGEBOGEN } from "$lib/routes";
</script>

<main id="content">
	<div
		class="mb-[52px] px-5 pt-24 pb-4 max-large:pl-20 max-medium:pt-20 max-medium:pl-10 max-small:mb-8 max-small:pt-32 max-small:pl-5"
	>
		<h1
			class="mb-5 text-center text-[50px] leading-[1] text-dark_text max-megalarge:text-[50px] max-large:text-4xl max-medium:text-2xl max-small:text-[28px]"
		>
			Unser Angebot im Überblick
		</h1>
		<p
			class="mx-auto max-w-3xl text-center text-base text-dark_text max-small:text-sm"
		>
			Profitieren Sie von maßgeschneiderten Preislösungen, die auf Ihre
			Bedürfnisse zugeschnitten sind,. Konzentrieren Sie sich auf das, was
			wirklich zählt.
		</p>
	</div>
	<PriceCards />
	<div
		class="my-16 space-y-[72px] px-20 max-large:px-16 max-medium:my-8 max-medium:space-y-10 max-medium:px-10 max-small:my-8 max-small:px-5"
	>
		<Image
			width={0}
			height={0}
			sizes="100vw"
			class="mx-auto block"
			src={vitolos}
			alt="vitolos"
		/>
		<h5
			class="mx-auto max-w-6xl text-center text-[30px] text-dark_text max-small:text-xl"
		>
			&ldquo;Dank Heidi erfüllen wir alle gesetzlichen Vorgaben zur
			Verbrauchserfassung und sparen gleichzeitig wertvolle Zeit. Die
			automatische Datenerfassung und digitale Abrechnung machen unsere Prozesse
			effizienter und zuverlässiger.&rdquo;
		</h5>
		<p class="text-center text-lg text-dark_text max-small:text-base">
			<b>Fabian Höhne</b> Vitolus
		</p>
	</div>
	<PriceTable />
	<div
		class="my-16 space-y-9 px-20 max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
	>
		<p class="text-center text-xl text-dark_text max-small:text-base">
			Wir haben unseren Kunden bereits über
		</p>
		<p
			class="text-center text-[120px] text-dark_text max-megalarge:text-[100px] max-large:text-[80px] max-medium:text-[60px] max-small:text-[32px]"
		>
			+1.000.000.000 Liter
		</p>
		<p class="text-center text-xl text-dark_text max-small:text-base">
			geholfen zu messen.
		</p>
	</div>
	<ChartSwiper />
	<div
		class="my-16 px-20 max-large:px-16 max-medium:px-10 max-small:my-8 max-small:px-5"
	>
		<div
			class="hero-1 mb-32 grid grid-cols-3 items-start justify-center gap-12 max-large:gap-8 max-medium:mb-12 max-medium:grid-cols-1 large:mb-24"
		>
			<div
				class="space-y-5 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start"
			>
				<span class="circleIcon inline-block">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						class="size-[25px]"
						src={clock}
						alt="clock"
					/>
				</span>
				<p
					class="text-xl font-bold text-dark_text max-medium:text-center max-small:text-lg"
				>
					Zeit- und Kostenersparnis
				</p>
				<p
					class="text-[15px] leading-[18px] text-dark_text max-medium:text-center max-small:text-sm"
				>
					Zeitersparnis durch die Automatisierung verschiedener Prozesse, die
					bei traditionellen Zählern maneull durchgeführt werden müssen.
				</p>
				<!-- svelte-ignore a11y_invalid_attribute (dead link in Next too; no calculator exists yet) -->
				<a
					href="#"
					class="hidden items-center justify-center rounded-halfbase border border-green bg-transparent px-4 py-2 text-sm text-green duration-300 hover:opacity-80 max-medium:flex"
				>
					Kosteneinsparung berechnen
				</a>
			</div>
			<div
				class="space-y-5 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start"
			>
				<span class="circleIcon inline-block">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						class="size-[25px]"
						src={instruments}
						alt="instruments"
					/>
				</span>
				<p
					class="text-xl font-bold text-dark_text max-medium:text-center max-small:text-lg"
				>
					Kostenfreie Installation
				</p>
				<p
					class="text-[15px] leading-[18px] text-dark_text max-medium:text-center max-small:text-sm"
				>
					Profitieren Sie von einer kostenfreien Umrüstung auf unsere
					fortschrittliche Technologie - ohne zusätzliche Kosten.
				</p>
				<a
					href={ROUTE_FRAGEBOGEN}
					class="hidden items-center justify-center rounded-halfbase border border-green bg-green px-4 py-2 text-sm text-white duration-300 hover:opacity-80 max-medium:flex"
				>
					Jetzt installieren lassen
				</a>
			</div>
			<div
				class="space-y-5 max-medium:hidden max-medium:flex-col max-medium:items-center max-medium:justify-start"
			>
				<span class="circleIcon inline-block">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						class="size-[25px]"
						src={doc}
						alt="doc"
					/>
				</span>
				<p
					class="text-xl font-bold text-dark_text max-medium:text-center max-small:text-lg"
				>
					Betriebskosten-abrechnung erstellen
				</p>
				<p
					class="text-[15px] leading-[18px] text-dark_text max-medium:text-center max-small:text-sm"
				>
					Die Daten, die von den drahtlosen Messgeräten erfasst werden, fließen
					automatisch ein und sind für die Zusammenstellung Ihrer
					Nebenkostenabrechnung verfügbar.
				</p>
			</div>
		</div>
	</div>
	<FAQSection />
	<Kostenfrei />
</main>
