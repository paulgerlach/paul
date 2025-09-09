"use client";

import { useDialogStore } from "@/store/useDialogStore";
import DialogBase from "../ui/DialogBase";
import { useState } from "react";
import Image from "next/image";
import {
  corner_green_check,
  green_check_single,
  heating_bill_builing,
  heating_bill_condominium,
} from "@/static/icons";
import { ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

export default function HeatingBillCreateDialog() {
  const { openDialogByType, closeDialog } = useDialogStore();
  const router = useRouter();
  const isOpen = openDialogByType.heating_bill_create;
  const [docFor, setDocFor] = useState<"objektauswahl" | "localauswahl">(
    "objektauswahl"
  );

  const handleNavigate = (type: "objektauswahl" | "localauswahl") => {
    closeDialog("heating_bill_create");
    router.push(ROUTE_HEIZKOSTENABRECHNUNG + `/zwischenstand/${type}`);
  };

  if (isOpen)
    return (
      <DialogBase size={768} dialogName="heating_bill_create">
        <div className="py-6">
          <h2 className="text-center mb-4 font-bold text-admin_dark_text text-lg">
            Auswahl der Objektart
          </h2>
          <p className="text-center text-admin_dark_text text-sm">
            Für welches Einheit möchten Sie die Heizkostenabrechnung erstellen?
            Bei einem Gebäude mit mehreren Einheiten oder einem Einfamilienhaus
            werden automatisch Ihre Vertrags- und Rechnungsdaten übernommen. Bei
            einer Eigentumswohnung (wenn Teil einer WEG) können Sie die
            Abrechnung schnell und einfach anhand der Hausgeldabrechnung fertig
            stellen.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <input
              className="sr-only peer"
              type="radio"
              name="heating_bill_type"
              id="objektauswahl"
              checked={docFor === "objektauswahl"}
              onChange={() => setDocFor("objektauswahl")}
            />
            <label
              htmlFor="objektauswahl"
              className="block px-6 pb-6 pt-11 rounded-xl border-[3px] border-transparent bg-white shadow-sm cursor-pointer transition-all duration-300 peer-checked:border-[3px] peer-checked:border-green space-y-2 relative peer-checked:[&_.cornerCheck]:block"
            >
              <div className="flex items-center justify-center flex-col gap-4 font-bold text-sm text-admin_dark_text">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-[50px] max-h-[50px]"
                  src={heating_bill_builing}
                  alt="heating_bill_builing"
                />
                Gebäude
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-admin_dark_text">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[24px] max-h-[24px]"
                    src={green_check_single}
                    alt="green_check_single"
                  />
                  Für Mietshäuser
                </li>
                <li className="flex items-start gap-2 text-sm text-admin_dark_text">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[24px] max-h-[24px]"
                    src={green_check_single}
                    alt="green_check_single"
                  />
                  Für Einfamilienhäuser
                </li>
                <li className="flex items-start gap-2 text-sm text-admin_dark_text">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[24px] max-h-[24px]"
                    src={green_check_single}
                    alt="green_check_single"
                  />
                  Übertragung deiner Verträge und Rechnungen
                </li>
              </ul>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-[20px] max-h-[22px] absolute top-[-1px] right-[-1px] cornerCheck hidden"
                src={corner_green_check}
                alt="corner_green_check"
              />
            </label>
          </div>
          <div>
            <input
              className="sr-only peer"
              type="radio"
              name="heating_bill_type"
              id="localauswahl"
              checked={docFor === "localauswahl"}
              onChange={() => setDocFor("localauswahl")}
            />
            <label
              htmlFor="localauswahl"
              className="block px-6 pb-6 pt-11 rounded-xl border-[3px] border-transparent bg-white shadow-sm cursor-pointer transition-all duration-100 peer-checked:border-[3px] peer-checked:border-green space-y-2 relative peer-checked:[&_.cornerCheck]:block"
            >
              <div className="flex items-center justify-center flex-col gap-4 font-bold text-sm text-admin_dark_text">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-[50px] max-h-[50px]"
                  src={heating_bill_condominium}
                  alt="heating_bill_condominium"
                />
                Eigentumswohnung
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-admin_dark_text">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[24px] max-h-[24px]"
                    src={green_check_single}
                    alt="green_check_single"
                  />
                  Optimiert für Eigentumswohnungen
                </li>
                <li className="flex items-start gap-2 text-sm text-admin_dark_text">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[24px] max-h-[24px]"
                    src={green_check_single}
                    alt="green_check_single"
                  />
                  Dateneingabe anhand der Hausgeldabrechnung
                </li>
                <li className="flex items-start gap-2 text-sm text-admin_dark_text">
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    loading="lazy"
                    className="max-w-[24px] max-h-[24px]"
                    src={green_check_single}
                    alt="green_check_single"
                  />
                  In nur 5 Schritten zum Ergebnis
                </li>
              </ul>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-[20px] max-h-[22px] absolute top-[-1px] right-[-1px] cornerCheck hidden"
                src={corner_green_check}
                alt="corner_green_check"
              />
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={() => closeDialog("heating_bill_create")}
            className="py-2 px-6 max-xl:px-3.5 max-xl:py-2 max-xl:text-sm rounded-lg flex items-center justify-center border border-admin_dark_text/50 text-admin_dark_text bg-[#e0e0e0] cursor-pointer font-medium hover:bg-[#d0d0d0] transition-colors duration-300"
          >
            Zurück
          </button>
          <Button onClick={() => handleNavigate(docFor)}>Loslegen</Button>
        </div>
      </DialogBase>
    );
}
