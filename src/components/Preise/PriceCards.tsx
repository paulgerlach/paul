import { ROUTE_FRAGEBOGEN, ROUTE_KONTAKT } from "@/routes/routes";
import { checkmark_bold } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function PriceCards() {
	return (
		<div className="px-8 max-medium:px-5">
			<div className="grid grid-cols-3 gap-5 max-medium:grid-cols-1">
				<div className="relative border-dark_green/20 border rounded-base px-7 py-12">
					<span className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-9 rounded-[20px] bg-green">
						Einstiegspreis
					</span>
					<p className="text-[25px] text-dark_text mb-2 text-center">Heidi</p>
					<p className="text-center text-[15px] mb-7 text-dark_text/20">
						ab <span className="text-dark_text text-[40px]">€200</span> pro Jahr
					</p>
					<p className="max-w-xs mx-auto text-center text-dark_text text-[15px] mb-9">
						Geeignet für Hausverwaltungen, deren Anforderung geringe Komplexität und minimale Verwaltungsarbeit sind.
					</p>
					<Link
						href={ROUTE_KONTAKT}
						className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
					>
						Beraten lassen
					</Link>
					<Link
						href={ROUTE_FRAGEBOGEN}
						className="text-white bg-dark_green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
					>
						Jetzt starten
					</Link>
					<p className="pt-6 border-t border-dark_green/20 font-bold text-lg text-dark_text mb-4">
						Heidi features:
					</p>
					<ul className="space-y-4">
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Rechtssichere Heizkostenabrechnung
						</li>
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Kostenfreie Installation
						</li>
					</ul>
				</div>
				<div className="relative border-dark_green/20 border rounded-base px-7 py-12">
					<span className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-9 rounded-[20px] bg-green">
						25% sparen
					</span>
					<p className="text-[25px] text-dark_text mb-2 text-center">
						Heidi
						<span className="py-0.5 ml-1.5 px-2 rounded-base bg-green text-dark_text text-lg">
							Plus
						</span>
					</p>
					<p className="text-center text-[15px] mb-7 text-dark_text/20">
						ab <span className="text-dark_text text-[40px]">€150</span> pro Jahr
					</p>
					<p className="max-w-xs mx-auto text-center text-dark_text text-[15px] mb-9">
						Geeignet für Hausverwaltungen, deren Anforderung effiziente Prozesse und geringer Verwaltungsaufwand sind.
					</p>
					<Link
						href={ROUTE_KONTAKT}
						className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
					>
						Angebot sichern
					</Link>
					<Link
						href={ROUTE_FRAGEBOGEN}
						className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
					>
						Kostenvoranschlag erhalten
					</Link>
					<p className="pt-6 border-t border-dark_green/20 font-bold text-lg text-dark_text mb-4">
						Heidi features:
					</p>
					<ul className="space-y-4">
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Kostenfreie Installation und Wartung
						</li>
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Rechtssichere Heizkostenabrechnung
						</li>
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Verbrauchs- & Mieter-Information
						</li>
					</ul>
				</div>
				<div className="relative border-dark_green/20 border rounded-base px-7 py-12">
					<span className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-9 rounded-[20px] bg-[#EFEEEC]">
						personalisiert
					</span>
					<p className="text-[25px] text-dark_text mb-2 text-center">
						Heidi
						<span className="py-0.5 ml-1.5 px-2 rounded-base bg-[#D9D9D9] text-dark_text text-lg">
							Großkunde
						</span>
					</p>
					<p className="text-center text-[15px] mb-7 text-dark_text/20">
						Kontaktieren Sie uns für ein Angebot
					</p>
					<p className="max-w-xs mx-auto text-center text-dark_text text-[15px] mt-16 max-megalarge:mt-10 mb-9">
						Geeignet für Hausverwaltungen, deren Anforderung es ist, Prozesse zu automatisieren und skalierbar zu arbeiten.
					</p>
					<Link
						href={ROUTE_KONTAKT}
						className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
					>
						Angebot sichern
					</Link>
					<Link
						href={ROUTE_FRAGEBOGEN}
						className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
					>
						Kostenvoranschlag erhalten
					</Link>
					<p className="pt-6 border-t border-dark_green/20 font-bold text-lg text-dark_text mb-4">
						Heidi features:
					</p>
					<ul className="space-y-4">
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							API Schnittstelle zu ERP & CRM System
						</li>
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Persönlicher Ansprechpartner vorort
						</li>
						<li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
							<Image
								width={0}
								height={0}
								sizes="100vw"
								loading="lazy"
								src={checkmark_bold}
								alt="checkmark bold"
							/>
							Rechtssichere Heizkostenabrechnung
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
