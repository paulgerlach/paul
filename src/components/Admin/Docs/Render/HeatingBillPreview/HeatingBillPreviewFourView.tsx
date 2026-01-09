import { admin_logo } from "@/static/icons";
import Image from "next/image";
import { type HeatingBillPreviewData } from "./types";
import { formatDateGerman, formatEuro } from "@/utils";

export interface HeatingBillPreviewFourCalculated {
    buildingConsumption: any;
    unitConsumption: any;
    costCalculations: {
        heating: {
            grund: number;
            verbrauch: number;
            rateGrund: number;
            rateVerbrauch: number;
        };
        warmwater: {
            grund: number;
            verbrauch: number;
            rateGrund: number;
            rateVerbrauch: number;
        };
        coldwater: {
            total: number;
            details: any;
            rates: any;
            consumption: number;
        };
        unitArea: number;
        totalAmount: number;
    };
    groupedMeters: {
        heat: any[];
        hot: any[];
        cold: any[];
    };
}

export const HeatingBillPreviewFourView = ({
    previewData,
    data,
}: {
    previewData: HeatingBillPreviewData;
    data: HeatingBillPreviewFourCalculated;
}) => {
    const formatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const rateFormatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    });

    const { buildingConsumption, unitConsumption, costCalculations, groupedMeters } = data;

    return (
        <div className="mx-auto max-w-[1400px] space-y-5 font-sans text-sm">
            <div className="bg-pdf-accent rounded-base p-6 space-y-6 text-pdf-dark">
                <div className="flex justify-between items-start">
                    <div className="text-xs text-pdf-text">
                        4/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
                    </div>
                    <Image
                        width={130}
                        height={48}
                        src={admin_logo}
                        alt="admin preview heidi"
                    />
                </div>
                <div className="grid grid-cols-2 gap-20 items-end">
                    <div>
                        <div className="font-bold text-2xl mb-4">
                            Ihre Heidi Systems ® Abrechnung für <br /> Heizung, Warmwasser,
                            Kaltwasser
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="grid grid-cols-[200px_1fr] font-bold text-pdf-dark gap-5">
                                <div className="">Liegenschaft</div>
                                <div>
                                    {previewData.contractorsNames}
                                    <br />
                                    {previewData.objektInfo.street}
                                    <br />
                                    {previewData.objektInfo.zip}
                                </div>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] text-pdf-text gap-5">
                                <div>Erstellt im Auftrag von</div>
                                <div>
                                    {previewData.contractorsNames}
                                    <br />
                                    {previewData.objektInfo.street}
                                    <br />
                                    {previewData.objektInfo.zip}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-pdf-text">
                            <div className="grid grid-cols-[200px_1fr] font-bold text-pdf-dark gap-5">
                                <div>Liegenschaftsnummer</div>
                                <div>{previewData.propertyNumber}</div>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] gap-5">
                                <div>Heidi Nutzernummer</div>
                                <div>{previewData.heidiCustomerNumber}</div>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] gap-5">
                                <div>Abrechnungszeitraum</div>
                                <div>
                                    {formatDateGerman(previewData.mainDocDates.start_date)} -{" "}
                                    {formatDateGerman(previewData.mainDocDates.end_date)}
                                </div>
                            </div>
                            <div className="grid grid-cols-[200px_1fr] gap-5">
                                <div>erstellt am</div>
                                <div>
                                    {formatDateGerman(previewData.mainDocDates.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-pdf-dark font-bold">
                        <div className="border-b border-pdf-dark pb-1 mb-2">
                            Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin
                        </div>
                        <div className="text-2xl">
                            {previewData.contractorsNames}
                            <br />
                            {previewData.objektInfo.street}
                            <br />
                            {previewData.objektInfo.zip}
                        </div>
                    </div>
                </div>
            </div>

            {/* Costs */}
            <div className="space-y-5">
                <h2 className="text-xl font-bold text-pdf-title mb-4">Ihre Kosten</h2>
                <div className="text-sm">
                    {/* Heating Costs */}
                    <div className="bg-pdf-accent rounded-base font-bold p-1 pl-2">
                        Kosten für Heizung
                    </div>
                    <table className="w-full text-pdf-text">
                        <tbody>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Grundkosten
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(buildingConsumption.heat)} MWh</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.heating.rateGrund)} € je MWh</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.heating.grund)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Verbrauchskosten
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(unitConsumption.heat)} MWh</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.heating.rateVerbrauch)} € je MWh</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.heating.verbrauch)}</td>
                            </tr>
                        </tbody>
                    </table>
                    {/* Hot Water Costs */}
                    <div className="bg-pdf-accent rounded-base font-bold p-1 pl-2 mt-2">
                        Kosten für Warmwasser
                    </div>
                    <table className="w-full border-spacing-0 border-separate text-pdf-text">
                        <tbody>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Grundkosten
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(buildingConsumption.waterHot)} m³</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.warmwater.rateGrund)} € je m³</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.warmwater.grund)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Verbrauchskosten
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(unitConsumption.waterHot)} m³</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.warmwater.rateVerbrauch)} € je m³</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.warmwater.verbrauch)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 rounded-l-base border-pdf-dark border border-r-0 px-2 text-pdf-dark font-bold">
                                    Summe Kosten für Heizung und Warmwasser
                                </td>
                                <td className="border-y border-pdf-dark" colSpan={4}></td>
                                <td className="py-1 rounded-r-base border-pdf-dark border border-l-0 px-2 text-pdf-dark text-right font-bold">
                                    {formatEuro(costCalculations.heating.grund + costCalculations.heating.verbrauch + costCalculations.warmwater.grund + costCalculations.warmwater.verbrauch)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* Cold Water Costs */}
                    <div className="bg-pdf-accent rounded-base font-bold p-1 pl-2 mt-2">
                        Kosten für Kaltwasser
                    </div>
                    <table className="w-full border-spacing-0 border-separate text-pdf-text">
                        <tbody>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Kaltwasser Gesamt
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(costCalculations.coldwater.consumption)} m³</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.coldwater.rates.kaltwasser)} € je m³</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.coldwater.consumption * costCalculations.coldwater.rates.kaltwasser)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Abwasser Gesamt
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(costCalculations.coldwater.consumption)} m³</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.coldwater.rates.abwasser)} € je m³</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.coldwater.consumption * costCalculations.coldwater.rates.abwasser)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Gerätemiete Kaltwasser
                                </td>
                                <td className="py-1 px-2 text-right">{formatter.format(costCalculations.coldwater.consumption)} m³</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">{rateFormatter.format(costCalculations.coldwater.rates.geraetmiete)} € je m³</td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.coldwater.consumption * costCalculations.coldwater.rates.geraetmiete)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 pr-2 font-bold text-pdf-dark">
                                    Abrechnung Kaltwasser
                                </td>
                                <td className="py-1 px-2 text-right">1,00 Nutzeinh.</td>
                                <td className="py-1 px-2">x</td>
                                <td className="py-1 px-2 text-right">
                                    {rateFormatter.format(costCalculations.coldwater.rates.abrechnung)} € je Nutzeinh.
                                </td>
                                <td className="py-1 pl-2 text-right">=</td>
                                <td className="py-1 pl-2 text-right">{formatEuro(costCalculations.coldwater.rates.abrechnung)}</td>
                            </tr>
                            <tr>
                                <td className="py-1 rounded-l-base border-pdf-dark border border-r-0 px-2 text-pdf-dark font-bold">
                                    Summe Kosten für Kaltwasser
                                </td>
                                <td className="border-y border-pdf-dark" colSpan={4}></td>
                                <td className="py-1 rounded-r-base border-pdf-dark border border-l-0 px-2 text-pdf-dark text-right font-bold">
                                    {formatEuro(costCalculations.coldwater.total)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Total Amount */}
                <div className="bg-pdf-accent2 rounded-base text-white font-bold p-2.5 flex justify-between items-center mt-4">
                    <span className="">Gesamtbetrag</span>
                    <span className="text-lg">{formatEuro(costCalculations.totalAmount)}</span>
                </div>
            </div>

            {/* State Relief */}
            <div className="bg-pdf-accent2 rounded-base text-white font-bold py-4 px-2.5 text-sm">
                <div className="grid grid-cols-6 font-semibold items-center">
                    <p className="col-span-4">
                        Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)
                    </p>
                    <span>Betrag</span>
                    <span className="text-right">Ihr Anteil</span>
                </div>
                <div className="my-5 h-px bg-white w-full" />
                <div className="grid grid-cols-6 items-center">
                    <p className="col-span-4">Preisbremse Energie</p>
                    <span>{formatEuro(Number(previewData.invoices.find(i => i.cost_type?.toLowerCase().includes("preisbremse"))?.total_amount || 0))}</span>
                    <span className="text-right">{formatEuro(0)}</span>
                </div>
            </div>

            {/* Consumption Values */}
            <div className="space-y-5">
                <h2 className="text-xl font-bold text-pdf-title pb-2 mb-4">
                    Ihre Verbrauchswerte
                </h2>

                {/* Heating in MWh */}
                <div className="text-sm">
                    <div className="bg-pdf-accent rounded-base text-pdf-dark font-bold p-1 pl-2">
                        Heizung in MWh
                    </div>
                    <table className="w-full border-spacing-0 border-separate">
                        <thead>
                            <tr className="text-pdf-dark font-bold uppercase">
                                <th className="text-left py-1">RAUMBEZEICHNUNG</th>
                                <th className="text-left py-1">GERÄTENUMMER</th>
                                <th className="text-left py-1">GERÄTEART</th>
                                <th className="text-left py-1">ANF.-STAND</th>
                                <th className="text-left py-1">ABLESUNG</th>
                                <th className="text-left py-1">FAKTOR</th>
                                <th className="text-left py-1">VERBRAUCH</th>
                                <th className="text-left py-1">BEMERKUNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedMeters.heat.map((m, idx) => (
                                <tr key={idx} className="text-pdf-text">
                                    <td className="text-left py-1">{m.location}</td>
                                    <td className="text-left py-1">{m.id}</td>
                                    <td className="text-left py-1">{m.type}</td>
                                    <td className="text-left py-1">{rateFormatter.format(m.firstReading)}</td>
                                    <td className="text-left py-1">{rateFormatter.format(m.lastReading)}</td>
                                    <td className="text-left py-1"></td>
                                    <td className="text-left py-1">{formatter.format(m.consumption)}</td>
                                    <td className="text-left py-1"></td>
                                </tr>
                            ))}
                            <tr>
                                <td
                                    className="py-1 rounded-l-base border-pdf-dark border border-r-0 px-2 text-pdf-dark font-bold"
                                    colSpan={6}
                                >
                                    Summe Heizung
                                </td>
                                <td className="border-y font-bold text-pdf-dark border-pdf-dark">
                                    {formatter.format(unitConsumption.heat)}
                                </td>
                                <td className="py-1 rounded-r-base border-pdf-dark border border-l-0 px-2 text-right"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Hot water in m³ */}
                <div className="text-sm text-pdf-text">
                    <div className="bg-pdf-accent rounded-base text-pdf-dark font-bold p-1 pl-2">
                        Warmwasser in m³
                    </div>
                    <table className="w-full border-spacing-0 border-separate">
                        <thead>
                            <tr className="text-pdf-dark font-bold uppercase">
                                <th className="text-left py-1">RAUMBEZEICHNUNG</th>
                                <th className="text-left py-1">GERÄTENUMMER</th>
                                <th className="text-left py-1">GERÄTEART</th>
                                <th className="text-left py-1">ANF.-STAND</th>
                                <th className="text-left py-1">ABLESUNG</th>
                                <th className="text-left py-1">FAKTOR</th>
                                <th className="text-left py-1">VERBRAUCH</th>
                                <th className="text-left py-1">BEMERKUNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedMeters.hot.map((m, idx) => (
                                <tr key={idx} className="text-pdf-text">
                                    <td className="text-left py-1">{m.location}</td>
                                    <td className="text-left py-1">{m.id}</td>
                                    <td className="text-left py-1">{m.type}</td>
                                    <td className="text-left py-1">{rateFormatter.format(m.firstReading)}</td>
                                    <td className="text-left py-1">{rateFormatter.format(m.lastReading)}</td>
                                    <td className="text-left py-1"></td>
                                    <td className="text-left py-1">{formatter.format(m.consumption)}</td>
                                    <td className="text-left py-1"></td>
                                </tr>
                            ))}
                            <tr>
                                <td
                                    className="py-1 rounded-l-base border-pdf-dark border border-r-0 px-2 text-pdf-dark font-bold"
                                    colSpan={6}
                                >
                                    Summe Warmwasser
                                </td>
                                <td className="border-y font-bold text-pdf-dark border-pdf-dark">
                                    {formatter.format(unitConsumption.waterHot)}
                                </td>
                                <td className="py-1 rounded-r-base border-pdf-dark border border-l-0 px-2 text-right"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Cold water in m³ */}
                <div className="text-sm text-pdf-text">
                    <div className="bg-pdf-accent rounded-base text-pdf-dark font-bold p-1 pl-2">
                        Kaltwasser in m³
                    </div>
                    <table className="w-full border-spacing-0 border-separate">
                        <thead>
                            <tr className="text-pdf-dark font-bold uppercase">
                                <th className="text-left py-1">RAUMBEZEICHNUNG</th>
                                <th className="text-left py-1">GERÄTENUMMER</th>
                                <th className="text-left py-1">GERÄTEART</th>
                                <th className="text-left py-1">ANF.-STAND</th>
                                <th className="text-left py-1">ABLESUNG</th>
                                <th className="text-left py-1">FAKTOR</th>
                                <th className="text-left py-1">VERBRAUCH</th>
                                <th className="text-left py-1">BEMERKUNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedMeters.cold.map((m, idx) => (
                                <tr key={idx} className="text-pdf-text">
                                    <td className="text-left py-1">{m.location}</td>
                                    <td className="text-left py-1">{m.id}</td>
                                    <td className="text-left py-1">{m.type}</td>
                                    <td className="text-left py-1">{rateFormatter.format(m.firstReading)}</td>
                                    <td className="text-left py-1">{rateFormatter.format(m.lastReading)}</td>
                                    <td className="text-left py-1"></td>
                                    <td className="text-left py-1">{formatter.format(m.consumption)}</td>
                                    <td className="text-left py-1"></td>
                                </tr>
                            ))}
                            <tr>
                                <td
                                    className="py-1 rounded-l-base border-pdf-dark border border-r-0 px-2 text-pdf-dark font-bold"
                                    colSpan={6}
                                >
                                    Summe Kaltwasser
                                </td>
                                <td className="border-y font-bold text-pdf-dark border-pdf-dark">
                                    {formatter.format(unitConsumption.waterCold)}
                                </td>
                                <td className="py-1 rounded-r-base border-pdf-dark border border-l-0 px-2 text-right"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-sm text-pdf-text">
                Detaillierte Berechnung und Verteilung auf alle Nutzeinheiten des
                Gebäudes entnehmen Sie bitte der Gesamtabrechnung. Bitte wenden Sie sich
                bei Fragen zu Ihrer Abrechnung zunächst an Ihren Vermieter oder
                Verwalter. Informationen zur verbrauchsabhängigen Abrechnung finden Sie
                unter www.heidisystems.com.
            </div>
        </div>
    );
};
