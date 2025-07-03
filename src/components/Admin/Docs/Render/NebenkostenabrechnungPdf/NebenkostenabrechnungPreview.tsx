"use client";

import { useBetriebskostenabrechnungStore } from '@/store/useBetriebskostenabrechnungStore';
import { formatEuro } from '@/utils';
import React from 'react';

export default function NebenkostenabrechnungPreview() {
    const { documentGroups, getFormattedDates } = useBetriebskostenabrechnungStore();
    const { start_date, end_date } = getFormattedDates();

    const totalSpreadedAmount = documentGroups.reduce((acc, group) => {
        const groupTotal =
            group.data?.reduce((sum, item) => {
                if (item.for_all_tenants) {
                    return sum + Number(item.total_amount || 0);
                }
                return sum;
            }, 0) || 0;
        return acc + groupTotal;
    }, 0);

    const totalDirectCosts = documentGroups.reduce((acc, group) => {
        const groupTotal =
            group.data?.reduce((sum, item) => {
                if (!item.for_all_tenants) {
                    return sum + Number(item.total_amount || 0);
                }
                return sum;
            }, 0) || 0;
        return acc + groupTotal;
    }, 0);

    const totalAmount = totalSpreadedAmount + totalDirectCosts;

    return (
        <div className="grid grid-cols-2 gap-5 mx-auto">
            {/* Page 1 */}
            <div className="p-8 rounded-2xl flex flex-col justify-between bg-white">
                <div>
                    {/* Header */}
                    <div className="flex justify-between mb-6">
                        <div className="flex-1 py-5">
                            <p className="text-[8px] mb-1">Felix Gerlach UG (haftungsbeschränkt) Greizer Straße 16 07545</p>
                            <p className="text-[8px] mb-1">Gera</p>
                            <p className="text-[8px] mb-1">Jakob Berger, Virginia Rehnelt</p>
                            <p className="text-[8px] mb-1">Altenburger Straße 9</p>
                            <p className="text-[8px] mb-1">07546 Gera</p>
                        </div>
                        <div className="flex-1 flex flex-col items-end">
                            <div className="border border-black w-52 mb-3">
                                <p className="text-[8px] border-b border-black p-2 flex items-end justify-between">
                                    Ihr Nebenkostenanteil für den <br /> Nutzungszeitraum:
                                    <span>1.734,48 €</span>
                                </p>
                                <p className="text-[8px] border-b border-black p-2 flex items-end justify-between">
                                    Ihre Nebenkostenvorauszahlung:
                                    <span>1.380,00 €</span>
                                </p>
                                <p className="text-[8px] p-2 flex items-center justify-between">
                                    Nachzuzahlender <br /> Betrag:
                                    <span className="font-bold text-lg">354,48 €</span>
                                </p>
                            </div>
                            <p className="text-[8px]">Erstellungsdatum: 13.02.2024</p>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-sm font-bold mb-1">Nebenkostenabrechnung</h1>
                    <h2 className="text-xs font-bold mb-1">für den Abrechnungszeitraum {start_date} - {end_date}</h2>
                    <h3 className="text-xs font-bold mb-4">Altenburger Straße 9, VH 20G rechts - Berger/Rehnelt</h3>

                    {/* Main Content */}
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <p className="text-[8px] mb-4">Sehr geehrter Herr Jakob Berger, Frau Virginia Rehnelt,</p>
                            <p className="text-[8px] leading-relaxed mb-1">
                                wir möchten Sie darüber informieren, dass es bundesweit zu einem signifikanten Anstieg der Strom- und Gaspreise
                                um über 48% gekommen ist. Diese Preissteigerung ist unabhängig von Ihrer Kaltmiete und basiert auf Ihrem
                            </p>
                            <p className="text-[8px] leading-relaxed mb-4">individuellen Verbrauch.</p>
                            <p className="text-[8px] leading-relaxed mb-4">
                                Wie Sie der beigefügten Nebenkostenabrechnung entnehmen können, decken die von Ihnen geleisteten
                                Vorauszahlungen leider nicht die tatsächlich angefallenen Kosten. Daraus ergibt sich für Sie ein Zahlungsrückstand
                                von 354,48 Euro. Bitte überweisen Sie den fälligen Betrag spätestens bis zum 15.03.2024 an unten genannte
                                Kontoverbindung.
                            </p>
                            <p className="text-[8px] mb-1 mt-4">Kontoinhaber: Felix Gerlach UG (haftungsbeschränkt)</p>
                            <p className="text-[8px] mb-1">IBAN: DE9310011230405222379</p>
                            <p className="text-[8px] mb-1">BIC: QNTODEBEXXX</p>
                            <p className="text-[8px] mb-1">Bank: Qonto Bank</p>

                            <div className="mt-8">
                                <p className="text-[8px] mb-3">Mit freundlichen Grüßen</p>
                                <div className="border-b border-black w-40 h-12"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Number */}
                <div className="flex items-center justify-end mb-0 mt-auto">
                    <p className="text-[8px]">Seite 1 von 2</p>
                </div>
            </div>

            {/* Page 2 */}
            <div className="p-8 rounded-2xl  flex flex-col justify-between bg-white ">
                <div>
                    <h3 className="text-xs font-bold mb-4">Allgemeine Angaben zur Wohnung und zu den Verteilungsschlüsseln</h3>

                    {/* Info Table */}
                    <table className="w-full border border-black mb-8">
                        <tbody>
                            <tr>
                                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">Ihr Nutzungszeitraum</td>
                                <td className="text-[8px] px-1 py-0.5 text-center border-r border-b border-black">{start_date} - {end_date}</td>
                                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">Abrechnungszeitraum</td>
                                <td className="text-[8px] px-1 py-0.5 text-center border-b border-black">{start_date} - {end_date}</td>
                            </tr>
                            <tr>
                                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">Ihr Nutzungstage</td>
                                <td className="text-[8px] px-1 py-0.5 text-center border-r border-b border-black">365</td>
                                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">Abrechnungstage</td>
                                <td className="text-[8px] px-1 py-0.5 text-center border-b border-black">365</td>
                            </tr>
                            <tr>
                                <td className="text-[8px] px-1 py-0.5 border-r border-black">Wohnfläche Ihrer Wohnung</td>
                                <td className="text-[8px] px-1 py-0.5 text-center border-r border-black">36,30 m²</td>
                                <td className="text-[8px] px-1 py-0.5 border-r border-black">Gesamtwohnfläche des Hauses</td>
                                <td className="text-[8px] px-1 py-0.5 text-center">813,85 m²</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3 className="text-sm font-bold mb-4">Kostenübersicht</h3>

                    {/* Costs Table */}
                    <table className="w-full border border-black mb-6">
                        <thead>
                            <tr>
                                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-start">Kostenart</th>
                                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-end">Gesamtkosten</th>
                                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-center">Zeitraum</th>
                                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-start">Verteilerschlüssel</th>
                                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-center">Anteil</th>
                                <th className="text-[8px] font-bold px-1 py-0.5 border-b border-black text-end">Ihr Anteil</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentGroups.map((row) => {
                                const totalSpreadedAmount = row.data?.reduce((sum, item) => {
                                    if (item.for_all_tenants) {
                                        return sum + Number(item.total_amount || 0);
                                    }
                                    return sum;
                                }, 0) || 0;

                                const totalDirectCosts = row.data?.reduce((sum, item) => {
                                    if (!item.for_all_tenants) {
                                        return sum + Number(item.total_amount || 0);
                                    }
                                    return sum;
                                }, 0) || 0;

                                const totalAmount = totalSpreadedAmount + totalDirectCosts;

                                return (
                                    <tr key={row.id}>
                                        <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                                            {row.name}
                                        </td>
                                        <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                                            {formatEuro(totalAmount)}
                                        </td>
                                        <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                                            365/365
                                        </td>
                                        <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                                            {row.allocation_key}
                                        </td>
                                        <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                                            365/365
                                        </td>
                                        <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                                            365/365
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* Summary Table */}
                    <div className="flex justify-end">
                        <table className="border border-black w-80">
                            <tbody>
                                <tr>
                                    <td className="text-[8px] p-1 border-r border-b border-black">
                                        Ihr Nebenkostenanteil für den Nutzungszeitraum
                                    </td>
                                    <td className="text-[8px] p-1 border-b border-black text-right">{formatEuro(totalAmount)}</td>
                                </tr>
                                <tr>
                                    <td className="text-[8px] p-1 border-r border-b border-black">
                                        Ihre Nebenkostenvorauszahlung
                                    </td>
                                    <td className="text-[8px] p-1 border-b border-black text-right">1.380,00 €</td>
                                </tr>
                                <tr>
                                    <td className="text-[8px] font-bold p-1 border-r border-black">
                                        Nachzuzahlender Betrag
                                    </td>
                                    <td className="text-[8px] font-bold p-1 text-right">354,48 €</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Page Number */}
                <div className="flex items-center justify-end mb-0 mt-auto">
                    <p className="text-[8px]">Seite 2 von 2</p>
                </div>
            </div>
        </div>
    );
}