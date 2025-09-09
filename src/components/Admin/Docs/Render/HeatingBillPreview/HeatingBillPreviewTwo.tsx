import { admin_logo } from "@/static/icons";
import Image from "next/image";
import { type HeatingBillPreviewData } from "./HeatingBillPreview";
import { formatDateGerman } from "@/utils";

const HeatingBillPreviewTwo = ({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) => {
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
                  <th className="text-left uppercase font-semiold bg-pdf-accent2 rounded-l-base text-white py-1 px-2">
                    POSITION
                  </th>
                  <th className="uppercase font-semiold bg-pdf-accent2 text-white py-1 px-2">
                    DATUM
                  </th>
                  <th className="text-right uppercase font-semiold bg-pdf-accent2 text-white py-1 px-2">
                    kWh
                  </th>
                  <th className="text-right uppercase font-semiold bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
                    BETRAG
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2">Preisbremse Energie</td>
                  <td className="py-1 px-2"></td>
                  <td className="py-1 px-2 text-right"></td>
                  <td className="py-1 px-2 text-right">-21.035,94 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">
                    Rechnung
                    <br />
                    260002673166
                  </td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">761.123</td>
                  <td className="py-1 px-2 text-right">124.242,47 €</td>
                </tr>
                <tr className="font-bold">
                  <td className="text-left bg-pdf-accent rounded-l-base text-pdf-dark py-1 px-2">
                    Summe Verbrauch
                  </td>
                  <td className="bg-pdf-accent text-pdf-dark py-1 px-2"></td>
                  <td className="text-right bg-pdf-accent text-pdf-dark py-1 px-2">
                    761.123
                  </td>
                  <td className="text-right bg-pdf-accent rounded-r-base text-pdf-dark py-1 px-2">
                    103.206,53 €
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
                  <th className="text-left uppercase font-semiold bg-pdf-accent2 rounded-l-base text-white py-1 px-2">
                    POSITION
                  </th>
                  <th className="uppercase font-semiold bg-pdf-accent2 text-white py-1 px-2">
                    DATUM
                  </th>
                  <th className="text-right uppercase font-semiold bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
                    BETRAG
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2">Übertrag</td>
                  <td></td>
                  <td className="py-1 px-2 text-right">103.206,53 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Verbrauchsabrechnung</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">7.155,11 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Betriebsstrom</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">4.128,26 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Wartungskosten</td>
                  <td></td>
                  <td className="py-1 px-2 text-right">1.008,17 €</td>
                </tr>
                <tr className="font-bold">
                  <td
                    className="text-left bg-pdf-accent rounded-l-base text-pdf-dark py-1 px-2"
                    colSpan={2}
                  >
                    Summe Energie- und Heizungsbetriebskosten
                  </td>
                  <td className="text-right bg-pdf-accent rounded-r-base text-pdf-dark py-1 px-2">
                    115.498,07 €
                  </td>
                </tr>
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
        <div className="grid grid-cols-2 gap-8">
          <div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left uppercase font-semiold bg-pdf-accent2 rounded-base text-white py-1 px-2">
                    VERTEILUNG NACH
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2">Heizung</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Warmwasser/Kaltwasser</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Warmwasser/Kaltwasser</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Warmwasser/Kaltwasser</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Nutzeinheit</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Warmwasser</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left uppercase font-semiold bg-pdf-accent2 rounded-l-base text-white py-1 px-2">
                    POSITION
                  </th>
                  <th className="uppercase font-semiold bg-pdf-accent2 text-white py-1 px-2">
                    DATUM
                  </th>
                  <th className="text-right uppercase font-semiold bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
                    BETRAG
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2">Gerätemiete Heizung/Warmwasser</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">6.210,80 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Kaltwasser</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">17.036,69 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Abwasser</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">20.030,62 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Gerätemiete Kaltwasser</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">2.274,90 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Abrechnung Kaltwasser</td>
                  <td></td>
                  <td className="py-1 px-2 text-right">2.126,74 €</td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Gerätemiete Heizung/Warmwasser</td>
                  <td className="py-1 px-2">
                    {formatDateGerman(previewData.mainDocDates.created_at)}
                  </td>
                  <td className="py-1 px-2 text-right">2.307,77 €</td>
                </tr>
                <tr className="font-bold">
                  <td
                    className="text-left bg-pdf-accent rounded-l-base text-pdf-dark py-1 px-2"
                    colSpan={2}
                  >
                    Summe Kosten zur gesonderten Verteilung
                  </td>
                  <td className="text-right bg-pdf-accent rounded-r-base text-pdf-dark py-1 px-2">
                    49.987,52 €
                  </td>
                </tr>
                <tr className="font-bold">
                  <td
                    className="text-left bg-pdf-accent2 rounded-l-base text-white py-1 px-2"
                    colSpan={2}
                  >
                    Summe der zu verteilenden Kosten
                  </td>
                  <td className="text-right bg-pdf-accent2 rounded-r-base text-white py-1 px-2">
                    165.485,59 €
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-pdf-accent2 text-white rounded-base p-6">
        <h2 className="text-xl font-bold border-b border-white pb-2 mb-4">
          Aufteilung der Kosten
        </h2>
        <div className="">
          <div className="font-bold">
            Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col items-center">
              <span>2,5 kWh/m³/K x 3.148,25 m³ x (60-10°C)</span>
              <div className="text-center w-full font-bold border-t border-white mt-2 pt-2">
                1,15
              </div>
            </div>
            <span>= 342.201,09 kWh Nah-/Fernwärme</span>
            <span>= 44,96 % d. Gesamtverbr.</span>
          </div>
        </div>
      </div>

      {/* Cost Allocation */}
      <div className="mt-6">
        <div className="mt-4">
          <div className="flex justify-between text-pdf-text">
            <div>
              44,96 % aus 115.498,07 € Energie- und Heizungsbetriebskosten
              entspricht Kosten für Erwärmung Warmwasser
            </div>
            <div>51.927,94 €</div>
          </div>
          <div className="flex justify-between text-pdf-text">
            <div className="font-bold text-pdf-dark">
              Gerätemiete Heizung/Warmwasser
            </div>
            <div>2.307,77 €</div>
          </div>
          <div className="flex justify-between rounded-base bg-pdf-accent font-bold p-2 mt-2 text-pdf-dark">
            <div>Kosten für Warmwasser</div>
            <div>54.235,71 €</div>
          </div>
          <div className="grid grid-cols-4 text-pdf-text gap-4 mt-2">
            <div className="text-pdf-dark font-bold">
              davon {previewData.mainDocData.living_space_share} % Grundkosten
            </div>
            <div className="text-right">16.270,72 € :</div>
            <div className="text-right">11.196,40 m²</div>
            <div className="text-right">= 1,453210 €/m²</div>
          </div>
          <div className="grid grid-cols-4 text-pdf-text gap-4">
            <div className="text-pdf-dark font-bold">
              davon {previewData.mainDocData.consumption_dependent} %
              Verbrauchskosten
            </div>
            <div className="text-right">37.964,99 € :</div>
            <div className="text-right">3.148,25 m³</div>
            <div className="text-right">= 12,059077 €/m³</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="font-bold border-b text-pdf-title border-pdf-dark pb-2 mb-2">
            Berechnung und Aufteilung der Kosten für Heizung
          </div>
          <div className="flex justify-between text-pdf-text">
            <div className="font-bold text-pdf-dark">
              Summe Energie- und Heizungsbetriebskosten
            </div>
            <div>115.498,07 €</div>
          </div>
          <div className="flex justify-between text-pdf-text">
            <div className="font-bold text-pdf-dark">
              abzüglich Kosten für Erwärmung Warmwasser
            </div>
            <div>-51.927,94 €</div>
          </div>
          <div className="flex justify-between text-pdf-text">
            <div className="font-bold text-pdf-dark">
              Gerätemiete Heizung/Warmwasser
            </div>
            <div>6.210,80 €</div>
          </div>
          <div className="flex justify-between rounded-base bg-pdf-accent font-bold p-2 text-pdf-dark my-2">
            <div>Kosten für Heizung</div>
            <div>69.780,93 €</div>
          </div>
          <div className="grid grid-cols-4 text-pdf-text gap-4">
            <div className="text-pdf-dark font-bold">
              davon 30 % Grundkosten
            </div>
            <div className="text-right">20.934,28 € :</div>
            <div className="text-right">11.196,40 m²</div>
            <div className="text-right">= 1,869733 €/m²</div>
          </div>
          <div className="grid grid-cols-4 text-pdf-text gap-4">
            <div className="text-pdf-dark font-bold">
              davon 70 % Verbrauchskosten
            </div>
            <div className="text-right">48.846,65 € :</div>
            <div className="text-right">404,04 MWh</div>
            <div className="text-right">= 120,895580 €/MWh</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatingBillPreviewTwo;
