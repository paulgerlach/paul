"use client";

import { checkmark_bold } from "@/static/icons";
import Image from "next/image";
import { Fragment, useState } from "react";

// Feature data structure
type Feature = {
	label: string;
	heidi: boolean;
	plus: boolean;
	grosskunde: boolean;
};

type Section = {
	title: string;
	features: Feature[];
};

const sections: Section[] = [
	{
		title: "Technologie & Digitalisierung",
		features: [
			{ label: "Automatisierte digitale Fernauslesung", heidi: true, plus: true, grosskunde: true },
			{ label: "Online-Plattform für alle Messdaten", heidi: true, plus: true, grosskunde: true },
			{ label: "Interoperable OMS-Standards", heidi: true, plus: true, grosskunde: true },
			{ label: "Monatliche Verbrauchsinformationen", heidi: true, plus: true, grosskunde: true },
			{ label: "Nutzerfreundliches Dashboard", heidi: true, plus: true, grosskunde: true },
			{ label: "Systemwechsel durch offener Standards", heidi: true, plus: true, grosskunde: true },
			{ label: "Visualisierung von Verbrauchstrends", heidi: false, plus: true, grosskunde: true },
			{ label: "Echtzeit-Datenverfügbarkeit im Dashboard", heidi: false, plus: false, grosskunde: true },
			{ label: "API-Integrationen", heidi: false, plus: false, grosskunde: true },
		],
	},
	{
		title: "Wirtschaftlichkeit & Effizienz",
		features: [
			{ label: "Kostenfreie Installation der Funkzähler", heidi: true, plus: true, grosskunde: true },
			{ label: "Weniger Fehlerquellen", heidi: true, plus: true, grosskunde: true },
			{ label: "Zeitersparnis durch Automatisierung", heidi: true, plus: true, grosskunde: true },
			{ label: "Planbare Festkosten ohne versteckte Gebühren", heidi: true, plus: true, grosskunde: true },
			{ label: "Kein Vor-Ort-Termin für Ableser notwendig", heidi: true, plus: true, grosskunde: true },
			{ label: "Weniger Verwaltungsaufwand in der Abrechnung", heidi: false, plus: true, grosskunde: true },
			{ label: "Reduktion von Rückfragen durch klare Daten", heidi: false, plus: true, grosskunde: true },
			{ label: "Frühzeitige Erkennung ineffizienter Verbräuche", heidi: false, plus: false, grosskunde: true },
		],
	},
	{
		title: "Recht, Sicherheit & Service",
		features: [
			{ label: "Volle Transparenz für Verwalter", heidi: true, plus: true, grosskunde: true },
			{ label: "DSGVO-konforme Datenverarbeitung", heidi: true, plus: true, grosskunde: true },
			{ label: "Revisionssichere Datenhaltung", heidi: true, plus: true, grosskunde: true },
			{ label: "Erfüllung aller gesetzlichen Vorgaben", heidi: true, plus: true, grosskunde: true },
			{ label: "Rechtssichere Abrechnung", heidi: true, plus: true, grosskunde: true },
			{ label: "Rund-um-Service", heidi: false, plus: true, grosskunde: true },
			{ label: "Wartung & Fristenmanagement", heidi: false, plus: true, grosskunde: true },
			{ label: "Regionale Umsetzung", heidi: false, plus: false, grosskunde: true },
			{ label: "Installation durch Meisterbetrieb", heidi: false, plus: false, grosskunde: true },
		],
	},
	{
		title: "Kommunikation",
		features: [
			{ label: "Unterjährige Verbrauchsanalyse", heidi: true, plus: true, grosskunde: true },
			{ label: "Mieterinformation", heidi: false, plus: true, grosskunde: true },
			{ label: "Persönlicher Ansprechpartner", heidi: false, plus: false, grosskunde: true },
		],
	},
];

// Desktop Feature row component
const FeatureRow = ({ label, heidi, plus, grosskunde }: Feature) => (
	<tr className="divide-x divide-dark_green/20">
		<td className="px-7 py-2.5 text-lg text-dark_text">{label}</td>
		<td className="px-7 py-2.5">
			{heidi && (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={checkmark_bold}
					alt="checkmark bold"
				/>
			)}
		</td>
		<td className="px-7 py-2.5">
			{plus && (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={checkmark_bold}
					alt="checkmark bold"
				/>
			)}
		</td>
		<td className="px-7 py-2.5">
			{grosskunde && (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={checkmark_bold}
					alt="checkmark bold"
				/>
			)}
		</td>
	</tr>
);

// Desktop Section header component
const SectionHeader = ({ title }: { title: string }) => (
	<tr>
		<td
			className="px-7 border-y border-dark_green/20 py-3.5 bg-[#F4F3F2] text-lg font-bold text-dark_text"
			colSpan={4}
		>
			{title}
		</td>
	</tr>
);

// Mobile Feature item component
const MobileFeatureItem = ({ label, included }: { label: string; included: boolean }) => (
	<div className="flex items-start gap-3 py-2.5 border-b border-dark_green/10">
		{included ? (
			<Image
				width={20}
				height={20}
				loading="lazy"
				className="mt-0.5 flex-shrink-0"
				src={checkmark_bold}
				alt="included"
			/>
		) : (
			<span className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center text-dark_text/30">✗</span>
		)}
		<span className={`text-sm ${included ? "text-dark_text" : "text-dark_text/40"}`}>{label}</span>
	</div>
);

// Mobile Section component
const MobileSection = ({ title, features, planKey }: { title: string; features: Feature[]; planKey: "heidi" | "plus" | "grosskunde" }) => (
	<div className="mb-6">
		<div className="bg-[#F4F3F2] px-4 py-2.5 rounded-lg mb-2">
			<p className="font-bold text-dark_text text-sm">{title}</p>
		</div>
		<div className="px-2">
			{features.map((feature, index) => (
				<MobileFeatureItem key={index} label={feature.label} included={feature[planKey]} />
			))}
		</div>
	</div>
);

// Plan info for tabs
const plans = [
	{ key: "heidi" as const, name: "Heidi", subtitle: "2-50 Wohneinheiten", buttonBg: "bg-dark_green" },
	{ key: "plus" as const, name: "Heidi Plus", subtitle: "50-200 Wohneinheiten", buttonBg: "bg-green" },
	{ key: "grosskunde" as const, name: "Großkunde", subtitle: "+201 Wohneinheiten", buttonBg: "bg-green" },
];

// Feature row component for cleaner code
const FeatureRow = ({
	label,
	heidi,
	plus,
	grosskunde,
}: {
	label: string;
	heidi: boolean;
	plus: boolean;
	grosskunde: boolean;
}) => (
	<tr className="divide-x divide-dark_green/20">
		<td className="px-7 py-2.5 text-lg text-dark_text">{label}</td>
		<td className="px-7 py-2.5">
			{heidi && (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={checkmark_bold}
					alt="checkmark bold"
				/>
			)}
		</td>
		<td className="px-7 py-2.5">
			{plus && (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={checkmark_bold}
					alt="checkmark bold"
				/>
			)}
		</td>
		<td className="px-7 py-2.5">
			{grosskunde && (
				<Image
					width={0}
					height={0}
					sizes="100vw"
					loading="lazy"
					className="block mx-auto"
					src={checkmark_bold}
					alt="checkmark bold"
				/>
			)}
		</td>
	</tr>
);

// Section header component
const SectionHeader = ({ title }: { title: string }) => (
	<tr>
		<td
			className="px-7 border-y border-dark_green/20 py-3.5 bg-[#F4F3F2] text-lg font-bold text-dark_text"
			colSpan={4}
		>
			{title}
		</td>
	</tr>
);

export default function PriceTable() {
	const [activeTab, setActiveTab] = useState<"heidi" | "plus" | "grosskunde">("heidi");

	return (
		<div className="px-5 my-16 max-small:my-8">
			<h3 className="max-w-3xl mx-auto mb-20 max-small:mb-8 text-center text-dark_text text-[50px] leading-[60px] max-medium:text-[30px] max-medium:leading-9">
				Features Vergleichen
			</h3>

			{/* Desktop Table - Hidden on mobile */}
			<div className="max-small:hidden max-megalarge:overflow-x-scroll">
				<table className="w-full">
					<thead>
						<tr className="divide-x divide-dark_green/20">
							<th className="p-5"></th>
							<th className="p-5 min-w-[308px]">
								<p className="text-[25px] text-dark_text mb-2 text-center">
									Heidi
								</p>
								<p className="text-center text-[15px] mb-7 text-dark_text/20">
									2-50 Wohneinheiten
								</p>
								<a
									href="/kontakt"
									className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
								>
									Beraten lassen
								</a>
								<a
									href="/fragebogen"
									className="text-white bg-dark_green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
								>
									Jetzt starten
								</a>
							</th>
							<th className="p-5 min-w-[308px]">
								<p className="text-[25px] text-dark_text mb-2 text-center">
									Heidi
									<span className="py-0.5 ml-1.5 px-2 rounded-base bg-green text-dark_text text-lg">
										Plus
									</span>
								</p>
								<p className="text-center text-[15px] mb-7 text-dark_text/20">
									50-200 Wohneinheiten
								</p>
								<a
									href="/kontakt"
									className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
								>
									Angebot sichern
								</a>
								<a
									href="/fragebogen"
									className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
								>
									Kostenvoranschlag erhalten
								</a>
							</th>
							<th className="p-5 min-w-[308px]">
								<p className="text-[25px] text-dark_text mb-2 text-center">
									Heidi
									<span className="py-0.5 ml-1.5 px-2 rounded-base bg-[#D9D9D9] text-dark_text text-lg">
										Großkunde
									</span>
								</p>
								<p className="text-center text-[15px] mb-7 text-dark_text/20">
									+201 Wohneinheiten
								</p>
								<a
									href="/kontakt"
									className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10"
								>
									Angebot sichern
								</a>
								<a
									href="/fragebogen"
									className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80"
								>
									Kostenvoranschlag erhalten
								</a>
							</th>
						</tr>
					</thead>
					<tbody>
						{sections.map((section) => (
							<Fragment key={section.title}>
								<SectionHeader title={section.title} />
								{section.features.map((feature, index) => (
									<FeatureRow key={index} {...feature} />
								))}
							</Fragment>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile Tab-based View */}
			<div className="hidden max-small:block">
				{/* Tabs */}
				<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
					{plans.map((plan) => (
						<button
							key={plan.key}
							onClick={() => setActiveTab(plan.key)}
							className={`flex-1 min-w-[100px] px-3 py-3 rounded-xl text-center transition-all ${
								activeTab === plan.key
									? "bg-green text-dark_text font-semibold"
									: "bg-gray-100 text-dark_text/60"
							}`}
						>
							<p className="text-sm font-medium">
								{plan.key === "heidi" ? "Heidi" : plan.key === "plus" ? "Plus" : "Großkunde"}
							</p>
						</button>
					))}
				</div>

				{/* Plan Header */}
				<div className="text-center mb-6 pb-4 border-b border-dark_green/10">
					<p className="text-xl font-bold text-dark_text mb-1">
						{plans.find(p => p.key === activeTab)?.name}
					</p>
					<p className="text-sm text-dark_text/50">
						{plans.find(p => p.key === activeTab)?.subtitle}
					</p>
				</div>

				{/* Features List */}
				{sections.map((section) => (
					<MobileSection
						key={section.title}
						title={section.title}
						features={section.features}
						planKey={activeTab}
					/>
				))}

				{/* CTA Button */}
				<div className="mt-8 space-y-3">
					<a
						href="/kontakt"
						className="text-dark_text flex items-center justify-center w-full py-3 border border-dark_green/20 rounded-xl text-base transition hover:border-dark_green/40"
					>
						Beraten lassen
					</a>
					<a
						href="/fragebogen"
						className={`text-white ${plans.find(p => p.key === activeTab)?.buttonBg} flex items-center justify-center w-full py-3 rounded-xl text-base transition hover:opacity-80`}
					>
						Jetzt starten
					</a>
				</div>
			</div>
		</div>
	);
}
