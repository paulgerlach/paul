import Image from "next/image";
import { admin_logo } from "@/static/icons";

const HeatingBillPreviewThree = () => {
  return (
    <div className="mx-auto max-w-[1400px] space-y-[70px] font-sans text-sm">
      {/* Header */}
      <div className="bg-pdf-accent rounded-base p-6 space-y-6 text-pdf-dark">
        <div className="flex justify-between items-start">
          <div className="text-xs text-pdf-text">3/6 355703/0010</div>
          <Image
            width={130}
            height={48}
            src={admin_logo}
            alt="admin preview heidi"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Kaltwasser Section */}
        <div>
          <h2 className="text-2xl font-bold text-pdf-title mb-4">
            Berechnung und Aufteilung der Kosten für Kaltwasser
          </h2>
          <div className="bg-[#DDE9E0] rounded-lg p-2 flex justify-between font-bold text-[#083123] mb-4">
            <span>Kosten für Kaltwasser</span>
            <span>41.468,88 €</span>
          </div>
          <table className="w-full text-sm text-pdf-text mb-4">
            <tbody>
              <tr>
                <td className="py-1 font-bold text-pdf-dark">Kaltwasser </td>
                <td className="py-1 text-right">17.036,69 € :</td>
                <td className="py-1 text-right">9.943,14 m³ =</td>
                <td className="py-1 text-right">1,713411 €/m³</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-pdf-dark">
                  Abwasser Gesamt
                </td>
                <td className="py-1 text-right">20.030,62 € :</td>
                <td className="py-1 text-right">9.943,14 m³ =</td>
                <td className="py-1 text-right">2,014517 €/m³</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-pdf-dark">
                  Gerätemiete Kaltwasser
                </td>
                <td className="py-1 text-right">2.274,90 € :</td>
                <td className="py-1 text-right">9.943,14 m³ =</td>
                <td className="py-1 text-right">0,228791 €/m³</td>
              </tr>
              <tr>
                <td className="py-1 font-bold text-pdf-dark">
                  Abrechnung Kaltwasser
                </td>
                <td className="py-1 text-right">2.126,67 € :</td>
                <td className="py-1 text-right">123,00 Nutzeinh. =</td>
                <td className="py-1 text-right">17,290000 €/Nutzeinh.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Aufteilung der Kosten für Kaltwasser */}
        <div>
          <div className="bg-pdf-dark text-white p-2 flex justify-between items-center mt-4 font-bold rounded-lg">
            <span>Summe Ihrer Kosten für Kaltwasser</span>
            <span className="text-lg">153,80 €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatingBillPreviewThree;
