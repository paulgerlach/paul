import { ROUTE_DATENSCHUTZHINWEISE, ROUTE_FRAGEBOGEN } from "@/routes/routes";
import Link from "next/link";
import { LazyLottie } from "../Lottie/LazyLottie";
import animation1 from "@/animations/Animation_1.json";
import Image from "next/image";
import { box_brands, daten, payment, right_arrow } from "@/static/icons";

export default function ChessSection() {
	return (
		<div className="pl-[100px] max-large:px-16 max-medium:px-10 max-small:px-5 pr-[60px]">
			<div className="flex justify-between py-16 max-medium:py-8 border-t border-dark_green/10 items-center max-large:flex-col gap-8">
				<div className="max-w-xl space-y-6">
					<h4 className="text-[45px] leading-[54px] max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px] text-dark_text">
						Verbrauchsdaten in Echtzeit ablesen
					</h4>
					<p>
						Behalten Sie den Überblick über Ihren Warm- und Kaltwasserverbrauch
						–jederzeit und bequem von überall aus.
					</p>
					<Link
						className="group flex text-link items-center justify-start gap-1.5 cursor-pointer"
						href={ROUTE_DATENSCHUTZHINWEISE}
					>
						Mehr erfahren
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							className="group-hover:translate-x-1 transition colored-to-blue -rotate-90"
							src={right_arrow}
							alt="right_arrow"
						/>
					</Link>
				</div>
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					src={daten}
					alt="daten"
				/>
			</div>
			<div className="flex justify-between py-16 max-medium:py-8 border-t border-dark_green/10 items-center max-large:flex-col gap-8">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="relative z-10 max-w-[655px] w-full"
					src={payment}
					alt="payment"
				/>
				<div className="max-w-xl space-y-6">
					<h4 className="text-[45px] leading-[54px] max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px] text-dark_text">
						Zeit- und Geldersparnis
					</h4>
					<p>
						Mit digitalen Funkzählern von Heidi entfällt das manuelle Ablesen
						sowie die Terminabstimmung mit Mietern.
					</p>
					<Link
						className="group flex text-link items-center justify-start gap-1.5 cursor-pointer"
						href={ROUTE_FRAGEBOGEN}
					>
						Kostenrechener
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							className="group-hover:translate-x-1 transition colored-to-blue -rotate-90"
							src={right_arrow}
							alt="right_arrow"
						/>
					</Link>
				</div>
			</div>
			<div className="flex justify-between py-16 max-medium:py-8 border-t border-dark_green/10 items-center max-large:flex-col gap-8">
				<div className="max-w-xl space-y-6">
					<h4 className="text-[45px] leading-[54px] max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px] text-dark_text">
						Kostenfreie Installation
					</h4>
					<p>
						Wir übernehmen die vollständige Installation der Geräte direkt vor
						Ort, schnell und ohne zusätzliche Kosten für Sie.
					</p>
					<Link
						className="flex items-center justify-center transition hover:opacity-80 text-white text-center text-lg max-small:text-base cursor-pointer py-5 max-small:py-4 px-[104px] max-small:px-0 w-fit max-small:w-full rounded-xl bg-[#6083CC]"
						href={ROUTE_FRAGEBOGEN}
					>
						Anfrage stellen
					</Link>
				</div>
				<LazyLottie
					wrapperClassName="relative"
					id="installation"
					animationData={animation1}
				/>
			</div>
			<div className="flex justify-between py-16 max-medium:py-8 border-t border-dark_green/10 items-center max-large:flex-col gap-8">
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					src={box_brands}
					alt="box_brands"
				/>
				<div className="max-w-xl space-y-6">
					<h4 className="text-[45px] leading-[54px] max-medium:text-2xl max-small:text-[30px] max-small:leading-[36px] text-dark_text">
						Das Vertrauen von Branchenexperten
					</h4>
					<p>
						Etablierte Branchengrößen vertrauen den Systemen von Heidi und
						setzten damit auf Innovation des 21. Jahrhunderts
					</p>
					<Link
						className="group flex text-[#6083CC] items-center justify-start gap-1.5 cursor-pointer"
						href={ROUTE_DATENSCHUTZHINWEISE}
					>
						Mehr erfahren
						<Image
							width={0}
							height={0}
							sizes="100vw"
							loading="lazy"
							className="group-hover:translate-x-1 transition colored-to-blue -rotate-90"
							src={right_arrow}
							alt="right_arrow"
						/>
					</Link>
				</div>
			</div>
		</div>
	);
}
