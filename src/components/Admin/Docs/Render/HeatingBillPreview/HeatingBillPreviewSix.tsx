"use client";

import Image from "next/image";
import { admin_logo, pdf_home, pdf_user } from "@/static/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { type HeatingBillPreviewData } from "./HeatingBillPreview";

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

const HeatingBillPreviewSix = ({
  previewData,
}: {
  previewData: HeatingBillPreviewData;
}) => {
  return (
    <div className="mx-auto max-w-[1400px] space-y-6 font-sans text-sm">
      {/* Header */}
      <div className="bg-pdf-accent rounded-base p-6 space-y-6 text-pdf-dark">
        <div className="flex justify-between items-start">
          <div className="text-xs text-pdf-text">6/6 355703/0010</div>
          <div className="flex items-center gap-2">
            <Image
              width={130}
              height={48}
              src={admin_logo}
              alt="admin preview heidi"
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-pdf-text">
        Die Heizkostenabrechnung trägt bereits stark zum Umweltschutz bei, indem
        sie sparsames Heizen fördert. Ergänzend erhalten Sie hier Informationen,
        um Ihren Energieverbrauch bewerten zu können.
      </p>

      {/* Title */}
      <div className="mb-4 relative">
        <h1 className="text-lg font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
          Energieträger der Liegenschaft
        </h1>
        <Image
          className="absolute right-8 -top-3.5"
          src={pdf_home}
          alt="pdf-home"
          width={40}
          height={40}
        />
      </div>

      <div className="text-sm mb-4">
        <table className="w-full text-pdf-text border-spacing-0 border-separate">
          <tbody>
            <tr>
              <td className="py-1 px-2 font-bold text-pdf-dark rounded-l-base border border-r-0 border-pdf-dark">
                Eingesetzte Energieträger
              </td>
              <td className="py-1 border-y border-pdf-dark text-right">
                Nah-/Fernwärme
              </td>
              <td className="py-1 px-2 font-bold text-pdf-dark rounded-r-base border border-l-0 border-pdf-dark text-right">
                761.123,0 kWh
              </td>
            </tr>
            <tr>
              <td className="py-1 px-2 font-bold text-pdf-dark">
                CO2-Emissionsfaktor¹ des Nah-/Fernwärmenetzes
              </td>
              <td className="py-1 text-right">0,21010 kg CO2/kWh</td>
              <td></td>
            </tr>
            <tr className="font-bold text-pdf-dark">
              <td className="py-1 px-2">
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
            <tr>
              <td className="py-1 px-2 rounded-l-base border border-r-0 border-pdf-dark text-pdf-dark font-bold">
                CO2-Emissionen der Liegenschaft
              </td>
              <td className="py-1 border-y border-pdf-dark text-right">
                Nah-/Fernwärme
              </td>
              <td className="py-1 text-right px-2 rounded-r-base border border-l-0 border-pdf-dark text-pdf-dark font-bold">
                159.911,9 kg
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Energy Consumption */}
      <div className="mb-4 relative">
        <h1 className="text-lg font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
          Ihr Energieverbrauch
        </h1>
        <Image
          className="absolute right-8 -top-3.5"
          src={pdf_user}
          alt="pdf-user"
          width={40}
          height={40}
        />
      </div>
      <p className="text-xs text-pdf-text mb-4">
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
              fill="#25453A"
              name="Vorjahreszeitraum"
            />
            <Bar
              dataKey="aktuellerZeitraum"
              fill="#459157"
              name="aktueller Zeitraum"
            />
            <Bar
              dataKey="witterungsbereinigt"
              fill="#83B78F"
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
              fill="#25453A"
              name="Vorjahreszeitraum"
            />
          </BarChart>
        </div>
      </div>
      <div className="text-sm grid grid-cols-2 gap-10 mt-4">
        <table className="w-full text-pdf-text border-spacing-0 border-separate mb-2">
          <tbody>
            <tr>
              <td className="py-1">Ihr Heizungsverbrauch</td>
              <td />
              <td className="py-1 text-right">5.945,0 kWh</td>
            </tr>
            <tr>
              <td className="py-1 border-b border-pdf-dark pb-2">
                Ihr Warmwasserverbrauch
              </td>
              <td className="pb-2 border-b border-pdf-dark" />
              <td className="py-1 border-b border-pdf-dark pb-2 text-right">
                1.534,0 kWh
              </td>
            </tr>
            <tr>
              <td className="py-1">GESAMT</td>
              <td />
              <td className="py-1 text-right">7.479,1 kWh</td>
            </tr>
            <tr>
              <td className="py-1 pb-2">Ihre Wohnfläche</td>
              <td className="pb-2" />
              <td className="py-1 pb-2 text-right">77,0 m²</td>
            </tr>
            <tr className="text-pdf-dark font-bold">
              <td className="py-1 border-pdf-dark border border-r-0 rounded-l-base px-2">
                Ihr Energieverbrauch je
              </td>
              <td className="py-1 border-y border-pdf-dark text-right">
                Quadratmeter Wohnfläche
              </td>
              <td className="py-1 border-pdf-dark border border-l-0 rounded-r-base px-2 text-right">
                97,1 kWh / m²
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full text-pdf-text border-spacing-0 border-separate mb-2 ">
          <tbody>
            <tr>
              <td
                colSpan={2}
                className="py-1 border-b border-pdf-dark text-center font-bold text-pdf-dark"
              >
                Vergleichswerte⁶
              </td>
            </tr>
            <tr>
              <td className="py-1">Bundesweiter Vergleichsnutzer</td>
              <td className="py-1 text-right">Liegenschafts - durchschnitt</td>
            </tr>
            <tr className="text-pdf-dark font-bold">
              <td className="py-1 border-pdf-dark border border-r-0 rounded-l-base px-2">
                92,9 kWh/ m²
              </td>
              <td className="py-1 border-pdf-dark border border-l-0 rounded-r-base px-2 text-right">
                68,0 kWh/m²
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Further Information */}
      <div className="mb-4 relative">
        <h1 className="text-lg font-bold text-white p-2.5 rounded-base bg-pdf-accent2">
          Weitere Informationen und Informationsquellen
        </h1>
        <Image
          className="absolute right-8 -top-3.5"
          src={pdf_user}
          alt="pdf-user"
          width={40}
          height={40}
        />
      </div>
      <div className="text-sm text-pdf-text mb-4">
        <p className="mb-2">
          Entgelte für die Gebrauchsüberlassung, für die Verwendung der
          Ausstattung zur Verbrauchserfassung einschließlich der Eichung, sowie
          für die Ablesung und Abrechnung entnehmen Sie bitte Ihrer vorliegenden
          Heizkostenabrechnung unter dem Punkt &quot;Aufstellung der Kosten /
          Weitere Heizungsbetriebskosten&quot;.
        </p>
        <div className="flex items-start gap-4">
          <div className="w-40 h-40 bg-transparent">
            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https://heidi.systems/3303"
              alt="QR code"
              width={160}
              height={160}
            />
          </div>
          <p>
            Informationen zu Verbraucherorganisationen, Energiespartipps zur
            Reduzierung der Heizkosten und des Energieverbrauches sowie Hinweise
            zur Steigerung der Effizienz Ihrer Heizungsanlage und Heizkörper
            finden Sie unter{" "}
            <a href="www.heidisystems.de/co2" className="text-pdf-link">
              www.heidisystems.de/co2.
            </a>
            <br />
            <br />
            Hier finden Sie auch weitere Informationen zu Steuern, Abgaben und
            Zöllen der eingesetzten Energieträger, sowie zur Möglichkeit eines
            Streitbeilegungsverfahren, wenn Sie sich hierzu informieren wollen.
            <br />
            <br />
            Informationen zu Energieagenturen finden Sie z.B. unter{" "}
            <a href="www.energieagenturen.de" className="text-pdf-link">
              www.energieagenturen.de.
            </a>
          </p>
        </div>
      </div>

      {/* Footnotes */}
      <div className="text-xs text-pdf-text space-y-1">
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
