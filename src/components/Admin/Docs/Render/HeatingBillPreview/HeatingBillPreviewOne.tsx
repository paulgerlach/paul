import { admin_logo } from "@/static/icons";
import { Checkbox } from "@radix-ui/react-checkbox";
import Image from "next/image";
import { type HeatingBillPreviewData } from "./HeatingBillPreview";
import { ContractorType } from "@/types";

type BillDataType = {
  billNumber: string;
  customerName: string;
  customerAddress: string;
  city: string;
  createdBy: string;
  createdByAddress: string;
  createdByCity: string;
  createdDate: string;
  billingPeriod: {
    heating: string;
    usage: string;
  };
  propertyAccount: string;
  propertyCity: string;
  propertyNumber: string;
  heidiCustomerNumber: string;
  userNumber: string;
  totalAmount: string;
  userId: string;
  securityCode: string;
  portalLink: string;
  properties: string[];
};

const mockData: BillDataType = {
  billNumber: "355703/0010",
  customerName: "Andreas Preissler Eigennutzer",
  customerAddress: "Lindenstraße 49",
  city: "12589 Berlin",
  createdBy: "Braun & Hubertus GmbH",
  createdByAddress: "Keithstr. 2-4",
  createdByCity: "10787 Berlin",
  createdDate: "14.11.2024",
  billingPeriod: {
    heating: "01.01.2023 - 31.12.2023",
    usage: "01.01.2023 - 31.12.2023",
  },
  propertyAccount: "Rungestr. 21 u.a.",
  propertyCity: "10179 Berlin",
  propertyNumber: "355703",
  heidiCustomerNumber: "0010",
  userNumber: "W647/4647/112",
  totalAmount: "1.429,55 €",
  userId: "1901913711",
  securityCode: "QNQH27LF1j",
  portalLink: "heidi.systems/3303",
  properties: [
    "10179 Berlin, Rungestr. 21",
    "10179 Berlin, Rungestr. 21A",
    "10179 Berlin, Rungestr. 21B",
    "10179 Berlin, Rungestr. 21C",
    "10179 Berlin, Rungestr. 21D",
    "10179 Berlin, Rungestr. 21E",
    "10179 Berlin, Rungestr. 21F",
  ],
};

export default function HeatingBillPreviewOne({
  previewData,
  contractors,
}: {
  previewData: HeatingBillPreviewData;
  contractors: ContractorType[];
}) {
  return (
    <div className="mx-auto max-w-[1400px] space-y-[70px] font-sans text-sm">
      {/* Green Header Box */}
      <div className="bg-pdf-accent rounded-base p-6 space-y-6 text-pdf-dark">
        <div className="flex justify-between items-start">
          <div className="text-xs text-pdf-text">1/6 {mockData.billNumber}</div>
          <Image
            width={130}
            height={48}
            src={admin_logo}
            alt="admin preview heidi"
          />
        </div>

        <div className="grid grid-cols-2 gap-20 items-end">
          <div className="space-y-8">
            <p className="border-b pb-2 font-bold text-base">
              Heidi Systems GmbH · Rungestr. 21 · 10179 Berlin
            </p>
            <div>
              <p className="text-2xl font-bold">
                {previewData.contractorsNames}
              </p>
              <p className="text-2xl font-bold">
                {previewData.objektInfo.street}
              </p>
              <p className="text-2xl font-bold">{previewData.objektInfo.zip}</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Ihre Heidi Systems<sup className="text-xs">®</sup> Abrechnung für
              <br />
              Heizung, Warmwasser, Kaltwasser
            </h2>
            <p className="mt-2 text-base font-bold">
              Zusammenstellung Ihrer Kosten
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 text-xs mb-8">
        <div className="space-y-3">
          <div className="grid grid-cols-[auto_1fr] gap-10">
            <p>Erstellt im Auftrag von</p>
            <p>
              {previewData.userInfo.first_name} {previewData.userInfo.last_name}
              <br />
              Immobilienmanagement
              <br />
              {previewData.objektInfo.street}
              <br />
              {previewData.objektInfo.zip}
            </p>
          </div>
          <div className="space-y-1 font-bold text-pdf-dark">
            <div className="grid grid-cols-[auto_1fr] gap-10">
              <p>Abrechnungszeitraum</p>
              <p>
                {previewData.mainDocDates.start_date}{" "}
                {previewData.mainDocDates.end_date}
              </p>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-10">
              <p>Ihr Nutzungszeitraum</p>
              <p>
                {previewData.mainDocDates.start_date}{" "}
                {previewData.mainDocDates.end_date}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-10 text-pdf-text">
            <p className="col-span-2">Erstellt am</p>
            <p>{previewData.mainDocDates.created_at}</p>
          </div>
          <div className="grid grid-cols-3 gap-10 font-bold text-pdf-dark">
            <p className="col-span-2">Liegenschaft</p>
            <p>
              {previewData.contractorsNames}
              <br />
              {previewData.objektInfo.street}
              <br />
              {previewData.objektInfo.zip}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-10 font-bold text-pdf-dark">
            <p className="col-span-2">Liegenschaftsnummer</p>
            <p>{mockData.propertyNumber}</p>
          </div>
          <div className="grid grid-cols-3 gap-10 text-pdf-text">
            <p className="col-span-2">Heidi Nutzernummer</p>
            <p>{mockData.heidiCustomerNumber}</p>
          </div>
          <div className="grid grid-cols-3 gap-10 text-pdf-text">
            <p className="col-span-2">Ihre Nutzernummer</p>
            <p>{mockData.userNumber}</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-pdf-text">
        <p>Sehr geehrte Damen und Herren,</p>
        <p>
          wir haben die Kosten, die im vergangenen Abrechnungszeitraum
          angefallen sind, abgerechnet. Unsere Abrechnung ist auf den folgenden
          <br />
          Seiten dieses Schreibens detailliert beschrieben.
        </p>
      </div>
      <div className="bg-pdf-dark rounded-base px-4 py-6 text-white">
        <p className="text-sm text-right font-medium">Betrag</p>
        <div className="bg-white h-px w-full my-4" />
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Gesamtbetrag</p>
          <div className="text-right">
            <p className="text-2xl font-bold">{mockData.totalAmount}</p>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <p className="font-bold text-pdf-dark">
          Beachten Sie bitte folgende Hinweise:
        </p>
        <div className="flex items-start justify-start gap-6">
          <span className="size-6 w-6 h-6 rounded-md bg-[#F3F8F5]" />
          <p className="text-pdf-text">
            Bitte rechnen Sie Nachzahlungen oder Guthaben ausschließlich mit
            Ihrem Vermieter/Verwalter ab. Leisten Sie keine
            <br />
            Zahlungen an Heidi Systems GmbH.
          </p>
        </div>
        <div className="flex items-start justify-start gap-6">
          <span className="size-6 w-6 h-6 rounded-md bg-[#F3F8F5]" />
          <p className="text-pdf-text">
            Im Zuge der Energiekrise sind die Energiepreise gegenüber dem
            Vorjahr extrem gestiegen. Dies kann dazu führen, dass Ihre
            <br />
            Energiekosten in diesem Abrechnungszeitraum höher liegen als bisher
            selbst bei reduziertem Verbrauch.
            <br />
            Unter {mockData.portalLink} können Sie prüfen, wie sehr sich die
            Energiepreise in Ihrer Liegenschaft und für Sie persönlich
            <br />
            verändert haben.
          </p>
        </div>
        <div className="flex items-start justify-start gap-6">
          <span className="size-6 w-6 h-6 rounded-md bg-[#F3F8F5]" />
          <p className="text-pdf-text">
            Allgemeine Hinweise und Informationen zur Abrechnung finden Sie
            unter: {mockData.portalLink}
          </p>
        </div>
      </div>
      <div className="bg-pdf-accent p-5 rounded-base">
        <div className="grid grid-cols-6 items-start gap-2">
          <div className="col-span-4 text-sm space-y-5">
            <p className="font-bold text-pdf-dark">
              Ihre persönlichen Zugangsdaten für das Heidi Nutzerportal.
            </p>
            <p className="text-pdf-text">
              Mit Heidi Systems bekommen Sie Zugriff auf die unterjährigen
              Verbrauchsinformationen
              <br />- eine übersichtliche, monatliche Darstellung Ihrer
              Verbräuche - <br />
              und können so Einsparmöglichkeiten auch zwischen den Abrechnungen
              erkennen.
            </p>
            <div>
              <div className="grid grid-cols-[110px_1fr] gap-10 font-bold text-pdf-dark">
                <p>Nutzer-ID:</p>
                <p>{mockData.userId}</p>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-10 font-bold text-pdf-dark">
                <p>Sicherheitscode:</p>
                <p>{mockData.securityCode}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col col-span-2 items-end space-y-1">
            <div className="w-40 h-40 bg-transparent">
              <Image
                src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https://heidi.systems/3303"
                alt="QR code"
                width={160}
                height={160}
              />
            </div>
            <p className="text-pdf-dark font-bold">
              Oder registrieren unter {mockData.portalLink}.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <p className="font-bold text-pdf-dark">
          Folgende Objekte sind in dieser Abrechnung berücksichtigt:
        </p>
        <div className="grid grid-cols-3 text-pdf-text gap-x-4 gap-y-1">
          {contractors.map((contractor) => (
            <p key={contractor.id}>
              {contractor.first_name}
              {contractor.last_name}
              <br />
              {previewData.objektInfo.street}
              <br />
              {previewData.objektInfo.zip}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
