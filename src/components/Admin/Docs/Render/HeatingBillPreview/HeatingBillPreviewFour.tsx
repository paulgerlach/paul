
import Image from "next/image";
import { admin_logo } from "@/static/icons";

const HeatingBillPreviewFour = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-sans text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-xs">4/6 355703/0010</div>
        <div className="flex items-center gap-2">
          <Image width={150} height={32} src={admin_logo} alt="Brunata Metrona Logo" />
        </div>
      </div>

      {/* Address Info */}
      <div className="grid grid-cols-2 gap-20 text-sm">
        <div>
          <div className="border-b border-black pb-1 mb-2">
            BRUNATA-METRONA GmbH & Co. KG - 81366 München
          </div>
          <div className="font-bold">Andreas Preissler Eigennutzer</div>
          <div>Lindenstraße 49</div>
          <div>12589 Berlin</div>
        </div>
        <div>
          <div className="font-bold text-lg mb-4">
            Ihre BRUNATA® Abrechnung für
            <br />
            Heizung, Warmwasser, Kaltwasser
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold">Liegenschaft</div>
              <div>Rungestr. 21 u.a.</div>
              <div>10179 Berlin</div>
            </div>
            <div>
              <div className="font-bold">Erstellt im Auftrag von</div>
              <div>Braun & Hubertus GmbH</div>
              <div>Immobilienmanagement</div>
              <div>Keithstr. 2-4</div>
              <div>10787 Berlin</div>
            </div>
            <div>
              <div className="font-bold">Liegenschaftsnummer</div>
              <div>355703</div>
            </div>
            <div>
              <div className="font-bold">BRUNATA Nutzernummer</div>
              <div>0010</div>
            </div>
            <div>
              <div className="font-bold">Abrechnungszeitraum</div>
              <div>01.01.2023 - 31.12.2023</div>
            </div>
            <div>
              <div className="font-bold">erstellt am</div>
              <div>14.11.2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* Costs */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4">
          Ihre Kosten
        </h2>
        <div className="text-sm">
          {/* Heating Costs */}
          <div className="bg-gray-200 font-bold p-1 pl-2">Kosten für Heizung</div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1 pr-2">Grundkosten</td>
                <td className="py-1 px-2 text-right">77,02 m² Wohnfläche</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">1,869733 € je m²</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">144,01 €</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Verbrauchskosten</td>
                <td className="py-1 px-2 text-right">7,00 MWh</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">120,895580 € je MWh</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">846,27 €</td>
              </tr>
            </tbody>
          </table>
          {/* Hot Water Costs */}
          <div className="bg-gray-200 font-bold p-1 pl-2 mt-2">Kosten für Warmwasser</div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1 pr-2">Grundkosten</td>
                <td className="py-1 px-2 text-right">77,02 m² Wohnfläche</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">1,453210 € je m²</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">111,93 €</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Verbrauchskosten</td>
                <td className="py-1 px-2 text-right">10,88 m³</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">12,059077 € je m³</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">131,20 €</td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="py-1 font-bold">Summe Kosten für Heizung und Warmwasser</td>
                <td colSpan={4}></td>
                <td className="py-1 text-right font-bold">1.233,41 €</td>
              </tr>
            </tbody>
          </table>
          {/* Cold Water Costs */}
          <div className="bg-gray-200 font-bold p-1 pl-2 mt-2">Kosten für Kaltwasser</div>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1 pr-2">Kaltwasser Gesamt</td>
                <td className="py-1 px-2 text-right">45,20 m³</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">1,713411 € je m³</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">77,45 €</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Abwasser Gesamt</td>
                <td className="py-1 px-2 text-right">45,20 m³</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">2,014517 € je m³</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">91,06 €</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Gerätemiete Kaltwasser</td>
                <td className="py-1 px-2 text-right">45,20 m³</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">0,228791 € je m³</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">10,34 €</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">Abrechnung Kaltwasser</td>
                <td className="py-1 px-2 text-right">1,00 Nutzeinh.</td>
                <td className="py-1 px-2">x</td>
                <td className="py-1 px-2 text-right">17,290569 € je Nutzeinh.</td>
                <td className="py-1 pl-2 text-right">=</td>
                <td className="py-1 pl-2 text-right">17,29 €</td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="py-1 font-bold">Summe Kosten für Kaltwasser</td>
                <td colSpan={4}></td>
                <td className="py-1 text-right font-bold">196,14 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Total Amount */}
        <div className="bg-blue-800 text-white p-2 flex justify-between items-center mt-4">
          <span className="font-bold">Gesamtbetrag</span>
          <span className="font-bold text-lg">1.429,55 €</span>
        </div>
      </div>

      {/* State Relief */}
      <div className="mt-8 text-sm">
        <div className="bg-gray-200 font-bold p-1 pl-2 flex justify-between">
          <span>Enthaltene staatliche Entlastungen (u. a. EWSG, EWPBG, StromPBG)</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left font-normal py-1"></th>
              <th className="text-right font-normal py-1">Betrag</th>
              <th className="text-right font-normal py-1">Ihr Anteil</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1">Preisbremse Energie</td>
              <td className="py-1 text-right">21.035,94 €</td>
              <td className="py-1 text-right">209,21 €</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Consumption Values */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4">
          Ihre Verbrauchswerte
        </h2>
        <div className="text-xs">
          {/* Heating in MWh */}
          <div className="bg-gray-200 font-bold p-1 pl-2">Heizung in MWh</div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left font-normal py-1">RAUMBEZEICHNUNG</th>
                <th className="text-left font-normal py-1">GERÄTENUMMER</th>
                <th className="text-left font-normal py-1">GERÄTEART</th>
                <th className="text-right font-normal py-1">ANF.-STAND</th>
                <th className="text-right font-normal py-1">ABLESUNG</th>
                <th className="text-right font-normal py-1">FAKTOR</th>
                <th className="text-right font-normal py-1">VERBRAUCH</th>
                <th className="text-left font-normal py-1">BEMERKUNG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">Flur</td>
                <td className="py-1">6EFE0121755587</td>
                <td className="py-1">Wärmezähler</td>
                <td className="py-1 text-right">1,918</td>
                <td className="py-1 text-right">8,916</td>
                <td className="py-1"></td>
                <td className="py-1 text-right">7,000</td>
                <td className="py-1"></td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="py-1 font-bold" colSpan={6}>Summe Heizung</td>
                <td className="py-1 text-right font-bold">7,000</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Hot water in m³ */}
          <div className="bg-gray-200 font-bold p-1 pl-2 mt-4">Warmwasser in m³</div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left font-normal py-1">RAUMBEZEICHNUNG</th>
                <th className="text-left font-normal py-1">GERÄTENUMMER</th>
                <th className="text-left font-normal py-1">GERÄTEART</th>
                <th className="text-right font-normal py-1">ANF.-STAND</th>
                <th className="text-right font-normal py-1">ABLESUNG</th>
                <th className="text-right font-normal py-1">FAKTOR</th>
                <th className="text-right font-normal py-1">VERBRAUCH</th>
                <th className="text-left font-normal py-1">BEMERKUNG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">Bad</td>
                <td className="py-1">9DWZ0122156287</td>
                <td className="py-1">Warmwasserzähler</td>
                <td className="py-1 text-right">3,52</td>
                <td className="py-1 text-right">11,381</td>
                <td className="py-1"></td>
                <td className="py-1 text-right">7,86</td>
                <td className="py-1"></td>
              </tr>
              <tr>
                <td className="py-1">Bad</td>
                <td className="py-1">9DWZ0122156297</td>
                <td className="py-1">Warmwasserzähler</td>
                <td className="py-1 text-right">1,04</td>
                <td className="py-1 text-right">4,051</td>
                <td className="py-1"></td>
                <td className="py-1 text-right">3,02</td>
                <td className="py-1"></td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="py-1 font-bold" colSpan={6}>Summe Warmwasser</td>
                <td className="py-1 text-right font-bold">10,88</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Cold water in m³ */}
          <div className="bg-gray-200 font-bold p-1 pl-2 mt-4">Kaltwasser in m³</div>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left font-normal py-1">RAUMBEZEICHNUNG</th>
                <th className="text-left font-normal py-1">GERÄTENUMMER</th>
                <th className="text-left font-normal py-1">GERÄTEART</th>
                <th className="text-right font-normal py-1">ANF.-STAND</th>
                <th className="text-right font-normal py-1">ABLESUNG</th>
                <th className="text-right font-normal py-1">FAKTOR</th>
                <th className="text-right font-normal py-1">VERBRAUCH</th>
                <th className="text-left font-normal py-1">BEMERKUNG</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">Bad</td>
                <td className="py-1">8DWZ0122033399</td>
                <td className="py-1">Kaltwasserzähler</td>
                <td className="py-1 text-right">7,56</td>
                <td className="py-1 text-right">23,291</td>
                <td className="py-1"></td>
                <td className="py-1 text-right">15,73</td>
                <td className="py-1"></td>
              </tr>
              <tr>
                <td className="py-1">Bad</td>
                <td className="py-1">8DWZ0122033396</td>
                <td className="py-1">Kaltwasserzähler</td>
                <td className="py-1 text-right">11,91</td>
                <td className="py-1 text-right">30,494</td>
                <td className="py-1"></td>
                <td className="py-1 text-right">18,59</td>
                <td className="py-1"></td>
              </tr>
              <tr className="border-t-2 border-black">
                <td className="py-1 font-bold" colSpan={6}>Summe Kaltwasser</td>
                <td className="py-1 text-right font-bold">34,32</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-600">
        Detaillierte Berechnung und Verteilung auf alle Nutzeinheiten des Gebäudes entnehmen Sie bitte der Gesamtabrechnung. Bitte wenden Sie sich bei Fragen zu Ihrer Abrechnung zunächst an Ihren Vermieter oder Verwalter. Informationen zur verbrauchsabhängigen Abrechnung finden Sie unter www.brunata-metrona.de.
      </div>
    </div>
  );
};

export default HeatingBillPreviewFour;
