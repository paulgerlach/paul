import { admin_logo } from "@/static/icons";
import Image from "next/image";
import { type HeatingBillPreviewData } from "./types";
import { formatDateGerman, formatEuro } from "@/utils";
import { calculateLocalInvoiceShare } from "../BetriebskostenabrechnungPdf/BetriebskostenabrechnungPreview";

export interface HeatingBillPreviewTwoCalculated {
	buildingConsumption: any;
	sums: {
		energySum: number;
		additionalSum: number;
		separateSum: number;
		energyAndHeatingSum: number;
		grandTotal: number;
	};
	thermal: {
		totalEnergykWh: number;
		totalWaterHotm3: number;
		warmWaterEnergykWh: number;
		warmWaterPercent: number;
		warmWaterBaseCosts: number;
		warmWaterGeräteAmount: number;
		totalWarmWaterCosts: number;
		heatingGeräteAmount: number;
		remainingHeatingEnergyCosts: number;
		totalHeatingCosts: number;
	};
	costGroups: {
		energy: any[];
		additional: any[];
		separate: any[];
	};
}

export const HeatingBillPreviewTwoView = ({
	previewData,
	data,
}: {
	previewData: HeatingBillPreviewData;
	data: HeatingBillPreviewTwoCalculated;
}) => {
	const formatter = new Intl.NumberFormat("de-DE", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	const { costCategories, invoices } = previewData;
	const { buildingConsumption, costGroups, sums, thermal } = data;

	return (
		<div className="mx-auto max-w-[1400px] space-y-6 font-sans text-sm">
			{/* Green Header Box */}
			<div className="bg-pdf-accent rounded-base p-6 text-pdf-dark">
				<div className="flex justify-between items-start">
					<div className="text-xs text-pdf-text">
						2/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
					</div>
					<Image
						width={130}
						height={48}
						src={admin_logo}
						alt="admin preview heidi"
					/>
				</div>
				<div className="grid grid-cols-2 gap-20 mt-4">
					<div className="space-y-6">
						<h1 className="font-bold text-2xl pb-2 border-b border-pdf-dark">
							Heidi Systems® Gesamtrechnung
							<br />
							Heizung, Warmwasser, Kaltwasser
						</h1>
						<p className="text-sm text-pdf-text">
							Die Gesamtabrechnung bildet die Aufteilung der Kosten für das
							gesamte Gebäude ab. Die anteiligen Kosten Ihrer Nutzeinheit
							entnehmen Sie bitte dem Formular &quot;Ihre Abrechnung&quot;.
						</p>
					</div>
					<div className="space-y-2 text-sm text-pdf-text">
						<div className="grid grid-cols-[200px_1fr] gap-10">
							<p>Liegenschaft</p>
							<p>
								{previewData.contractorsNames}
								<br />
								{previewData.objektInfo.street}
								<br />
								{previewData.objektInfo.zip}
							</p>
						</div>
						<div className="grid grid-cols-[200px_1fr] gap-10">
							<p>Liegenschaftsnummer</p>
							<p>{previewData.propertyNumber}</p>
						</div>
						<div className="grid grid-cols-[200px_1fr] gap-10">
							<p>Abrechnungszeitraum</p>
							<p>
								{formatDateGerman(previewData.mainDocDates.start_date)} -{" "}
								{formatDateGerman(previewData.mainDocDates.end_date)}
							</p>
						</div>
						<div className="grid grid-cols-[200px_1fr] gap-10">
							<p>erstellt am</p>
							<p>{formatDateGerman(previewData.mainDocDates.created_at)}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="sapce-y-6">
				<h2 className="text-xl font-bold text-pdf-title border-b border-pdf-dark pb-2 mb-4">
					Aufstellung der Kosten
				</h2>
				<div className="grid grid-cols-2 gap-6">
					<div className="space-y-2.5">
						<div className="font-bold text-pdf-dark">
							Energieart: Nah-/Fernwärme kWh
						</div>
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-left uppercase font-semibold bg-pdf-accent2 rounded-l-base text-white py-1 px-2">
										POSITION
									</th>
									<th className="uppercase font-semibold bg-pdf-accent2 text-white py-1 px-2">
										DATUM
									</th>
									<th className="text-right uppercase font-semibold bg-pdf-accent2 text-white py-1 px-2">
										kWh
									</th>
									<th className="text-right uppercase font-semibold bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
										BETRAG
									</th>
								</tr>
							</thead>
							<tbody>
								{costGroups.energy.map((inv, idx) => (
									<tr key={inv.id || idx}>
										<td className="py-1 px-2">
											<div className="font-medium">{inv.cost_type}</div>
											{inv.notes && (
												<div className="text-[10px] text-pdf-text italic">
													{inv.notes}
												</div>
											)}
										</td>
										<td className="py-1 px-2 text-center text-xs">
											{inv.invoice_date
												? formatDateGerman(inv.invoice_date)
												: ""}
										</td>
										<td className="py-1 px-2 text-right">
											{/* Fallback to building consumption for Heat if it's an energy invoice */}
											{idx === 0 && Number(inv.total_amount) > 0
												? formatter.format(buildingConsumption.heat)
												: ""}
										</td>
										<td className="py-1 px-2 text-right">
											{formatEuro(Number(inv.total_amount || 0))}
										</td>
									</tr>
								))}
								<tr className="font-bold">
									<td className="text-left bg-pdf-accent rounded-l-base text-pdf-dark py-1 px-2">
										Summe Verbrauch
									</td>
									<td className="bg-pdf-accent text-pdf-dark py-1 px-2"></td>
									<td className="text-right bg-pdf-accent text-pdf-dark py-1 px-2">
										{formatter.format(buildingConsumption.heat)}
									</td>
									<td className="text-right bg-pdf-accent rounded-r-base text-pdf-dark py-1 px-2">
										{formatEuro(sums.energySum)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div>
						<div className="font-bold mb-2">Weitere Heizungsbetriebskosten</div>
						<table className="w-full">
							<thead>
								<tr>
									<th className="text-left uppercase font-semibold bg-pdf-accent2 rounded-l-base text-white py-1 px-2">
										POSITION
									</th>
									<th className="uppercase font-semibold bg-pdf-accent2 text-white py-1 px-2">
										DATUM
									</th>
									<th className="text-right uppercase font-semibold bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
										BETRAG
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className="py-1 px-2 italic font-medium">Übertrag</td>
									<td></td>
									<td className="py-1 px-2 text-right">
										{formatEuro(sums.energySum)}
									</td>
								</tr>
								{costGroups.additional.map((inv, idx) => (
									<tr key={inv.id || idx}>
										<td className="py-1 px-2">{inv.cost_type}</td>
										<td className="py-1 px-2 text-center text-xs">
											{inv.invoice_date
												? formatDateGerman(inv.invoice_date)
												: ""}
										</td>
										<td className="py-1 px-2 text-right">
											{formatEuro(Number(inv.total_amount || 0))}
										</td>
									</tr>
								))}
								{/*{invoices.map((row) => {
                    const costCategory = costCategories.find(
                      (category) => category.type === row.cost_type,
                    );

                    const localShare = calculateLocalInvoiceShare({
                      invoice: row,
                      allocationKey: costCategory?.allocation_key,
                      livingSpace: Number(living_space),
                      totalLivingSpace,
                      totalUnits: filteredContracts.length,
                      localConsumption:
                        buildingConsumption.waterCold +
                        buildingConsumption.waterHot +
                        buildingConsumption.heat,
                      totalConsumption:
                        buildingConsumption.waterCold +
                        buildingConsumption.waterHot +
                        buildingConsumption.heat,
                    });
                    return (
                      <tr className="font-bold">
                        <td
                          className="text-left bg-pdf-accent rounded-l-base text-pdf-dark py-1 px-2"
                          colSpan={2}
                        >
                          Summe Energie- und Heizungsbetriebskosten
                        </td>
                        <td className="text-right bg-pdf-accent rounded-r-base text-pdf-dark py-1 px-2">
                          {formatEuro(sums.energyAndHeatingSum)}
                        </td>
                      </tr>
                    )
                  }*/}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Costs for separate distribution */}
			<div className="mt-6">
				<h3 className="text-xl font-bold text-pdf-title border-b-2 border-pdf-dark pb-2 mb-4">
					Kosten für gesonderte Verteilung
				</h3>
				<table className="w-full">
					<thead>
						<tr>
							<th className="text-left uppercase font-semibold bg-pdf-accent2 rounded-l-base text-white py-1 px-2">
								VERTEILUNG NACH
							</th>
							<th className="text-left uppercase font-semibold bg-pdf-accent2 text-white py-1 px-2">
								POSITION
							</th>
							<th className="uppercase font-semibold bg-pdf-accent2 text-white py-1 px-2">
								DATUM
							</th>
							<th className="text-right uppercase font-semibold bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
								BETRAG
							</th>
						</tr>
					</thead>
					<tbody>
						{costGroups.separate.map((inv, idx) => {
							const category = previewData.costCategories.find(
								(c) => c.type === inv.cost_type,
							);
							return (
								<tr key={`sep-${idx}`}>
									<td className="py-1 px-2 font-medium">
										{category?.allocation_key || "Warmwasser/Kaltwasser"}
									</td>
									<td className="py-1 px-2">{inv.cost_type}</td>
									<td className="py-1 px-2 text-center text-xs">
										{inv.invoice_date ? formatDateGerman(inv.invoice_date) : ""}
									</td>
									<td className="py-1 px-2 text-right">
										{formatEuro(Number(inv.total_amount || 0))}
									</td>
								</tr>
							);
						})}

						<tr className="font-bold">
							<td
								className="text-left bg-pdf-accent rounded-l-base text-pdf-dark py-1 px-2"
								colSpan={3}
							>
								Summe Kosten zur gesonderten Verteilung
							</td>
							<td className="text-right bg-pdf-accent rounded-r-base text-pdf-dark py-1 px-2">
								{formatEuro(sums.separateSum)}
							</td>
						</tr>
						<tr className="font-bold">
							<td
								className="text-left bg-pdf-accent2 rounded-l-base text-white py-1 px-2"
								colSpan={3}
							>
								Summe der zu verteilenden Kosten
							</td>
							<td className="text-right bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
								{formatEuro(sums.grandTotal)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="bg-pdf-accent2 text-white rounded-base p-6 mt-6">
				<h2 className="text-xl font-bold border-b border-white pb-2 mb-4">
					Aufteilung der Kosten
				</h2>
				<div className="">
					<div className="font-bold">
						Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung
					</div>
					<div className="flex items-center justify-between mt-2">
						<div className="flex flex-col items-center">
							<span>
								2,5 kWh/m³/K x {formatter.format(thermal.totalWaterHotm3)} m³ x
								(60-10°C)
							</span>
							<div className="text-center w-full font-bold border-t border-white mt-2 pt-2">
								1,15
							</div>
						</div>
						<span>
							= {formatter.format(thermal.warmWaterEnergykWh)} kWh
							Nah-/Fernwärme
						</span>
						<span>
							= {formatter.format(thermal.warmWaterPercent)}% d. Gesamtverbr.
						</span>
					</div>
				</div>
			</div>

			{/* Cost Allocation Details */}
			<div className="mt-6 space-y-8">
				<div>
					<div className="flex justify-between text-pdf-text">
						<div>
							{formatter.format(thermal.warmWaterPercent)}% aus{" "}
							{formatEuro(sums.energyAndHeatingSum)} Energie- und
							Heizungsbetriebskosten entspricht Kosten für Erwärmung Warmwasser
						</div>
						<div>{formatEuro(thermal.warmWaterBaseCosts)}</div>
					</div>
					{thermal.warmWaterGeräteAmount > 0 && (
						<div className="flex justify-between text-pdf-text">
							<div className="font-bold text-pdf-dark">
								Gerätemiete Heizung/Warmwasser
							</div>
							<div>{formatEuro(thermal.warmWaterGeräteAmount)}</div>
						</div>
					)}
					<div className="flex justify-between rounded-base bg-pdf-accent font-bold p-2 mt-2 text-pdf-dark">
						<div>Kosten für Warmwasser</div>
						<div>{formatEuro(thermal.totalWarmWaterCosts)}</div>
					</div>
					<div className="grid grid-cols-4 text-pdf-text gap-4 mt-2">
						<div className="text-pdf-dark font-bold">
							davon {previewData.mainDocData?.living_space_share || 30}%
							Grundkosten
						</div>
						<div className="text-right">
							{formatEuro(
								(thermal.totalWarmWaterCosts *
									Number(previewData.mainDocData?.living_space_share || 30)) /
									100,
							)}{" "}
							:
						</div>
						<div className="text-right">{previewData.totalLivingSpace} m²</div>
						<div className="text-right">
							={" "}
							{formatter.format(
								(thermal.totalWarmWaterCosts *
									Number(previewData.mainDocData?.living_space_share || 30)) /
									100 /
									(previewData.totalLivingSpace || 1),
							)}{" "}
							€/m²
						</div>
					</div>
					<div className="grid grid-cols-4 text-pdf-text gap-4">
						<div className="text-pdf-dark font-bold">
							davon {previewData.mainDocData?.consumption_dependent || 70}%
							Verbrauchskosten
						</div>
						<div className="text-right">
							{formatEuro(
								(thermal.totalWarmWaterCosts *
									Number(
										previewData.mainDocData?.consumption_dependent || 70,
									)) /
									100,
							)}{" "}
							:
						</div>
						<div className="text-right">
							{formatter.format(thermal.totalWaterHotm3)} m³
						</div>
						<div className="text-right">
							={" "}
							{formatter.format(
								(thermal.totalWarmWaterCosts *
									Number(
										previewData.mainDocData?.consumption_dependent || 70,
									)) /
									100 /
									(thermal.totalWaterHotm3 || 1),
							)}{" "}
							€/m³
						</div>
					</div>
				</div>

				<div>
					<div className="font-bold border-b text-pdf-title border-pdf-dark pb-2 mb-2 uppercase text-xs">
						Berechnung und Aufteilung der Kosten für Heizung
					</div>
					<div className="flex justify-between text-pdf-text">
						<div className="font-bold text-pdf-dark">
							Summe Energie- und Heizungsbetriebskosten
						</div>
						<div>{formatEuro(sums.energyAndHeatingSum)}</div>
					</div>
					<div className="flex justify-between text-pdf-text">
						<div className="font-bold text-pdf-dark">
							abzüglich Kosten für Erwärmung Warmwasser
						</div>
						<div>-{formatEuro(thermal.warmWaterBaseCosts)}</div>
					</div>
					{thermal.heatingGeräteAmount > 0 && (
						<div className="flex justify-between text-pdf-text">
							<div className="font-bold text-pdf-dark">
								Gerätemiete Heizung/Warmwasser
							</div>
							<div>{formatEuro(thermal.heatingGeräteAmount)}</div>
						</div>
					)}
					<div className="flex justify-between rounded-base bg-pdf-accent font-bold p-2 text-pdf-dark my-2">
						<div>Kosten für Heizung</div>
						<div>{formatEuro(thermal.totalHeatingCosts)}</div>
					</div>
					<div className="grid grid-cols-4 text-pdf-text gap-4">
						<div className="text-pdf-dark font-bold">
							davon {previewData.mainDocData?.living_space_share || 30}%
							Grundkosten
						</div>
						<div className="text-right">
							{formatEuro(
								(thermal.totalHeatingCosts *
									Number(previewData.mainDocData?.living_space_share || 30)) /
									100,
							)}{" "}
							:
						</div>
						<div className="text-right">{previewData.totalLivingSpace} m²</div>
						<div className="text-right">
							={" "}
							{formatter.format(
								(thermal.totalHeatingCosts *
									Number(previewData.mainDocData?.living_space_share || 30)) /
									100 /
									(previewData.totalLivingSpace || 1),
							)}{" "}
							€/m²
						</div>
					</div>
					<div className="grid grid-cols-4 text-pdf-text gap-4">
						<div className="text-pdf-dark font-bold">
							davon {previewData.mainDocData?.consumption_dependent || 70}%
							Verbrauchskosten
						</div>
						<div className="text-right">
							{formatEuro(
								(thermal.totalHeatingCosts *
									Number(
										previewData.mainDocData?.consumption_dependent || 70,
									)) /
									100,
							)}{" "}
							:
						</div>
						<div className="text-right">
							{formatter.format(
								thermal.totalEnergykWh - thermal.warmWaterEnergykWh,
							)}{" "}
							kWh
						</div>
						<div className="text-right">
							={" "}
							{formatter.format(
								(thermal.totalHeatingCosts *
									Number(
										previewData.mainDocData?.consumption_dependent || 70,
									)) /
									100 /
									(thermal.totalEnergykWh - thermal.warmWaterEnergykWh || 1),
							)}{" "}
							€/kWh
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
