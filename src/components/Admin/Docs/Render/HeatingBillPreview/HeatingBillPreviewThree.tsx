
import Image from "next/image";
import { admin_logo } from "@/static/icons";

const HeatingBillPreviewThree = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 font-sans text-black">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="text-xs">3/6 355703/0010</div>
        <div className="flex items-center gap-2">
          <Image width={150} height={32} src={admin_logo} alt="Brunata Metrona Logo" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-4">
          Berechnung und Aufteilung der Kosten für Kaltwasser
        </h2>
      </div>

      {/* Cold Water Costs Table */}
      <div className="bg-gray-200 p-1">
        <div className="flex justify-between items-center font-bold text-sm px-2">
          <div>Kosten für Kaltwasser</div>
          <div>41.468,88 €</div>
        </div>
      </div>
      <table className="w-full text-sm mt-2">
        <tbody>
          <tr className="border-b">
            <td className="py-1 pr-4">Kaltwasser Gesamt</td>
            <td className="py-1 px-2 text-right">17.036,69 € :</td>
            <td className="py-1 px-2 text-right">9.943,14 m³</td>
            <td className="py-1 pl-2 text-right">=</td>
            <td className="py-1 pl-2 text-right">1,713411 €/m³</td>
          </tr>
          <tr className="border-b">
            <td className="py-1 pr-4">Abwasser Gesamt</td>
            <td className="py-1 px-2 text-right">20.030,62 € :</td>
            <td className="py-1 px-2 text-right">9.943,14 m³</td>
            <td className="py-1 pl-2 text-right">=</td>
            <td className="py-1 pl-2 text-right">2,014517 €/m³</td>
          </tr>
          <tr className="border-b">
            <td className="py-1 pr-4">Gerätemiete Kaltwasser</td>
            <td className="py-1 px-2 text-right">2.274,90 € :</td>
            <td className="py-1 px-2 text-right">9.943,14 m³</td>
            <td className="py-1 pl-2 text-right">=</td>
            <td className="py-1 pl-2 text-right">0,228791 €/m³</td>
          </tr>
          <tr>
            <td className="py-1 pr-4">Abrechnung Kaltwasser</td>
            <td className="py-1 px-2 text-right">2.126,67 € :</td>
            <td className="py-1 px-2 text-right">123,00 Nutzeinh.</td>
            <td className="py-1 pl-2 text-right">=</td>
            <td className="py-1 pl-2 text-right">17,290000 €/Nutzeinh.</td>
          </tr>
        </tbody>
      </table>

      {/* Total Distributed Costs */}
      <div className="bg-blue-800 text-white p-2 flex justify-between items-center mt-4">
        <span className="font-bold">Summe der verteilten Kosten</span>
        <span className="font-bold text-lg">165.485,59 €</span>
      </div>
    </div>
  );
};

export default HeatingBillPreviewThree;
