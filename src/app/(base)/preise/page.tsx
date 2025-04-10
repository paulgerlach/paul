import FAQSection from "@/components/Basic/FAQ/FAQSection";
import Kostenfrei from "@/components/Basic/Kostenfrei/Kostenfrei";
import PriceCards from "@/components/Preise/PriceCards";
import PriceTable from "@/components/Preise/PriceTable";
import ChartSwiper from "@/components/Swipers/ChartSwiper";
import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import { clock, doc, instruments, vitolos } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function PreisePage() {
	return (
		<main id="content">
			<div className="pt-24 max-large:pl-20 max-medium:pl-10 max-small:pl-5 mb-[52px] pb-4 px-5">
				<h1 className="text-[50px] max-megalarge:text-[50px] text-center leading-[1] max-large:text-4xl mb-5 max-medium:text-2xl text-dark_text">
					Unser Angebot im Überblick
				</h1>
				<p className="text-dark_text max-w-3xl mx-auto text-center text-base">
					Profitieren Sie von maßgeschneiderten Preislösungen, die auf Ihre
					Bedürfnisse zugeschnitten sind,. Konzentrieren Sie sich auf das, was
					wirklich zählt.
				</p>
			</div>
			<PriceCards />
			<div className="px-20 space-y-[72px] max-medium:my-8 max-medium:space-y-10 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={vitolos}
					alt="vitolos"
				/>
				<h5 className="max-w-6xl mx-auto text-center text-dark_text text-[30px]">
					“Dank Heidi erfüllen wir alle gesetzlichen Vorgaben zur
					Verbrauchserfassung und sparen gleichzeitig wertvolle Zeit. Die
					automatische Datenerfassung und digitale Abrechnung machen unsere
					Prozesse effizienter und zuverlässiger.”
				</h5>
				<p className="text-center text-lg text-dark_text">
					<b>Fabian Höhne</b> Vitolus
				</p>
			</div>
			<PriceTable />
			<div className="px-20 space-y-9 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
				<p className="text-dark_text text-center text-xl">
					Wir haben unseren Kunden bereits über
				</p>
				<p className="text-dark_text text-center text-[120px] max-megalarge:text-[100px] max-large:text-[80px] max-medium:text-[60px] max-small:text-[40px]">
					+1.000.000.000 Liter
				</p>
				<p className="text-dark_text text-center text-xl">
					geholfen zu messen.
				</p>
			</div>
			<ChartSwiper />
			<div className="px-20 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
				<div className="grid mb-32 large:mb-24 max-medium:mb-12 hero-1 grid-cols-3 gap-12 max-large:gap-8 items-start max-medium:grid-cols-1 justify-center">
					<div className="space-y-7 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
						<span className="circleIcon">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								className="size-[25px]"
								src={clock}
								alt="clock"
							/>
						</span>
						<p className="text-xl text-dark_text font-bold max-medium:text-center">
							Zeit- und Kostenersparnis
						</p>
						<p className="text-[15px] leading-[18px] text-dark_text max-medium:text-center">
							Zeitersparnis durch die Automatisierung verschiedener Prozesse,
							die bei traditionellen Zählern maneull durchgeführt werden müssen.
						</p>
						<Link
							href="#"
							className="border hidden max-medium:flex border-green bg-transparent py-2 px-4 items-center justify-center text-sm text-green rounded-halfbase duration-300 hover:opacity-80"
						>
							Kosteneinsparung berechnen
						</Link>
					</div>
					<div className="space-y-7 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
						<span className="circleIcon">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								className="size-[25px]"
								src={instruments}
								alt="instruments"
							/>
						</span>
						<p className="text-xl text-dark_text font-bold max-medium:text-center">
							Kostenfreie Installation
						</p>
						<p className="text-[15px] leading-[18px] text-dark_text max-medium:text-center">
							Profitieren Sie von einer kostenfreien Umrüstung auf unsere
							fortschrittliche Technologie - ohne zusätzliche Kosten.
						</p>
						<Link
							href={ROUTE_FRAGEBOGEN}
							className="border hidden max-medium:flex border-green bg-green py-2 px-4 items-center justify-center text-sm text-white rounded-halfbase duration-300 hover:opacity-80"
						>
							Jetzt installieren lassen
						</Link>
					</div>
					<div className="space-y-7 max-medium:hidden max-medium:flex-col max-medium:items-center max-medium:justify-start">
						<span className="circleIcon">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								className="size-[25px]"
								src={doc}
								alt="doc"
							/>
						</span>
						<p className="text-xl text-dark_text font-bold max-medium:text-center">
							Betriebskosten-abrechnung erstellen
						</p>
						<p className="text-[15px] leading-[18px] text-dark_text max-medium:text-center">
							Die Daten, die von den drahtlosen Messgeräten erfasst werden,
							fließen automatisch ein und sind für die Zusammenstellung Ihrer
							Nebenkostenabrechnung verfügbar.
						</p>
					</div>
				</div>
			</div>
			<FAQSection />
			<Kostenfrei />
		</main>
	);
}
