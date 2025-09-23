"use client";

import type {
  DocCostCategoryType,
  ContractType,
  LocalType,
  InvoiceDocumentType,
  OperatingCostDocumentType,
  ContractorType,
  ObjektType,
} from "@/types";
import { formatDateGerman, formatEuro } from "@/utils";
import { differenceInMonths, min, max, differenceInDays } from "date-fns";
import { useMemo } from "react";

export type BetriebskostenabrechnungPreviewProps = {
  mainDoc: OperatingCostDocumentType;
  previewLocal: LocalType;
  totalLivingSpace: number;
  contracts: (ContractType & { contractors: ContractorType[] })[];
  costCategories: DocCostCategoryType[];
  invoices: InvoiceDocumentType[];
  objekt: ObjektType;
};

export default function BetriebskostenabrechnungPreview({
  mainDoc,
  previewLocal,
  totalLivingSpace,
  contracts,
  costCategories,
  invoices,
  objekt,
}: BetriebskostenabrechnungPreviewProps) {
  const { living_space } = previewLocal ?? {};

  const periodStart = useMemo(() => {
    return mainDoc?.start_date ? new Date(mainDoc?.start_date) : null;
  }, [mainDoc?.start_date]);

  const periodEnd = useMemo(() => {
    return mainDoc?.end_date ? new Date(mainDoc?.end_date) : null;
  }, [mainDoc?.end_date]);

  const filteredContracts = useMemo(() => {
    if (!periodEnd) return [];

    return contracts.filter((contract) => {
      if (!contract.rental_start_date || !contract.rental_end_date)
        return false;

      const rentalEndDate = new Date(contract.rental_end_date);

      return rentalEndDate <= periodEnd;
    });
  }, [contracts, periodEnd]);

  const baseContractPayment = useMemo(() => {
    return filteredContracts.reduce((acc, contract) => {
      const rentalStart = new Date(contract.rental_start_date!);
      const rentalEnd = new Date(contract.rental_end_date!);

      if (!rentalStart || !rentalEnd || !periodStart || !periodEnd) return 0;

      const overlapStart = max([rentalStart, periodStart]);
      const overlapEnd = min([rentalEnd, periodEnd]);

      let overlapMonths = differenceInMonths(overlapEnd, overlapStart) + 1;
      if (overlapMonths < 0) overlapMonths = 0;

      const coldRent = Number(contract.cold_rent ?? 0);

      return acc + coldRent * overlapMonths;
    }, 0);
  }, [filteredContracts, periodStart, periodEnd]);

  const totalInvoicesAmount = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
    0
  );

  const localPrice = useMemo(() => {
    return invoices.reduce((sum, row) => {
      const prisePerSquareMeter = Number(row?.total_amount) / totalLivingSpace;
      const pricePerLocalMeters = prisePerSquareMeter * Number(living_space);
      return sum + pricePerLocalMeters;
    }, 0);
  }, [invoices, totalLivingSpace, living_space]);

  const allFilteredContractors = useMemo(() => {
    return filteredContracts.flatMap((contract) => contract.contractors);
  }, [filteredContracts]);

  if (!periodStart || !periodEnd) {
    return null;
  }

  const daysDiff = differenceInDays(periodEnd, periodStart);
  const amountsDiff =
    localPrice - baseContractPayment - Number(previewLocal.house_fee);
  const formattedStartDate = formatDateGerman(mainDoc?.start_date);
  const formattedEndDate = formatDateGerman(mainDoc?.end_date);

  return (
    <div className="grid grid-cols-2 gap-5 mx-auto">
      {/* Page 1 */}
      <div className="p-8 rounded-2xl flex flex-col justify-between bg-white">
        <div>
          {/* Header */}
          <div className="flex justify-between mb-6">
            <div className="flex-1 py-5">
              <p className="text-[8px] mb-1">
                Felix Gerlach UG (haftungsbeschränkt) Greizer Straße 16 07545
              </p>
              <p className="text-[8px] mb-1">Gera</p>
              <p className="text-[8px] mb-1">
                {allFilteredContractors
                  ?.map((c) => `${c.first_name} ${c.last_name}`)
                  .join(", ")}
              </p>
              <p className="text-[8px] mb-1">{objekt.street}</p>
              <p className="text-[8px] mb-1">{objekt.zip}</p>
            </div>
            <div className="flex-1 flex flex-col items-end">
              <div className="border border-black w-52 mb-3">
                <p className="text-[8px] border-b border-black p-2 flex items-end justify-between">
                  Ihr Nebenkostenanteil für den <br /> Nutzungszeitraum:
                  <span>{formatEuro(totalInvoicesAmount)}</span>
                </p>
                <p className="text-[8px] border-b border-black p-2 flex items-end justify-between">
                  Ihre Nebenkostenvorauszahlung:
                  <span>
                    {formatEuro(
                      baseContractPayment + Number(previewLocal.house_fee)
                    )}
                  </span>
                </p>
                <p className="text-[8px] p-2 flex items-center justify-between">
                  Nachzuzahlender <br /> Betrag:
                  <span className="font-bold text-lg">
                    {formatEuro(amountsDiff)}
                  </span>
                </p>
              </div>
              <p className="text-[8px]">
                Erstellungsdatum: {formatDateGerman(mainDoc.created_at)}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-sm font-bold mb-1">Nebenkostenabrechnung</h1>
          <h2 className="text-xs font-bold mb-1">
            für den Abrechnungszeitraum {formattedStartDate} -{" "}
            {formattedEndDate}
          </h2>
          <h3 className="text-xs font-bold mb-4">
            Altenburger Straße 9, VH 20G rechts - Berger/Rehnelt
          </h3>

          {/* Main Content */}
          <div className="flex gap-8">
            <div className="flex-1">
              <p className="text-[8px] mb-4">
                Sehr geehrter{" "}
                {allFilteredContractors
                  ?.map((c) => `${c.first_name} ${c.last_name}`)
                  .join(", ")}
                ,
              </p>
              <p className="text-[8px] leading-relaxed mb-1">
                wir möchten Sie darüber informieren, dass es bundesweit zu einem
                signifikanten Anstieg der Strom- und Gaspreise um über 48%
                gekommen ist. Diese Preissteigerung ist unabhängig von Ihrer
                Kaltmiete und basiert auf Ihrem
              </p>
              <p className="text-[8px] leading-relaxed mb-4">
                individuellen Verbrauch.
              </p>
              <p className="text-[8px] leading-relaxed mb-4">
                Wie Sie der beigefügten Nebenkostenabrechnung entnehmen können,
                decken die von Ihnen geleisteten Vorauszahlungen leider nicht
                die tatsächlich angefallenen Kosten. Daraus ergibt sich für Sie
                ein Zahlungsrückstand von 354,48 Euro. Bitte überweisen Sie den
                fälligen Betrag spätestens bis zum 15.03.2024 an unten genannte
                Kontoverbindung.
              </p>
              <p className="text-[8px] mb-1 mt-4">
                Kontoinhaber: Felix Gerlach UG (haftungsbeschränkt)
              </p>
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
          <h3 className="text-xs font-bold mb-4">
            Allgemeine Angaben zur Wohnung und zu den Verteilungsschlüsseln
          </h3>

          {/* Info Table */}
          <table className="w-full border border-black mb-8">
            <tbody>
              <tr>
                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">
                  Ihr Nutzungszeitraum
                </td>
                <td className="text-[8px] px-1 py-0.5 text-center border-r border-b border-black">
                  {formattedStartDate} - {formattedEndDate}
                </td>
                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">
                  Abrechnungszeitraum
                </td>
                <td className="text-[8px] px-1 py-0.5 text-center border-b border-black">
                  {formattedStartDate} - {formattedEndDate}
                </td>
              </tr>
              <tr>
                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">
                  Ihr Nutzungstage
                </td>
                <td className="text-[8px] px-1 py-0.5 text-center border-r border-b border-black">
                  {daysDiff}
                </td>
                <td className="text-[8px] px-1 py-0.5 border-r border-b border-black">
                  Abrechnungstage
                </td>
                <td className="text-[8px] px-1 py-0.5 text-center border-b border-black">
                  {daysDiff}
                </td>
              </tr>
              <tr>
                <td className="text-[8px] px-1 py-0.5 border-r border-black">
                  Wohnfläche Ihrer Wohnung
                </td>
                <td className="text-[8px] px-1 py-0.5 text-center border-r border-black">
                  {living_space} m²
                </td>
                <td className="text-[8px] px-1 py-0.5 border-r border-black">
                  Gesamtwohnfläche des Hauses
                </td>
                <td className="text-[8px] px-1 py-0.5 text-center">
                  {totalLivingSpace} m²
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-sm font-bold mb-4">Kostenübersicht</h3>

          {/* Costs Table */}
          <table className="w-full border border-black mb-6">
            <thead>
              <tr>
                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-start">
                  Kostenart
                </th>
                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-end">
                  Gesamtkosten
                </th>
                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-center">
                  Zeitraum
                </th>
                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-start">
                  Verteilerschlüssel
                </th>
                <th className="text-[8px] font-bold px-1 py-0.5 border-r border-b border-black text-center">
                  Anteil
                </th>
                <th className="text-[8px] font-bold px-1 py-0.5 border-b border-black text-end">
                  Ihr Anteil
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => {
                const costCategory = costCategories.find(
                  (category) => category.type === row.cost_type
                );

                const prisePerSquareMeter =
                  Number(row?.total_amount) / totalLivingSpace;

                const pricePerLocalMeters =
                  prisePerSquareMeter * Number(living_space);

                return (
                  <tr key={row.id}>
                    <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                      {costCategory?.name || "Unbekannt"}
                    </td>
                    <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                      {formatEuro(Number(row.total_amount))}
                    </td>
                    <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                      {daysDiff}/{daysDiff}
                    </td>
                    <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                      {costCategory?.allocation_key || ""}
                    </td>
                    <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                      {costCategory?.allocation_key === "m2 Wohnfläche"
                        ? `${living_space}/${totalLivingSpace}`
                        : `${daysDiff}/${daysDiff}`}
                    </td>
                    <td className="text-[8px] p-1 border-r border-b border-black text-center last:border-r-0">
                      {formatEuro(pricePerLocalMeters)}
                    </td>
                  </tr>
                );
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
                  <td className="text-[8px] p-1 border-b border-black text-right">
                    {formatEuro(localPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="text-[8px] p-1 border-r border-b border-black">
                    Ihre Nebenkostenvorauszahlung
                  </td>
                  <td className="text-[8px] p-1 border-b border-black text-right">
                    {formatEuro(
                      baseContractPayment + Number(previewLocal.house_fee)
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="text-[8px] font-bold p-1 border-r border-black">
                    Nachzuzahlender Betrag
                  </td>
                  <td className="text-[8px] font-bold p-1 text-right">
                    {formatEuro(amountsDiff)}
                  </td>
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
