import Breadcrumb from "@/components/Admin/Breadcrumb/Breadcrumb";
import ContentWrapper from "@/components/Admin/ContentWrapper/ContentWrapper";
import OpenItitalDocDialogButton from "@/components/Admin/Docs/OpenItitalDocDialogButton/OpenItitalDocDialogButton";
import { ROUTE_DASHBOARD, ROUTE_HEIZKOSTENABRECHNUNG } from "@/routes/routes";
import {
  big_time_clock,
  doc_preview_building,
  heating_bill_preview,
  lamp,
} from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    image: lamp,
    title: "Einfache & intuitive Benutzung",
    text: "Schritt-für-Schritt Navigation und praktische Tipps zur schnelleren und rechtssicheren Erstellung.",
  },
  {
    image: big_time_clock,
    title: "Zeitsparen durch einmalige Dateneingabe",
    text: "Alle Einnahmen und Ausgaben in einer praktischen Übersicht.",
  },
  {
    image: doc_preview_building,
    title: "Optimiert für verschiedene Immobilientypen",
    text: "Individualisiert für Eigentumswohnungen und Mehrfamilienhäuser.",
  },
];

export default function BetriebskostenabrechnungPage() {
  return (
    <div className="py-3 px-5 h-[calc(100dvh-61px)] max-h-[calc(100dvh-61px)]">
      <Breadcrumb
        backTitle="Abrechnung"
        link={ROUTE_DASHBOARD}
        title="Betriebskostenabrechnung"
      />
      <ContentWrapper className="max-h-[90%] gap-14 grid grid-cols-2">
        <div className="flex items-start px-12 max-w-2xl justify-center flex-col gap-10 rounded-2xl bg-white">
          <h1 className="text-admin_dark_text text-4xl">
            In wenigen Schritten zur fertigen Abrechnung
          </h1>
          {items.map((item) => (
            <div
              className="flex items-center justify-start gap-2.5"
              key={item.title}>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="max-w-14 max-h-14"
                src={item.image}
                alt="item image"
              />
              <div>
                <p className="font-bold text-base text-admin_dark_text">
                  {item.title}
                </p>
                <p className="text-base text-admin_dark_text ">{item.text}</p>
              </div>
            </div>
          ))}
          <OpenItitalDocDialogButton
            dialogName="operating_costs_create"
            buttonText="Jetzt Betriebskosten abrechnen"
          />
        </div>
        <div className="space-y-7">
          <p className="text-xl text-[#6d6d6d]">Vorschau</p>
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="w-full max-h-[624px]"
            src={heating_bill_preview}
            alt="heating_bill_preview"
          />
        </div>
      </ContentWrapper>
    </div>
  );
}
