import Image from "next/image";
import { admin_logo } from "@/static/icons";

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
  portalLink: "heidi.systems/34053",
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

export default function HeatingBillPreviewOne() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-sans text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="text-xs">1/6 {mockData.billNumber}</div>
        <div className="flex items-center gap-2">
          <Image width={100} height={32} src={admin_logo} alt="Heidi Logo" />
        </div>
      </div>

      {/* Customer and Company Info */}
      <div className="mb-4 border-b border-black pb-2">
        <div className="text-xs">
          Heidi Systems GmbH, Runge Straße 21, 10974 Berlin
        </div>
      </div>
      <div className="grid grid-cols-2 gap-20">
        <div>
          <div className="font-bold text-md mb-1">{mockData.customerName}</div>
          <div className="text-md">{mockData.customerAddress}</div>
          <div className="text-md">{mockData.city}</div>
        </div>

        <div className="text-left">
          <div className="font-bold text-xl leading-tight mb-4">
            Ihre Abrechnung für Heizung,
            <br />
            Warmwasser, Kaltwasser von Heidi
          </div>
          <div className="font-bold text-lg">Zusammenstellung Ihrer Kosten</div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="grid grid-cols-2 gap-20 mt-10">
        <div className="text-sm">
          <div className="mb-4">
            <div className="font-bold">Erstellt im Auftrag von</div>
            <div>{mockData.createdBy}</div>
            <div>Immobilienmanagement</div>
            <div>{mockData.createdByAddress}</div>
            <div>{mockData.createdByCity}</div>
          </div>

          <div className="grid grid-cols-2">
            <div className="font-bold">Abrechnungszeitraum</div>
            <div>{mockData.billingPeriod.heating}</div>
            <div className="font-bold">Ihr Nutzungszeitraum</div>
            <div>{mockData.billingPeriod.usage}</div>
          </div>
        </div>

        <div className="text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold">Erstellt am</div>
              <div>{mockData.createdDate}</div>
            </div>
            <div>
              <div className="font-bold">Liegenschaft</div>
              <div>{mockData.propertyAccount}</div>
              <div>{mockData.propertyCity}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="font-bold">Liegenschaftsnummer</div>
              <div>{mockData.propertyNumber}</div>
            </div>
            <div>
              <div className="font-bold">Heidi Nutzernummer</div>
              <div>{mockData.heidiCustomerNumber}</div>
              <div className="font-bold">Ihre Nutzernummer</div>
              <div>{mockData.userNumber}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="mt-10 text-sm">
        <div className="font-bold mb-2">Sehr geehrte Damen und Herren,</div>
        <div className="leading-relaxed">
          wir haben die Kosten, die im vergangenen Abrechnungszeitraum
          angefallen sind, abgerechnet. Unsere Abrechnung ist auf den
          <br />
          folgenden Seiten dieses Schreibens detailliert beschrieben.
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-gray-200 mt-4">
        <div className="flex justify-end items-center p-2 border-b border-gray-400">
          <span className="font-bold mr-4">Betrag</span>
        </div>
        <div className="bg-green text-white p-2 flex justify-between items-center">
          <span className="font-bold">Gesamtbetrag</span>
          <span className="font-bold text-lg">{mockData.totalAmount}</span>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-6 text-sm">
        <div className="font-bold mb-2">
          Beachten Sie bitte folgende Hinweise:
        </div>
        <div className="space-y-2">
          <div className="flex">
            <span className="mr-2">·</span>
            <span>
              Bitte rechnen Sie Nachzahlungen oder Guthaben{" "}
              <span className="font-bold">ausschließlich</span> mit Ihrem
              Vermieter/Verwalter ab. Leisten Sie keine Zahlungen an
            </span>
          </div>
          <div className="flex">
            <span className="mr-2">·</span>
            <span>
              Im Zuge der Energiekrise sind die Energiepreise gegenüber dem
              Vorjahr extrem gestiegen. Dies kann dazu führen, dass Ihre
              Energiekosten in diesem Abrechnungszeitraum höher liegen als
              bisher - selbst bei reduziertem Verbrauch.
              <br />
              Unter www.brudirekt.de/3600 können Sie prüfen, wie sehr sich die
              Energiepreise in Ihrer Liegenschaft und für Sie persönlich
              verändert haben.
            </span>
          </div>
          <div className="flex">
            <span className="mr-2">·</span>
            <span>
              Allgemeine Hinweise und Informationen zur Abrechnung finden Sie
            </span>
          </div>
        </div>
      </div>

      {/* QR Code and Access Info */}
      <div className="bg-gray-100 p-4 mt-6 flex justify-between items-start">
        <div className="flex-1 text-sm">
          <div className="mb-4">
            <span className="font-bold">
              Ihre persönlichen Zugangsdaten für - Das Nutzerportal.
            </span>
          </div>
          <div className="space-y-1">
            <div>
              Mit BRUdirekt bekommen Sie Zugriff auf die unterjährigen
              Verbrauchsinformationen
            </div>
            <div>
              - eine übersichtliche, monatliche Darstellung Ihrer Verbräuche -
            </div>
            <div>
              und können so Einsparmöglichkeiten auch zwischen den Abrechnungen
              erkennen.
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold">Nutzer-ID:</div>
              <div className="font-mono">{mockData.userId}</div>
            </div>
            <div>
              <div className="font-bold">Sicherheitscode:</div>
              <div className="font-mono">{mockData.securityCode}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center ml-4">
          <div className="text-xs mt-2 text-blue-600">
            Oder registrieren unter{" "}
            <a href="#" className="underline">
              {mockData.portalLink}
            </a>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="mt-6 text-sm">
        <div className="font-bold mb-2">
          Folgende Objekte sind in dieser Abrechnung berücksichtigt:
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
          {mockData.properties.map((property, index: number) => (
            <div key={index}>{property}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
