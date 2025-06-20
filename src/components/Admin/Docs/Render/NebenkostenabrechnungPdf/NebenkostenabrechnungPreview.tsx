import React from 'react';

const costData = [
    ["Grundsteuer", "708,66 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "31,61 €"],
    ["Kaltwasser", "985,55 €", "365 / 365", "Verbrauch (Menast)", "", "43,99 €"],
    ["Entwässerung", "499,99 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "22,30 €"],
    ["Heizkosten", "7.839,87 €", "", "Verbrauch (Menast)", "44/100", "110,11 €"],
    ["Heizungs- und Warmwasserbereitstellungskosten", "229,21 €", "365 / 365", "Verbrauch (Menast)", "44/100", "10,22 €"],
    ["Straßenreinigung und Müll", "541,64 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "24,16 €"],
    ["Gebäudereinigung", "2.620,73 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "116,89 €"],
    ["Beleuchtung", "589,19 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "26,28 €"],
    ["Schornsteinfeger", "91,58 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "4,08 €"],
    ["Sach- & Haftpflichtversicherung", "2.805,55 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "125,14 €"],
    ["Hausmeister", "3.132,00 €", "365 / 365", "m² Wohnfläche", "36,30 / 813,85", "139,70 €"],
];

export default function NebenkostenabrechnungPreview() {
    return (
        <div className="grid grid-cols-2 gap-5 mx-auto">
            {/* Page 1 */}
            <div className="p-12 rounded-2xl bg-white">
                {/* Header */}
                <div className="flex justify-between mb-6">
                    <div className="flex-1 py-5">
                        <p className="text-[10px] mb-1">Felix Gerlach UG (haftungsbeschränkt) Greizer Straße 16 07545</p>
                        <p className="text-[10px] mb-1">Gera</p>
                        <p className="text-[10px] mb-1">Jakob Berger, Virginia Rehnelt</p>
                        <p className="text-[10px] mb-1">Altenburger Straße 9</p>
                        <p className="text-[10px] mb-1">07546 Gera</p>
                    </div>
                    <div className="flex-1 flex flex-col items-end">
                        <div className="border border-black w-52 mb-3">
                            <p className="text-[10px] border-b border-black p-2">
                                Ihr Nebenkostenanteil für den Nutzungszeitraum: 1.734,48 €
                            </p>
                            <p className="text-[10px] border-b border-black p-2">
                                Ihre Nebenkostenvorauszahlung: 1.380,00 €
                            </p>
                            <p className="text-[10px] font-bold p-2">
                                Nachzuzahlender Betrag: 354,48 €
                            </p>
                        </div>
                        <p className="text-[10px]">Erstellungsdatum: 13.02.2024</p>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-lg font-bold mb-1">Nebenkostenabrechnung</h1>
                <h2 className="text-sm font-bold mb-1">für den Abrechnungszeitraum 01.01.2023 - 31.12.2023</h2>
                <h3 className="text-sm font-bold mb-4">Altenburger Straße 9, VH 20G rechts - Berger/Rehnelt</h3>

                {/* Main Content */}
                <div className="flex gap-8">
                    <div className="flex-1">
                        <p className="text-[10px] mb-4">Sehr geehrter Herr Jakob Berger, Frau Virginia Rehnelt,</p>
                        <p className="text-[10px] leading-relaxed mb-1">
                            wir möchten Sie darüber informieren, dass es bundesweit zu einem signifikanten Anstieg der Strom- und Gaspreise
                            um über 48% gekommen ist. Diese Preissteigerung ist unabhängig von Ihrer Kaltmiete und basiert auf Ihrem
                        </p>
                        <p className="text-[10px] leading-relaxed mb-4">individuellen Verbrauch.</p>
                        <p className="text-[10px] leading-relaxed mb-4">
                            Wie Sie der beigefügten Nebenkostenabrechnung entnehmen können, decken die von Ihnen geleisteten
                            Vorauszahlungen leider nicht die tatsächlich angefallenen Kosten. Daraus ergibt sich für Sie ein Zahlungsrückstand
                            von 354,48 Euro. Bitte überweisen Sie den fälligen Betrag spätestens bis zum 15.03.2024 an unten genannte
                            Kontoverbindung.
                        </p>
                        <p className="text-[10px] mb-1 mt-4">Kontoinhaber: Felix Gerlach UG (haftungsbeschränkt)</p>
                        <p className="text-[10px] mb-1">IBAN: DE9310011230405222379</p>
                        <p className="text-[10px] mb-1">BIC: QNTODEBEXXX</p>
                        <p className="text-[10px] mb-1">Bank: Qonto Bank</p>

                        <div className="mt-8">
                            <p className="text-[10px] mb-3">Mit freundlichen Grüßen</p>
                            <div className="border-b border-black w-40 h-12"></div>
                        </div>
                    </div>
                </div>

                {/* Page Number */}
                <div className="flex items-center justify-end mb-0 mt-auto">
                    <p className="text-[10px]">Seite 1 von 2</p>
                </div>
            </div>

            {/* Page 2 */}
            <div className="p-12 rounded-2xl  bg-white">
                <h3 className="text-sm font-bold mb-4">Allgemeine Angaben zur Wohnung und zu den Verteilungsschlüsseln</h3>

                {/* Info Table */}
                <table className="w-full border border-black mb-8">
                    <tbody>
                        <tr>
                            <td className="text-[10px] p-2 border-r border-b border-black">Ihr Nutzungszeitraum</td>
                            <td className="text-[10px] p-2 border-r border-b border-black">01.01.2023 - 31.12.2023</td>
                            <td className="text-[10px] p-2 border-r border-b border-black">Abrechnungszeitraum</td>
                            <td className="text-[10px] p-2 border-b border-black">01.01.2023 - 31.12.2023</td>
                        </tr>
                        <tr>
                            <td className="text-[10px] p-2 border-r border-b border-black">Ihr Nutzungstage</td>
                            <td className="text-[10px] p-2 border-r border-b border-black">365</td>
                            <td className="text-[10px] p-2 border-r border-b border-black">Abrechnungstage</td>
                            <td className="text-[10px] p-2 border-b border-black">365</td>
                        </tr>
                        <tr>
                            <td className="text-[10px] p-2 border-r border-black">Wohnfläche Ihrer Wohnung</td>
                            <td className="text-[10px] p-2 border-r border-black">36,30 m²</td>
                            <td className="text-[10px] p-2 border-r border-black">Gesamtwohnfläche des Hauses</td>
                            <td className="text-[10px] p-2">813,85 m²</td>
                        </tr>
                    </tbody>
                </table>

                <h3 className="text-sm font-bold mb-4">Kostenübersicht</h3>

                {/* Costs Table */}
                <table className="w-full border border-black mb-6">
                    <thead>
                        <tr>
                            <th className="text-[10px] font-bold p-2 border-r border-b border-black text-center">Kostenart</th>
                            <th className="text-[10px] font-bold p-2 border-r border-b border-black text-center">Gesamtkosten</th>
                            <th className="text-[10px] font-bold p-2 border-r border-b border-black text-center">Zeitraum</th>
                            <th className="text-[10px] font-bold p-2 border-r border-b border-black text-center">Verteilerschlüssel</th>
                            <th className="text-[10px] font-bold p-2 border-r border-b border-black text-center">Anteil</th>
                            <th className="text-[10px] font-bold p-2 border-b border-black text-center">Ihr Anteil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costData.map((row, idx) => (
                            <tr key={idx}>
                                {row.map((cell, i) => (
                                    <td key={i} className="text-[10px] p-2 border-r border-b border-black text-center last:border-r-0">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Summary Table */}
                <div className="flex justify-end">
                    <table className="border border-black w-80">
                        <tbody>
                            <tr>
                                <td className="text-[10px] p-2 border-r border-b border-black">
                                    Ihr Nebenkostenanteil für den Nutzungszeitraum
                                </td>
                                <td className="text-[10px] p-2 border-b border-black text-right">1.734,48 €</td>
                            </tr>
                            <tr>
                                <td className="text-[10px] p-2 border-r border-b border-black">
                                    Ihre Nebenkostenvorauszahlung
                                </td>
                                <td className="text-[10px] p-2 border-b border-black text-right">1.380,00 €</td>
                            </tr>
                            <tr>
                                <td className="text-[10px] font-bold p-2 border-r border-black">
                                    Nachzuzahlender Betrag
                                </td>
                                <td className="text-[10px] font-bold p-2 text-right">354,48 €</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Page Number */}
                <div className="absolute bottom-5 right-12">
                    <p className="text-[10px]">Seite 2 von 2</p>
                </div>
            </div>
        </div>
    );
}