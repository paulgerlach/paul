import { ROUTE_FRAGEBOGEN, ROUTE_KONTAKT } from "@/routes/routes";
import { checkmark_bold } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

export default function PriceCards() {
  return (
    <div className="px-8 max-medium:px-5">
      <div className="grid grid-cols-3 gap-5 max-medium:grid-cols-1">
        <div className="relative border-dark_green/20 border rounded-base px-7 py-12">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-9 rounded-[20px] bg-green">
            5% sparen
          </span>
          <p className="text-[25px] text-dark_text mb-2 text-center">Heidi</p>
          <p className="text-center text-[15px] mb-7 text-dark_text/20">
            ab <span className="text-dark_text text-[40px]">€69</span> pro Jahr
          </p>
          <p className="max-w-xs mx-auto text-center text-dark_text text-[15px] mb-9">
            Preis für einen Heizzähler. Empfholen für Eigenheimbesitzer
          </p>
          <Link
            href={ROUTE_KONTAKT}
            className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10">
            Beraten lassen
          </Link>
          <Link
            href={ROUTE_FRAGEBOGEN}
            className="text-white bg-dark_green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80">
            Jetzt starten
          </Link>
          <p className="pt-6 border-t border-dark_green/20 font-bold text-lg text-dark_text mb-4">
            Heidi features:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Kostenfreie Installation der Geräte
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Kostenfreie Wartung
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Verbrauchsdaten in Echtzeit
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Weltweite Kontrolle und Daten
            </li>
          </ul>
        </div>
        <div className="relative border-dark_green/20 border rounded-base px-7 py-12">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-9 rounded-[20px] bg-green">
            25% sparen
          </span>
          <p className="text-[25px] text-dark_text mb-2 text-center">
            Heidi
            <span className="py-0.5 ml-1.5 px-2 rounded-base bg-green text-dark_text text-lg">
              Plus
            </span>
          </p>
          <p className="text-center text-[15px] mb-7 text-dark_text/20">
            ab <span className="text-dark_text text-[40px]">€49</span> pro Jahr
          </p>
          <p className="max-w-xs mx-auto text-center text-dark_text text-[15px] mb-9">
            Sofern Sie mehr als 4 Wohnung betreuen, lohnt es sich Heidi plus zu
            buchen.
          </p>
          <Link
            href={ROUTE_KONTAKT}
            className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10">
            Angebot sichern
          </Link>
          <Link
            href={ROUTE_FRAGEBOGEN}
            className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80">
            Kostenvoranschlag erhalten
          </Link>
          <p className="pt-6 border-t border-dark_green/20 font-bold text-lg text-dark_text mb-4">
            Heidi features:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Kostenfreie Installation der Geräte
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Kostenfreie Wartung
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Verbrauchsdaten in Echtzeit
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Betriebskostenabrechnung
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Weltweite Kontrolle und Daten
            </li>
          </ul>
        </div>
        <div className="relative border-dark_green/20 border rounded-base px-7 py-12">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 py-1 px-9 rounded-[20px] bg-[#EFEEEC]">
            personalisiert
          </span>
          <p className="text-[25px] text-dark_text mb-2 text-center">
            Heidi
            <span className="py-0.5 ml-1.5 px-2 rounded-base bg-[#D9D9D9] text-dark_text text-lg">
              Großkunde
            </span>
          </p>
          <p className="text-center text-[15px] mb-7 text-dark_text/20">
            Kontaktieren sie uns für eine Angbeot
          </p>
          <p className="max-w-xs mx-auto text-center text-dark_text text-[15px] mt-16 max-megalarge:mt-10 mb-9">
            Preis für einen Heizzähler. Empfholen für Wohnungsgenossenschafften
            und
          </p>
          <Link
            href={ROUTE_KONTAKT}
            className="text-dark_text flex mb-2 items-center justify-center w-full py-4 border border-dark_green/20 rounded-base text-lg transition hover:border-dark_green/10">
            Angebot sichern
          </Link>
          <Link
            href={ROUTE_FRAGEBOGEN}
            className="text-white bg-green flex items-center justify-center w-full py-4 border border-transparent mb-9 rounded-base text-lg transition hover:opacity-80">
            Kostenvoranschlag erhalten
          </Link>
          <p className="pt-6 border-t border-dark_green/20 font-bold text-lg text-dark_text mb-4">
            Heidi features:
          </p>
          <ul className="space-y-4">
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Kostenfreie Installation der Geräte
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Kostenfreie Wartung
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Verbrauchsdaten in Echtzeit
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Betriebskostenabrechnung
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Weltweite Kontrolle und Daten
            </li>
            <li className="flex items-center justify-start gap-3.5 text-[15px] text-dark_text/50">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={checkmark_bold}
                alt="checkmark bold"
              />
              Persönlicher Ansprechpartner
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
