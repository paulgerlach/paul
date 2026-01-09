import { admin_logo } from "@/static/icons";
import Image from "next/image";
import { type HeatingBillPreviewData } from "./types";
import { formatDateGerman, formatEuro } from "@/utils";

export interface HeatingBillPreviewThreeCalculated {
    buildingConsumption: any;
    kwCosts: {
        kaltwasser: number;
        abwasser: number;
        geraetmiete: number;
        abrechnung: number;
    };
    kwRates: {
        kaltwasser: number;
        abwasser: number;
        geraetmiete: number;
        abrechnung: number;
    };
    sums: {
        totalKwCosts: number;
        totalRate: number;
    };
}

export const HeatingBillPreviewThreeView = ({
    previewData,
    data,
}: {
    previewData: HeatingBillPreviewData;
    data: HeatingBillPreviewThreeCalculated;
}) => {
    const formatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const rateFormatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    });

    const { buildingConsumption, kwCosts, kwRates, sums } = data;

    return (
        <div className="mx-auto max-w-[1400px] space-y-6 font-sans text-sm">
            {/* Green Header Box */}
            <div className="bg-pdf-accent rounded-base p-6 text-pdf-dark">
                <div className="flex justify-between items-start">
                    <div className="text-xs text-pdf-text">
                        3/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
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
                    Berechnung und Aufteilung der Kosten für Kaltwasser
                </h2>

                <table className="w-full text-pdf-text">
                    <thead>
                        <tr className="border-b border-pdf-dark font-bold text-pdf-dark">
                            <th className="text-left py-2">KOSTENART</th>
                            <th className="text-right py-2">GESAMTKOSTEN</th>
                            <th className="text-center py-2 px-4">/</th>
                            <th className="text-right py-2">GESAMTEINHEITEN</th>
                            <th className="text-center py-2 px-2">=</th>
                            <th className="text-right py-2">PREIS JE EINHEIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2">Kaltwasser Gesamt</td>
                            <td className="text-right py-2">{formatEuro(kwCosts.kaltwasser)}</td>
                            <td className="text-center py-2 px-4">:</td>
                            <td className="text-right py-2">{formatter.format(buildingConsumption.waterCold)} m³</td>
                            <td className="text-center py-2 px-2">=</td>
                            <td className="text-right py-2">{rateFormatter.format(kwRates.kaltwasser)} €/m³</td>
                        </tr>
                        <tr>
                            <td className="py-2">Abwasser Gesamt</td>
                            <td className="text-right py-2">{formatEuro(kwCosts.abwasser)}</td>
                            <td className="text-center py-2 px-4">:</td>
                            <td className="text-right py-2">{formatter.format(buildingConsumption.waterCold)} m³</td>
                            <td className="text-center py-2 px-2">=</td>
                            <td className="text-right py-2">{rateFormatter.format(kwRates.abwasser)} €/m³</td>
                        </tr>
                        <tr>
                            <td className="py-2">Gerätemiete Kaltwasser</td>
                            <td className="text-right py-2">{formatEuro(kwCosts.geraetmiete)}</td>
                            <td className="text-center py-2 px-4">:</td>
                            <td className="text-right py-2">{formatter.format(buildingConsumption.waterCold)} m³</td>
                            <td className="text-center py-2 px-2">=</td>
                            <td className="text-right py-2">{rateFormatter.format(kwRates.geraetmiete)} €/m³</td>
                        </tr>
                        <tr className="border-t border-pdf-dark font-bold text-pdf-dark">
                            <td className="py-2">Summe</td>
                            <td className="text-right py-2">{formatEuro(kwCosts.kaltwasser + kwCosts.abwasser + kwCosts.geraetmiete)}</td>
                            <td colSpan={3}></td>
                            <td className="text-right py-2">{rateFormatter.format(kwRates.kaltwasser + kwRates.abwasser + kwRates.geraetmiete)} €/m³</td>
                        </tr>
                        <tr>
                            <td className="py-2 pt-6">Abrechnung Kaltwasser</td>
                            <td className="text-right py-2 pt-6">{formatEuro(kwCosts.abrechnung)}</td>
                            <td className="text-center py-2 px-4 pt-6">:</td>
                            <td className="text-right py-2 pt-6">{previewData.contracts.length} Nutzeinheiten</td>
                            <td className="text-center py-2 px-2 pt-6">=</td>
                            <td className="text-right py-2 pt-6">{rateFormatter.format(kwRates.abrechnung)} €/NE</td>
                        </tr>
                        <tr className="border-y border-pdf-dark font-bold text-pdf-dark bg-pdf-accent">
                            <td className="py-2 pl-2 rounded-l-base">Gesamtkosten Kaltwasser</td>
                            <td className="text-right py-2 pr-2 rounded-r-base">{formatEuro(sums.totalKwCosts)}</td>
                            <td colSpan={4}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
