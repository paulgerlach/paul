
import Image from "next/image";
import { admin_logo } from "@/static/icons";

const HeatingBillPreviewFive = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-sans text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-xs">5/6 355703/0010</div>
        <div className="flex items-center gap-2">
          <Image width={150} height={32} src={admin_logo} alt="Brunata Metrona Logo" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2">
          CO2-Kostenaufteilung
        </h1>
      </div>

      <p className="text-xs mb-6">
        Seit 2021 wird eine CO2-Abgabe gemäß Brennstoffemissionshandelsgesetz
        (BEHG) für fossile Brennstoffe erhoben, welche Kohlenstoffdioxid (CO2)
        emittieren. Das zum 01.01.2023 in Kraft getretene
        Kohlendioxidkostenaufteilungsgesetz (CO2KostAufG) regelt die Aufteilung
        der CO2-Kosten zwischen Mieter und Vermieter.
      </p>

      {/* CO2 Costs of the Property */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2">
        CO2-Kosten der Liegenschaft
      </div>
      <div className="text-xs mb-4">
        <div className="font-bold mb-1">Energieart: Nah-/Fernwärme</div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left font-normal py-1">POSITION</th>
              <th className="text-left font-normal py-1">DATUM</th>
              <th className="text-right font-normal py-1">Menge in kWh</th>
              <th className="text-right font-normal py-1">CO2-Emissionen in kg</th>
              <th className="text-right font-normal py-1">CO2-Kosten in EUR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1">Bezug</td>
              <td className="py-1">31.12.2023</td>
              <td className="py-1 text-right">761.123</td>
              <td className="py-1 text-right">159.911,9</td>
              <td className="py-1 text-right">14.318,13</td>
            </tr>
            <tr className="border-t-2 border-black">
              <td className="py-1 font-bold">Summe Verbrauch</td>
              <td></td>
              <td className="py-1 text-right font-bold">761.123</td>
              <td className="py-1 text-right font-bold">159.911,9</td>
              <td className="py-1 text-right font-bold">14.318,13</td>
            </tr>
            <tr className="text-blue-600 font-bold">
              <td className="py-1">Gesamt</td>
              <td></td>
              <td className="py-1 text-right">761.123</td>
              <td className="py-1 text-right">159.911,9</td>
              <td className="py-1 text-right">14.318,13</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Classification of the Property */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2">
        Einstufung der Liegenschaft gemäß CO2KostAufG (Wohngebäude)
      </div>
      <div className="text-xs mb-4">
        <table className="w-full mb-2">
          <tbody>
            <tr>
              <td className="py-1">CO2-Emissionen der Liegenschaft</td>
              <td className="py-1 text-right">159.912 kg CO2</td>
              <td className="py-1 pl-4">CO2-Kosten der Liegenschaft</td>
              <td className="py-1 text-right">14.318,13 €</td>
            </tr>
            <tr>
              <td className="py-1">Gesamtwohnfläche der Liegenschaft</td>
              <td className="py-1 text-right">11.196,4 m²</td>
              <td className="py-1 pl-4">CO2-Emissionsfaktor</td>
              <td className="py-1 text-right">0,210 kg CO2/kWh</td>
            </tr>
            <tr className="border-t-2 border-black">
              <td className="py-1 font-bold">CO2-Emission pro m² Wohnfläche</td>
              <td className="py-1 text-right font-bold">14,3 kg CO2/m²/a</td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </table>
        <table className="w-full border-2 border-black">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left font-bold p-1">CO2-Emission pro m²<br/>Wohnfläche und Jahr</th>
              <th className="text-center font-bold p-1">Anteil<br/>Mieter</th>
              <th className="text-center font-bold p-1">Anteil<br/>Vermieter</th>
            </tr>
          </thead>
          <tbody>
            {[ 
              { range: "< 12", mieter: "100 %", vermieter: "0 %" },
              { range: "12 bis < 17", mieter: "90 %", vermieter: "10 %", highlight: true },
              { range: "17 bis < 22", mieter: "80 %", vermieter: "20 %" },
              { range: "22 bis < 27", mieter: "70 %", vermieter: "30 %" },
              { range: "27 bis < 32", mieter: "60 %", vermieter: "40 %" },
              { range: "32 bis < 37", mieter: "50 %", vermieter: "50 %" },
              { range: "37 bis < 42", mieter: "40 %", vermieter: "60 %" },
              { range: "42 bis < 47", mieter: "30 %", vermieter: "70 %" },
              { range: "47 bis < 52", mieter: "20 %", vermieter: "80 %" },
              { range: ">= 52", mieter: "5 %", vermieter: "95 %" },
            ].map((item, index) => (
              <tr key={index} className={`${item.highlight ? 'bg-blue-800 text-white' : ''}`}>
                <td className="p-1">{item.range} kg CO2/m²/a</td>
                <td className="text-center p-1">{item.mieter}</td>
                <td className="text-center p-1">{item.vermieter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CO2 Cost Allocation for Your Unit */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2">
        CO2-Kostenaufteilung für Ihre Nutzeinheit
      </div>
      <div className="text-xs mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left font-normal py-1">Aufteilung der CO2-Kosten</th>
              <th className="text-right font-normal py-1">Anteil Mieter</th>
              <th className="text-right font-normal py-1">Anteil Vermieter</th>
              <th className="text-right font-normal py-1">Summe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1">gemäß Einstufung (jeweils)</td>
              <td className="py-1 text-right">90 %</td>
              <td className="py-1 text-right">10 %</td>
              <td className="py-1 text-right">100 %</td>
            </tr>
            <tr>
              <td className="py-1">für die Liegenschaft</td>
              <td className="py-1 text-right">12.886,32 €</td>
              <td className="py-1 text-right">1.431,81 €</td>
              <td className="py-1 text-right">14.318,13 €</td>
            </tr>
            <tr className="text-blue-600 font-bold">
              <td className="py-1">für Ihre Nutzeinheit (anteilig)</td>
              <td className="py-1 text-right">126,60 €</td>
              <td className="py-1 text-right">14,08 €</td>
              <td className="py-1 text-right">140,68 €</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs mb-6">
        Der Abzug des Vermieteranteils an den CO2-Kosten wurde in der Heizkostenabrechnung noch nicht berücksichtigt.
        <br />
        Im Falle einer Vermietung dieser Nutzeinheit ist gemäß CO2KostAufG noch die Kostenübernahme durch den Vermieter in Höhe von 14,08 € zu leisten.
      </p>

      {/* Further Information */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2">
        Weitere Informationen und Informationsquellen
      </div>
      <div className="flex items-center text-xs">
        <div className="w-16 h-16 border border-black mr-4"></div> {/* QR Code Placeholder */}
        <div>
          Informationen rund um das Thema CO2-Kostenaufteilung finden Sie unter <a href="https://www.brunata-metrona.de/co2" className="text-blue-600">www.brunata-metrona.de/co2</a>.
        </div>
      </div>

    </div>
  );
};

export default HeatingBillPreviewFive;
