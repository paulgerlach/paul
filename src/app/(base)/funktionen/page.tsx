import FAQSection from "@/components/Basic/FAQ/FAQSection";
import Kostenfrei from "@/components/Basic/Kostenfrei/Kostenfrei";
import GeraeteHeroTicker from "@/components/Basic/Ticker/GeraeteHeroTicker";
import AnimationsSection from "@/components/Funktionen/AnimationsSection";
import FunktionenGrid from "@/components/Funktionen/Grid";
import FunktionenHero from "@/components/Hero/FunktionenHero";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import ChartSwiper from "@/components/Swipers/ChartSwiper";
import InstallFaq from "@/components/Swipers/InstallFaq";
import ReviewsSwiper from "@/components/Swipers/ReviewsSwiper";
import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import {
	checkmark_shield,
	chess_shield,
	eu_elipse,
	lock,
	vitolos,
} from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function FunktionenPage() {
	return (
		<main id="content">
			<FunktionenHero />
			<GeraeteHeroTicker />
			<FunktionenGrid />
			<div className="px-[100px] max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
				<div className="flex items-center justify-center gap-24 max-large:gap-16 max-medium:gap-10 max-small:gap-5 max-large:grid max-large:grid-cols-2 max-medium:grid-cols-1">
					<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							src={chess_shield}
							alt="chess_shield"
						/>
						<div>
							<p className="text-dark_text text-[15px] max-small:text-xs">Gesetzeskonform</p>
							<p className="text-dark_text/50 text-[15px] max-small:text-xs">§ 229 Artikel 3</p>
						</div>
					</div>
					<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							src={checkmark_shield}
							alt="checkmark_shield"
						/>
						<div>
							<p className="text-dark_text text-[15px] max-small:text-xs">Datenschutzkonform</p>
							<p className="text-dark_text/50 text-[15px] max-small:text-xs">Nach DSGVO</p>
						</div>
					</div>
					<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							src={lock}
							alt="lock"
						/>
						<div>
							<p className="text-dark_text text-[15px] max-small:text-xs">SSL Verschlüsselung</p>
							<p className="text-dark_text/50 text-[15px] max-small:text-xs">
								Zertifiziert und Sicher
							</p>
						</div>
					</div>
					<div className="flex items-center justify-start max-medium:justify-center gap-5 max-small:justify-start">
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							src={eu_elipse}
							alt="eu_elipse"
						/>
						<div>
							<p className="text-dark_text text-[15px] max-small:text-xs">Server in Europa</p>
							<p className="text-dark_text/50 text-[15px] max-small:text-xs">EU Datenschutz</p>
						</div>
					</div>
				</div>
			</div>
			<AnimationsSection />
			<div className="px-20 space-y-12 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
			<h5 className="max-w-2xl mx-auto text-center text-dark_text text-[30px] max-small:text-xl">
				&bdquo;Dank Heidi erfüllen wir alle gesetzlichen Vorgaben zur
				Verbrauchserfassung und sparen gleichzeitig wertvolle Zeit. Die
				automatische Datenerfassung und digitale Abrechnung machen unsere
				Prozesse effizienter und zuverlässiger.&ldquo;
			</h5>
				<p className="text-center text-lg max-small:text-base text-dark_text">
					<b>Fabian Höhne</b>, Vitolus
				</p>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={vitolos}
					alt="vitolos"
				/>
			</div>

			<div className="px-20 space-y-2.5 max-large:px-16 max-medium:px-10 max-small:px-5 my-16 max-small:my-8">
				<h5 className="max-w-3xl mx-auto text-center text-dark_text text-[50px] leading-[60px] max-medium:text-2xl max-small:text-xl max-medium:leading-7">
					Alle Verbräuche einer Wohnung als Übersicht
				</h5>
				<p className="text-center mx-auto max-w-xl text-lg max-small:text-sm text-dark_text">
					Etablierte Branchengrößen vertrauen den Systemen von Heidi und setzten
					damit auf Innovation des 21. Jahrhunderts
				</p>
				<Link
					className="flex items-center justify-center w-fit !mb-12 mx-auto px-10 max-small:px-8 py-5 max-small:py-3 duration-300 hover:opacity-80 rounded-halfbase bg-green text-dark_text text-lg max-small:text-base"
					href={ROUTE_FRAGEBOGEN}
				>
					Zugang sichern
				</Link>
				<LazyLottie
					animationName="Animation_10"
					id="score_chart_main"
					wrapperClassName="relative mx-auto max-w-3xl w-fit"
				/>
			</div>
			<ChartSwiper />
			<InstallFaq />
			<ReviewsSwiper />
			<FAQSection />
			<Kostenfrei />
		</main>
	);
}
