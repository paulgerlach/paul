"use client";

import Image from "next/image";
import { admin_logo } from "@/static/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const heatingData = [
  {
    name: "01.01.2022 - 31.12.2022",
    vorjahreszeitraum: 4230,
    aktuellerZeitraum: 4611,
  },
  {
    name: "01.01.2023 - 31.12.2023",
    vorjahreszeitraum: 5945,
    witterungsbereinigt: 6540,
  },
];

const waterData = [
  { name: "01.01.2022 - 31.12.2022", vorjahreszeitraum: 1376 },
  { name: "01.01.2023 - 31.12.2023", vorjahreszeitraum: 1534 },
];

const HeatingBillPreviewSix = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-sans text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-xs">6/6 355703/0010</div>
        <div className="flex items-center gap-2">
          <Image
            width={150}
            height={32}
            src={admin_logo}
            alt="Brunata Metrona Logo"
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2">
          Ergänzende Informationen in der Abrechnung
        </h1>
      </div>

      <p className="text-xs mb-6">
        Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem
        sie sparsames Heizen fördert. Ergänzend erhalten Sie hier Informationen,
        um Ihren Energieverbrauch bewerten zu können.
      </p>

      {/* Energy Sources */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2 flex justify-between items-center">
        <span>Energieträger der Liegenschaft</span>
        <span className="text-lg">🏠</span>
      </div>
      <div className="text-xs mb-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1 font-bold">Eingesetzte Energieträger</td>
              <td className="py-1 text-right">Nah-/Fernwärme</td>
              <td className="py-1 text-right">761.123,0 kWh</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">
                CO2-Emissionsfaktor¹ des Nah-/Fernwärmenetzes
              </td>
              <td className="py-1 text-right">0,21010 kg CO2/kWh</td>
              <td></td>
            </tr>
            <tr className="font-bold">
              <td className="py-1">
                Primärenergiefaktoren² für Nah-/Fernwärmenetze laut DIN V 18599³
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-4 py-1">Heizwerke und fossile Brennstoffe</td>
              <td className="py-1 text-right">1,30</td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-4 py-1">
                KWK-Anlage mit fossilen Brennstoffen
              </td>
              <td className="py-1 text-right">1,00</td>
              <td></td>
            </tr>
            <tr>
              <td className="pl-4 py-1">
                KWK-Anlage mit erneuerbaren Brennstoffen
              </td>
              <td className="py-1 text-right">0,70</td>
              <td></td>
            </tr>
            <tr className="border-t-2 border-black">
              <td className="py-1 font-bold">
                CO2-Emissionen der Liegenschaft
              </td>
              <td className="py-1 text-right">Nah-/Fernwärme</td>
              <td className="py-1 text-right font-bold">159.911,9 kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Energy Consumption */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2 flex justify-between items-center">
        <span>Ihr Energieverbrauch</span>
        <span className="text-lg">👤</span>
      </div>
      <p className="text-xs mb-4">
        Die hier dargestellten Werte berücksichtigen neben Ihren individuellen
        Verbrauchswerten u.a. den Wirkungsgrad der Heizungsanlage und
        Leitungsverluste im Gebäude.⁴
      </p>
      <div className="grid grid-cols-2 gap-8 text-xs">
        <div>
          <div className="font-bold text-center mb-2">Heizung in kWh</div>
          <BarChart width={300} height={200} data={heatingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="vorjahreszeitraum"
              fill="#8884d8"
              name="Vorjahreszeitraum"
            />
            <Bar
              dataKey="aktuellerZeitraum"
              fill="#82ca9d"
              name="aktueller Zeitraum"
            />
            <Bar
              dataKey="witterungsbereinigt"
              fill="#ffc658"
              name="witterungsbereinigt⁵"
            />
          </BarChart>
        </div>
        <div>
          <div className="font-bold text-center mb-2">Warmwasser in kWh</div>
          <BarChart width={300} height={200} data={waterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="vorjahreszeitraum"
              fill="#8884d8"
              name="Vorjahreszeitraum"
            />
          </BarChart>
        </div>
      </div>
      <div className="text-xs mt-4">
        <div className="flex items-center gap-4">
          <span>* Keine Werte verfügbar</span>
        </div>
        <table className="w-full mt-4">
          <tbody>
            <tr>
              <td className="py-1 font-bold">Ihr Heizungsverbrauch</td>
              <td className="py-1 text-right border-b-2 border-black">
                5.945,0 kWh
              </td>
              <td className="w-1/3"></td>
            </tr>
            <tr>
              <td className="py-1 font-bold">Ihr Warmwasserverbrauch</td>
              <td className="py-1 text-right border-b-2 border-black">
                1.534,0 kWh
              </td>
              <td></td>
            </tr>
            <tr className="font-bold">
              <td className="py-1">GESAMT</td>
              <td className="py-1 text-right border-b-2 border-black">
                7.479,1 kWh
              </td>
              <td className="text-center">Vergleichswerte⁶</td>
            </tr>
            <tr>
              <td className="py-1 font-bold">Ihre Wohnfläche</td>
              <td className="py-1 text-right border-b-2 border-black">
                77,0 m²
              </td>
              <td className="text-center">Bundesweiter Vergleichsnutzer</td>
              <td className="text-center">Liegenschafts-durchschnitt</td>
            </tr>
            <tr className="text-blue-600 font-bold">
              <td className="py-1">
                Ihr Energieverbrauch je
                <br />
                Quadratmeter Wohnfläche
              </td>
              <td className="py-1 text-right">97,1 kWh / m²</td>
              <td className="text-center">92,9 kWh / m²</td>
              <td className="text-center">68,0 kWh / m²</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Further Information */}
      <div className="bg-gray-200 font-bold p-1 pl-2 text-sm mb-2 mt-6 flex justify-between items-center">
        <span>Weitere Informationen und Informationsquellen</span>
        <span className="text-lg">ℹ️</span>
      </div>
      <div className="text-xs mb-4">
        <p className="mb-2">
          Entgelte für die Gebrauchsüberlassung, für die Verwendung der
          Ausstattung zur Verbrauchserfassung einschließlich der Eichung, sowie
          für die Ablesung und Abrechnung entnehmen Sie bitte Ihrer vorliegenden
          Heizkostenabrechnung unter dem Punkt &quot;Aufstellung der Kosten /
          Weitere Heizungsbetriebskosten&quot;.
        </p>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 border border-black"></div>{" "}
          {/* QR Code Placeholder */}
          <p>
            Informationen zu Verbraucherorganisationen, Energiespartipps zur
            Reduzierung der Heizkosten und des Energieverbrauches sowie Hinweise
            zur Steigerung der Effizienz Ihrer Heizungsanlage und Heizkörper
            finden Sie unter{" "}
            <a
              href="https://www.brunata-metrona.de/ida"
              className="text-blue-600"
            >
              www.brunata-metrona.de/ida
            </a>
            .
            <br />
            <br />
            Hier finden Sie auch weitere Informationen zu Steuern, Abgaben und
            Zöllen der eingesetzten Energieträger, sowie zur Möglichkeit eines
            Streitbeilegungsverfahren, wenn Sie sich hierzu informieren wollen.
            <br />
            <br />
            Informationen zu Energieagenturen finden Sie z.B. unter{" "}
            <a href="https://www.energieagenturen.de" className="text-blue-600">
              www.energieagenturen.de
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footnotes */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          1 Der CO2-Emissionsfaktor berücksichtigt die unterschiedlichen
          Energieträger bei der Wärmeerzeugung und gibt an, wieviele
          CO2-Treibhausgase dabei freigesetzt werden.
        </p>
        <p>
          2 Der Primärenergiefaktor gibt an, wie viel Primärenergie eingesetzt
          werden muss um eine bestimmte Menge an Endenergie zu erhalten. Je
          kleiner dieser Wert, desto nachhaltiger die Energiequelle.
        </p>
        <p>
          3 Es wurde keine Angabe für das vorliegende Nah-/Fernwärmenetz
          eingebracht. Die Werte der DIN V 18599 stellen typische
          Primärenergiefaktoren für die drei genannten Beispiele dar.
        </p>
        <p>
          4 Energieverbräuche sind in kWh auszuweisen. Die im Rahmen der
          unterjährigen Verbrauchsinformationen (UVI) vorab ausgewiesenen
          Energieverbräuche für Heizung bzw. Warmwasser werden über ein anderes
          Berechnungsverfahren ermittelt und können daher von den hier
          dargestellten, tatsächlichen Energieverbräuchen abweichen.
        </p>
        <p>
          5 Das Wetter - bedingt durch Temperaturschwankungen - hat Einfluss auf
          Ihr Heizverhalten. In der oben stehenden Grafik werden Ihre
          Energieverbräuche über das langjährige Mittel des
          Liegenschaftsstandorts auch witterungsbereinigt dargestellt, d.h.
          Wetterschwankungen werden herausgerechnet.
        </p>
        <p>
          6 Bitte beachten Sie: Der Vergleichsverbrauch wird durch weitere
          Kriterien wie Verbrauchsverhalten, Gebäudezustand oder Lage innerhalb
          des Gebäudes beeinflusst.
        </p>
      </div>
    </div>
  );
};

export default HeatingBillPreviewSix;
