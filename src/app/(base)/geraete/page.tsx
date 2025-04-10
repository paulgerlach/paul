import FAQSection from "@/components/Basic/FAQ/FAQSection";
import Subscription from "@/components/Basic/Subscription/Subscription";
import GeraeteHeroTicker from "@/components/Basic/Ticker/GeraeteHeroTicker";
import ChessSection from "@/components/Geraete/ChessSection";
import Eigenschaften from "@/components/Geraete/Eigenschaften";
import GeraeteHero from "@/components/Hero/GeraeteHero";
import GeräteangebotSwiper from "@/components/Swipers/GeräteangebotSwiper";
import InstallFaq from "@/components/Swipers/InstallFaq";
import NumberedSwiper from "@/components/Swipers/NumberedSwiper";
import ReviewsSwiper from "@/components/Swipers/ReviewsSwiper";
import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import { checkmark_icon, paket_im } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function GeraetePage() {
	return (
		<main id="content">
			<GeraeteHero />
			<GeraeteHeroTicker />
			<NumberedSwiper />
			<Eigenschaften />
			<ChessSection />
			<div className="pl-[100px] max-large:px-16 max-medium:px-10 max-small:px-5 py-16 pr-[60px]">
				<div className="bg-[#EFEDEC] rounded-base grid grid-cols-2 gap-20 max-large:grid-cols-1 max-large:p-16 max-medium:p-10 max-small:p-5 px-[72px] pt-[92px] pb-[57px]">
					<Image
						width={0}
						height={0}
						sizes="100vw"
						loading="lazy"
						src={paket_im}
						alt="paket"
					/>
					<div className="space-y-6">
						<h4 className="text-[45px] leading-[54px] max-medium:text-2xl text-dark_text">
							Alles in einem Paket
						</h4>
						<p>Wir übernehmen die Installation für Sie</p>
						<ul className="space-y-4">
							<li className="flex items-center justify-start gap-5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									src={checkmark_icon}
									alt="checkmark"
								/>
								Heizungszähler-Funkgerät
							</li>
							<li className="flex items-center justify-start gap-5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									src={checkmark_icon}
									alt="checkmark"
								/>
								Kaltwasserzähler-Funkgerät
							</li>
							<li className="flex items-center justify-start gap-5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									src={checkmark_icon}
									alt="checkmark"
								/>
								Warmwasserzähler -Funkgerät
							</li>
							<li className="flex items-center justify-start gap-5">
								<Image
									width={0}
									height={0}
									sizes="100vw"
									loading="lazy"
									src={checkmark_icon}
									alt="checkmark"
								/>
								Funk-Rauchmelder
							</li>
						</ul>
						<Link
							className="flex items-center justify-center transition hover:opacity-80 text-white text-center text-lg cursor-pointer py-5 px-[104px] max-medium:w-full max-medium:text-center max-medium:px-0 w-fit rounded-halfbase bg-green"
							href={ROUTE_FRAGEBOGEN}
						>
							Jetzt installieren lassen
						</Link>
					</div>
				</div>
			</div>
			<InstallFaq />
			<ReviewsSwiper />
			<FAQSection />
			<GeräteangebotSwiper />
			<Subscription />
		</main>
	);
}
