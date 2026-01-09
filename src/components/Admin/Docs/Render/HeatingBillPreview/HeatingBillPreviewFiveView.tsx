import Image from "next/image";
import { admin_logo } from "@/static/icons";
import { type HeatingBillPreviewData } from "./types";
import { formatDateGerman } from "@/utils";

export interface HeatingBillPreviewFiveCalculated {
    co2Consumption: number; // kWh
    co2Emission: number; // kg
    co2Cost: number; // EUR
    buildingLivingSpace: number; // m²
    co2EmissionFactor: number; // kg/kWh
    co2EmissionPerSqm: number; // kg/m²/a
    tenantSharePercent: number;
    landlordSharePercent: number;
    unitCostDetails: {
        tenant: number;
        landlord: number;
        total: number;
    };
}

export const HeatingBillPreviewFiveView = ({
    previewData,
    data,
}: {
    previewData: HeatingBillPreviewData;
    data: HeatingBillPreviewFiveCalculated;
}) => {
    const {
        co2Consumption,
        co2Emission,
        co2Cost,
        buildingLivingSpace,
        co2EmissionFactor,
        co2EmissionPerSqm,
        tenantSharePercent,
        landlordSharePercent,
        unitCostDetails,
    } = data;

    const formatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    });

    const costFormatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const factorFormatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    });

    const shareFormatter = new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });

    return (
        <div className="mx-auto max-w-[1400px] space-y-6 font-sans text-sm">
            {/* Header */}
            <div className="bg-pdf-accent rounded-base p-6 space-y-6 text-pdf-dark">
                <div className="flex justify-between items-start">
                    <div className="text-xs text-pdf-text">
                        5/6 {previewData.propertyNumber}/{previewData.heidiCustomerNumber}
                    </div>
                    <div className="flex items-center gap-2">
                        <Image
                            width={130}
                            height={48}
                            src={admin_logo}
                            alt="admin preview heidi"
                        />
                    </div>
                </div>
            </div>

            <p className="text-xs text-pdf-text">
                Seit 2021 wird eine CO2-Abgabe gemäß Brennstoffemissionshandelsgesetz
                (BEHG) für fossile Brennstoffe erhoben, welche Kohlenstoffdioxid (CO2)
                emittieren. Das zum 01.01.2023 in Kraft getretene
                Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) regelt die Aufteilung
                der CO2-Kosten zwischen Mieter und Vermieter.
            </p>

            {/* Title */}

            <h1 className="text-xl font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
                CO2-Kostenaufteilung
            </h1>
            <div className="font-bold text-pdf-dark mb-1">
                Energieart: Nah-/Fernwärme
            </div>

            {/* CO2 Costs of the Property */}
            <div className="text-sm mb-4">
                <table className="w-full text-pdf-text border-spacing-0 border-separate">
                    <thead>
                        <tr className="font-fold text-pdf-dark uppercase">
                            <th className="text-left px-2 bg-pdf-accent rounded-l-base py-1">
                                POSITION
                            </th>
                            <th className="text-left bg-pdf-accent py-1">DATUM</th>
                            <th className="text-right bg-pdf-accent py-1">Menge in kWh</th>
                            <th className="text-right bg-pdf-accent py-1">
                                CO2-Emissionen in kg
                            </th>
                            <th className="text-right px-2 bg-pdf-accent rounded-r-base py-1">
                                CO2-Kosten in EUR
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-1 px-2">Bezug</td>
                            <td className="py-1">
                                {formatDateGerman(previewData.mainDocDates.created_at)}
                            </td>
                            <td className="py-1 text-right">{formatter.format(co2Consumption)}</td>
                            <td className="py-1 text-right">{formatter.format(co2Emission)}</td>
                            <td className="py-1 px-2 text-right">{costFormatter.format(co2Cost)}</td>
                        </tr>
                        <tr>
                            <td className="py-1 px-2">Summe Verbrauch</td>
                            <td></td>
                            <td className="py-1 text-right">{formatter.format(co2Consumption)}</td>
                            <td className="py-1 text-right">{formatter.format(co2Emission)}</td>
                            <td className="py-1 px-2 text-right">{costFormatter.format(co2Cost)}</td>
                        </tr>
                        <tr className="text-pdf-dark font-bold">
                            <td className="py-1 px-2 rounded-l-base border border-r-0 border-pdf-dark">
                                Gesamt
                            </td>
                            <td className="py-1 border-y border-pdf-dark"></td>
                            <td className="py-1 border-y border-pdf-dark text-right">{formatter.format(co2Consumption)}</td>
                            <td className="py-1 border-y border-pdf-dark text-right">{formatter.format(co2Emission)}</td>
                            <td className="py-1 px-2 rounded-r-base border border-l-0 border-pdf-dark text-right">
                                {costFormatter.format(co2Cost)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Classification of the Property */}
            <div className="text-sm space-y-2">
                <div className="text-xl font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
                    Einstufung der Liegenschaft gemäß CO2KostAufG (Wohngebäude)
                </div>
                <table className="w-full text-pdf-text border-spacing-0 border-separate mb-2">
                    <tbody>
                        <tr>
                            <td className="py-1">CO2-Emissionen der Liegenschaft</td>
                            <td className="py-1 text-right">{formatter.format(co2Emission)} kg CO2</td>
                            <td className="py-1 pl-4">CO2-Kosten der Liegenschaft</td>
                            <td className="py-1 text-right">{costFormatter.format(co2Cost)} €</td>
                        </tr>
                        <tr>
                            <td className="py-1">Gesamtwohnfläche der Liegenschaft</td>
                            <td className="py-1 text-right">{formatter.format(buildingLivingSpace)} m²</td>
                            <td className="py-1 pl-4">CO2-Emissionsfaktor</td>
                            <td className="py-1 text-right">{factorFormatter.format(co2EmissionFactor)} kg CO2/kWh</td>
                        </tr>
                        <tr className="text-pdf-dark font-bold">
                            <td
                                colSpan={3}
                                className="py-1 px-2 rounded-l-base border border-r-0 border-pdf-dark"
                            >
                                CO²-Emission pro m² Wohnfläche
                            </td>
                            <td className="py-1 px-2 rounded-r-base border border-l-0 border-pdf-dark text-right">
                                {shareFormatter.format(co2EmissionPerSqm)} kg CO2/m²/a
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full text-pdf-text border-spacing-0 border-separate text-sm">
                    <thead className="text-pdf-dark font-bold">
                        <tr>
                            <th
                                colSpan={6}
                                className="text-left bg-pdf-accent rounded-l-base font-bold py-1 px-2"
                            >
                                CO2-Emission pro m² Wohnfläche und Jahr
                            </th>
                            <th className="bg-pdf-accent text-left p-1">Anteil Mieter</th>
                            <th className="bg-pdf-accent text-left rounded-r-base py-1 px-2">
                                Anteil Vermieter
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                bis: "",
                                range: "< 12",
                                co: "kg CO₂/m²/a",
                                mieter: 100,
                                vermieter: 0,
                            },
                            {
                                bis: "12 bis",
                                range: "< 17",
                                co: "kg CO₂/m²/a",
                                mieter: 90,
                                vermieter: 10,
                            },
                            {
                                bis: "17 bis",
                                range: "< 22",
                                co: "kg CO₂/m²/a",
                                mieter: 80,
                                vermieter: 20,
                            },
                            {
                                bis: "22 bis",
                                range: "< 27",
                                co: "kg CO₂/m²/a",
                                mieter: 70,
                                vermieter: 30,
                            },
                            {
                                bis: "27 bis",
                                range: "< 32",
                                co: "kg CO₂/m²/a",
                                mieter: 60,
                                vermieter: 40,
                            },
                            {
                                bis: "32 bis",
                                range: "< 37",
                                co: "kg CO₂/m²/a",
                                mieter: 50,
                                vermieter: 50,
                            },
                            {
                                bis: "37 bis",
                                range: "< 42",
                                co: "kg CO₂/m²/a",
                                mieter: 40,
                                vermieter: 60,
                            },
                            {
                                bis: "42 bis",
                                range: "< 47",
                                co: "kg CO₂/m²/a",
                                mieter: 30,
                                vermieter: 70,
                            },
                            {
                                bis: "47 bis",
                                range: "< 52",
                                co: "kg CO₂/m²/a",
                                mieter: 20,
                                vermieter: 80,
                            },
                            {
                                bis: "",
                                range: ">= 52",
                                co: "kg CO₂/m²/a",
                                mieter: 5,
                                vermieter: 95,
                            },
                        ].map((item, index) => {
                            const matches =
                                item.mieter === tenantSharePercent &&
                                item.vermieter === landlordSharePercent;
                            return (
                                <tr key={index}>
                                    <td
                                        className={`py-1 px-2 ${matches
                                            ? "bg-pdf-accent2 text-white rounded-l-base"
                                            : ""
                                            }`}
                                    >
                                        {item.bis}
                                    </td>
                                    <td
                                        className={`py-1 px-2 ${matches ? "bg-pdf-accent2 text-white" : ""
                                            }`}
                                    >
                                        {item.range}
                                    </td>
                                    <td
                                        className={`py-1 px-2 ${matches ? "bg-pdf-accent2 text-white" : ""
                                            }`}
                                    >
                                        {item.co}
                                    </td>
                                    <td
                                        className={`py-1 px-2 ${matches ? "bg-pdf-accent2 text-white" : ""
                                            }`}
                                    ></td>
                                    <td
                                        className={`py-1 px-2 ${matches ? "bg-pdf-accent2 text-white" : ""
                                            }`}
                                    ></td>
                                    <td
                                        className={`py-1 px-2 ${matches ? "bg-pdf-accent2 text-white" : ""
                                            }`}
                                    ></td>
                                    <td
                                        className={`py-1 px-2 ${matches ? "bg-pdf-accent2 text-white" : ""
                                            }`}
                                    >
                                        {item.mieter} %
                                    </td>
                                    <td
                                        className={`py-1 px-2 ${matches
                                            ? "bg-pdf-accent2 text-white rounded-r-base"
                                            : ""
                                            }`}
                                    >
                                        {item.vermieter} %
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* CO2 Cost Allocation for Your Unit */}
            <div className="text-xl font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
                CO2-Kostenaufteilung für Ihre Nutzeinheit
            </div>
            <div className="text-sm mb-4">
                <table className="w-full text-pdf-text border-spacing-0 border-separate mb-2">
                    <thead>
                        <tr className="font-bold text-pdf-dark">
                            <th className="text-left bg-pdf-accent rounded-l-base px-2 py-1">
                                Aufteilung der CO2-Kosten
                            </th>
                            <th className="text-right bg-pdf-accent px-2 py-1">
                                Anteil Mieter
                            </th>
                            <th className="text-right bg-pdf-accent px-2 py-1">
                                Anteil Vermieter
                            </th>
                            <th className="text-right bg-pdf-accent rounded-r-base px-2 py-1">
                                Summe
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-1">gemäß Einstufung (jeweils)</td>
                            <td className="py-1 text-right">{tenantSharePercent} %</td>
                            <td className="py-1 text-right">{landlordSharePercent} %</td>
                            <td className="py-1 text-right">100 %</td>
                        </tr>
                        <tr>
                            <td className="py-1">für die Liegenschaft</td>
                            <td className="py-1 text-right">{costFormatter.format(co2Cost * tenantSharePercent / 100)} €</td>
                            <td className="py-1 text-right">{costFormatter.format(co2Cost * landlordSharePercent / 100)} €</td>
                            <td className="py-1 text-right">{costFormatter.format(co2Cost)} €</td>
                        </tr>
                        <tr className="font-bold text-pdf-dark">
                            <td className="py-1 border-pdf-dark border border-r-0 rounded-l-base px-2">
                                für Ihre Nutzeinheit (anteilig)
                            </td>
                            <td className="py-1 border-y border-pdf-dark text-right">
                                {costFormatter.format(unitCostDetails.tenant)} €
                            </td>
                            <td className="py-1 border-y border-pdf-dark text-right">
                                {costFormatter.format(unitCostDetails.landlord)} €
                            </td>
                            <td className="py-1 border-pdf-dark border border-l-0 rounded-r-base px-2 text-right">
                                {costFormatter.format(unitCostDetails.total)} €
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-pdf-text mb-6">
                Der Abzug des Vermieteranteils an den CO2-Kosten wurde in der
                Heizkostenabrechnung noch nicht berücksichtigt.
                <br />
                Im Falle einer Vermietung dieser Nutzeinheit ist gemäß CO2KostAufG noch
                die Kostenübernahme durch den Vermieter in Höhe von {costFormatter.format(unitCostDetails.landlord)} € zu leisten.
            </p>

            {/* Further Information */}
            <div className="text-xl font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
                Weitere Informationen und Informationsquellen
            </div>
            <div className="flex gap-10 items-center text-xs">
                <div className="w-40 h-40 bg-transparent">
                    <Image
                        src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https://heidi.systems/3303"
                        alt="QR code"
                        width={160}
                        height={160}
                    />
                </div>
                <div className="text-pdf-text text-sm">
                    Informationen rund um das Thema CO2-Kostenaufteilung finden Sie unter{" "}
                    <a href="www.heidisystems.de/co2" className="text-pdf-link">
                        www.heidisystems.de/co2.
                    </a>
                </div>
            </div>
        </div>
    );
};
