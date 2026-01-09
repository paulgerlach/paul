import { checkmark_bold } from "@/static/icons";
import Image from "next/image";

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
	return (
		<div className="px-5 my-16 max-small:my-8">
			<h3 className="max-w-3xl mx-auto mb-20 text-center text-dark_text text-[50px] leading-[60px] max-medium:text-[30px] max-medium:leading-9">
				Features Vergleichen
			</h3>
			<div className="max-megalarge:overflow-x-scroll">
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
						{/* Section 1: Technologie & Digitalisierung */}
						<SectionHeader title="Technologie & Digitalisierung" />
						<FeatureRow
							label="Automatisierte digitale Fernauslesung"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Online-Plattform für alle Messdaten"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Interoperable OMS-Standards"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Monatliche Verbrauchsinformationen"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Nutzerfreundliches Dashboard"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Systemwechsel durch offener Standards"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Visualisierung von Verbrauchstrends"
							heidi={false}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Echtzeit-Datenverfügbarkeit im Dashboard"
							heidi={false}
							plus={false}
							grosskunde={true}
						/>
						<FeatureRow
							label="API-Integrationen"
							heidi={false}
							plus={false}
							grosskunde={true}
						/>

						{/* Section 2: Wirtschaftlichkeit & Effizienz */}
						<SectionHeader title="Wirtschaftlichkeit & Effizienz" />
						<FeatureRow
							label="Kostenfreie Installation der Funkzähler"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Weniger Fehlerquellen"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Zeitersparnis durch Automatisierung"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Planbare Festkosten ohne versteckte Gebühren"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Kein Vor-Ort-Termin für Ableser notwendig"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Weniger Verwaltungsaufwand in der Abrechnung"
							heidi={false}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Reduktion von Rückfragen durch klare Daten"
							heidi={false}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Frühzeitige Erkennung ineffizienter Verbräuche"
							heidi={false}
							plus={false}
							grosskunde={true}
						/>

						{/* Section 3: Recht, Sicherheit & Service */}
						<SectionHeader title="Recht, Sicherheit & Service" />
						<FeatureRow
							label="Volle Transparenz für Verwalter"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="DSGVO-konforme Datenverarbeitung"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Revisionssichere Datenhaltung"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Erfüllung aller gesetzlichen Vorgaben"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Rechtssichere Abrechnung"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Rund-um-Service"
							heidi={false}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Wartung & Fristenmanagement"
							heidi={false}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Regionale Umsetzung"
							heidi={false}
							plus={false}
							grosskunde={true}
						/>
						<FeatureRow
							label="Installation durch Meisterbetrieb"
							heidi={false}
							plus={false}
							grosskunde={true}
						/>

						{/* Section 4: Kommunikation */}
						<SectionHeader title="Kommunikation" />
						<FeatureRow
							label="Unterjährige Verbrauchsanalyse"
							heidi={true}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Mieterinformation"
							heidi={false}
							plus={true}
							grosskunde={true}
						/>
						<FeatureRow
							label="Persönlicher Ansprechpartner"
							heidi={false}
							plus={false}
							grosskunde={true}
						/>
					</tbody>
				</table>
			</div>
		</div>
	);
}
