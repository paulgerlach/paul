import Image from "next/image";
import { admin_logo } from "@/static/icons";

const HeatingBillPreviewTwo = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-sans text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="text-xs">2/6 355703/0010</div>
        <div className="flex items-center gap-2">
          <Image width={100} height={32} src={admin_logo} alt="Heidi Logo" />
        </div>
      </div>

      {/* Title */}
      <div className="grid grid-cols-2 gap-20">
        <div>
          <div className="font-bold text-xl leading-tight mb-2">
            Ihre Abrechnung für Heizung,
            <br />
            Warmwasser, Kaltwasser von Heidi
          </div>
          <div className="text-sm">
            Die Gesamtabrechnung bildet die Aufteilung der Kosten für das
            gesamte Gebäude ab. Die anteiligen Kosten für Ihre Nutzeinheit
            entnehmen Sie bitte dem Formular &quot;Ihre Abrechnung&quot;.
          </div>
        </div>
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold">Liegenschaft</div>
              <div>Rungestr. 21 u.a.</div>
              <div>10179 Berlin</div>
            </div>
            <div>
              <div className="font-bold">Liegenschaftsnummer</div>
              <div>355703</div>
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

      {/* Cost Breakdown */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4">
          Aufstellung der Kosten
        </h2>
        <div className="grid grid-cols-2 gap-20">
          <div>
            <div className="font-bold mb-2">Energieart: Nah-/Fernwärme kWh</div>
            <table className="w-full text-sm border-b border-black">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left font-bold py-1">POSITION</th>
                  <th className="text-left font-bold py-1">DATUM</th>
                  <th className="text-left font-bold py-1">kWh</th>
                  <th className="text-right font-bold py-1">BETRAG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Preisbremse Energie</td>
                  <td></td>
                  <td></td>
                  <td className="text-right">-21.035,94 €</td>
                </tr>
                <tr>
                  <td className="py-1">
                    Rechnung
                    <br />
                    260002673166
                  </td>
                  <td>31.12.2023</td>
                  <td>761.123</td>
                  <td className="text-right">124.242,47 €</td>
                </tr>
                <tr className="border-t border-black">
                  <td className="py-1 font-bold">Summe Verbrauch</td>
                  <td></td>
                  <td className="font-bold">761.123</td>
                  <td className="text-right font-bold">103.206,53 €</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div className="font-bold mb-2">Weitere Heizungsbetriebskosten</div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left font-bold py-1">POSITION</th>
                  <th className="text-left font-bold py-1">DATUM</th>
                  <th className="text-right font-bold py-1">BETRAG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Übertrag</td>
                  <td></td>
                  <td className="text-right">103.206,53 €</td>
                </tr>
                <tr>
                  <td className="py-1">Verbrauchsabrechnung</td>
                  <td></td>
                  <td className="text-right">7.155,11 €</td>
                </tr>
                <tr>
                  <td className="py-1">Betriebsstrom</td>
                  <td>31.12.2023</td>
                  <td className="text-right">4.128,26 €</td>
                </tr>
                <tr>
                  <td className="py-1">Wartungskosten</td>
                  <td>31.12.2023</td>
                  <td className="text-right">1.008,17 €</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="py-1 font-bold pl-2" colSpan={2}>
                    Summe Energie- und Heizungsbetriebskosten
                  </td>
                  <td className="text-right font-bold pr-2">115.498,07 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Costs for separate distribution */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4">
          Kosten für gesonderte Verteilung
        </h3>
        <div className="grid grid-cols-2 gap-20">
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-bold py-1">VERTEILUNG NACH</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Heizung</td>
                </tr>
                <tr>
                  <td className="py-1">Warmwasser/Kaltwasser</td>
                </tr>
                <tr>
                  <td className="py-1">Warmwasser/Kaltwasser</td>
                </tr>
                <tr>
                  <td className="py-1">Warmwasser/Kaltwasser</td>
                </tr>
                <tr>
                  <td className="py-1">Nutzeinheit</td>
                </tr>
                <tr>
                  <td className="py-1">Warmwasser</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-bold py-1">POSITION</th>
                  <th className="text-left font-bold py-1">DATUM</th>
                  <th className="text-right font-bold py-1">BETRAG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Gerätemiete Heizung/Warmwasser</td>
                  <td>04.08.2023</td>
                  <td className="text-right">6.210,80 €</td>
                </tr>
                <tr>
                  <td className="py-1">Kaltwasser</td>
                  <td>31.12.2023</td>
                  <td className="text-right">17.036,69 €</td>
                </tr>
                <tr>
                  <td className="py-1">Abwasser</td>
                  <td>31.12.2023</td>
                  <td className="text-right">20.030,62 €</td>
                </tr>
                <tr>
                  <td className="py-1">Gerätemiete Kaltwasser</td>
                  <td>04.08.2023</td>
                  <td className="text-right">2.274,90 €</td>
                </tr>
                <tr>
                  <td className="py-1">Abrechnung Kaltwasser</td>
                  <td></td>
                  <td className="text-right">2.126,74 €</td>
                </tr>
                <tr>
                  <td className="py-1">Gerätemiete Heizung/Warmwasser</td>
                  <td>04.08.2023</td>
                  <td className="text-right">2.307,77 €</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="py-1 font-bold pl-2" colSpan={2}>
                    Summe Kosten zur gesonderten Verteilung
                  </td>
                  <td className="text-right font-bold pr-2">49.987,52 €</td>
                </tr>
                <tr className="bg-blue-800 text-white">
                  <td className="py-1 font-bold pl-2" colSpan={2}>
                    Summe der zu verteilenden Kosten
                  </td>
                  <td className="text-right font-bold pr-2">165.485,59 €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cost Allocation */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4">
          Aufteilung der Kosten
        </h2>
        <div className="text-sm">
          <div className="font-bold border-b border-black pb-2 mb-2">
            Berechnung und Aufteilung der Kosten für Warmwasser-Erwärmung
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>
              2,5 kWh/m³/K x 3.148,25 m³ x (60-10°C) = 342.201,09 kWh
              Nah-/Fernwärme = 44,96 % d. Gesamtverbr.
            </div>
            <div className="font-bold">1,15</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>
              44,96 % aus 115.498,07 € Energie- und Heizungsbetriebskosten
              entspricht Kosten für Erwärmung Warmwasser
            </div>
            <div>51.927,94 €</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Gerätemiete Heizung/Warmwasser</div>
            <div>2.307,77 €</div>
          </div>
          <div className="bg-gray-200 flex justify-between items-center p-2 font-bold">
            <div>Kosten für Warmwasser</div>
            <div>54.235,71 €</div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>davon 30 % Grundkosten</div>
            <div className="text-right">16.270,72 € :</div>
            <div className="text-right">11.196,40 m²</div>
            <div className="text-right">= 1,453210 €/m²</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>davon 70 % Verbrauchskosten</div>
            <div className="text-right">37.964,99 € :</div>
            <div className="text-right">3.148,25 m³</div>
            <div className="text-right">= 12,059077 €/m³</div>
          </div>
        </div>

        <div className="text-sm mt-6">
          <div className="font-bold border-b border-black pb-2 mb-2">
            Berechnung und Aufteilung der Kosten für Heizung
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>Summe Energie- und Heizungsbetriebskosten</div>
            <div>115.498,07 €</div>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div>abzüglich Kosten für Erwärmung Warmwasser</div>
            <div>-51.927,94 €</div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div>Gerätemiete Heizung/Warmwasser</div>
            <div>6.210,80 €</div>
          </div>
          <div className="bg-gray-200 flex justify-between items-center p-2 font-bold">
            <div>Kosten für Heizung</div>
            <div>69.780,93 €</div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2">
            <div>davon 30 % Grundkosten</div>
            <div className="text-right">20.934,28 € :</div>
            <div className="text-right">11.196,40 m²</div>
            <div className="text-right">= 1,869733 €/m²</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>davon 70 % Verbrauchskosten</div>
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
