import {
  ROUTE_DATENSCHUTZHINWEISE,
  ROUTE_FUNKTIONEN,
  ROUTE_GERAETE,
  ROUTE_IMPRESSUM,
} from "@/routes/routes";
import { footer_logo, insta, linkedin, xIcon, youtube } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import FooterLink from "./FooterLink";
import type { FooterLinkGroupType, FooterLinkType } from "@/types";
import FooterEmailForm from "./FooterEmailForm";
import { format } from "date-fns";

export const simpleFooterLinks: FooterLinkType[] = [
  {
    url: "#",
    isNeu: false,
    text: "Über uns",
  },
  {
    url: "#",
    isNeu: false,
    text: "Karriere",
  },
  {
    url: "#",
    isNeu: false,
    text: "Handwerker",
  },
  {
    url: "#",
    isNeu: false,
    text: "Produkte",
  },
  {
    url: "#",
    isNeu: false,
    text: "Städte",
  },
  {
    url: "#",
    isNeu: false,
    text: "Kunden",
  },
  {
    url: "#",
    isNeu: false,
    text: "Lösungen",
  },
  {
    url: "#",
    isNeu: false,
    text: "Funktionen",
  },
  {
    url: ROUTE_FUNKTIONEN,
    isNeu: false,
    text: "Dienstleistung",
  },
  {
    url: "#",
    isNeu: false,
    text: "Unternehmen",
  },
];

export const gerateLinksGroup: FooterLinkGroupType = {
  title: "Geräte",
  mainUrl: ROUTE_GERAETE,
  groupLinks: [
    {
      url: "#",
      text: "Kaltwasser",
      isNeu: false,
    },
    {
      url: "#",
      text: "Warmwasser",
      isNeu: false,
    },
    {
      url: "#",
      text: "Heizung",
      isNeu: false,
    },
    {
      url: "#",
      text: "Rauchmelder",
      isNeu: false,
    },
    {
      url: "#",
      text: "Gas",
      isNeu: false,
    },
  ],
};

export const dienstleistungLinksGroup: FooterLinkGroupType = {
  title: "Dienstleistung",
  mainUrl: ROUTE_FUNKTIONEN,
  groupLinks: [
    {
      url: "#",
      text: "Betriebskostenab",
      isNeu: false,
    },
    {
      url: "#",
      text: "Heizkostenab",
      isNeu: false,
    },
    {
      url: "#",
      text: "Verbrauchsinfo",
      isNeu: false,
    },
    {
      url: "#",
      text: "Energieausweis",
      isNeu: false,
    },
    {
      url: "#",
      text: "Großprojekte",
      isNeu: false,
    },
  ],
};

export const standorteLinksGroup: FooterLinkGroupType = {
  title: "Standorte",
  mainUrl: "#",
  groupLinks: [
    {
      url: "#",
      text: "Berlin",
      isNeu: false,
    },
    {
      url: "#",
      text: "Hamburg",
      isNeu: false,
    },
    {
      url: "#",
      text: "München",
      isNeu: false,
    },
    {
      url: "#",
      text: "Frankfurt",
      isNeu: false,
    },
    {
      url: "#",
      text: "Leipzig",
      isNeu: true,
    },
    {
      url: "#",
      text: "Stuttgart",
      isNeu: false,
    },
    {
      url: "#",
      text: "Hannover",
      isNeu: false,
    },
    {
      url: "#",
      text: "Bielefeld",
      isNeu: false,
    },
    {
      url: "#",
      text: "Wolfsburg",
      isNeu: true,
    },
    {
      url: "#",
      text: "Gera",
      isBeliebt: true,
    },
    {
      url: "#",
      text: "Köln",
      isNeu: false,
    },
    {
      url: "#",
      text: "Ihre Stadt",
      isNeu: false,
    },
  ],
};

export const rechtlichesLinksGroup: FooterLinkGroupType = {
  title: "Rechtliches",
  mainUrl: "#",
  groupLinks: [
    {
      url: "#",
      text: "Die Neuerung",
      isNeu: true,
    },
    {
      url: "#",
      text: "Rohrwärme (VDI 2077)",
      isNeu: false,
    },
    {
      url: "#",
      text: "Rauchmelderpflicht",
      isNeu: false,
    },
    {
      url: "#",
      text: "Mess- und Eichverordnung",
      isNeu: false,
    },
    {
      url: "#",
      text: "Der CO2- Kostenrechner",
      isNeu: false,
    },
    {
      url: "#",
      text: "BAFA Förderantrag",
      isNeu: false,
    },
    {
      url: "#",
      text: "Kostenaufteilungsrechner",
      isNeu: false,
    },
    {
      url: "#",
      text: "Heizkostenverordnung",
      isNeu: false,
    },
    {
      url: "#",
      text: "Funkmesserpflicht",
      isNeu: false,
    },
    {
      url: "#",
      text: "Eichverordnung",
      isNeu: false,
    },
    {
      url: "#",
      text: "Energieausweis",
      isNeu: false,
    },
  ],
};

export const kundenLinksGroup: FooterLinkGroupType = {
  title: "Kunden",
  mainUrl: "#",
  groupLinks: [
    {
      url: "#",
      text: "Hausverwaltungen",
      isNeu: false,
    },
    {
      url: "#",
      text: "Private Equity",
      isNeu: false,
    },
    {
      url: "#",
      text: "Wohnungsgesellschaften",
      isNeu: false,
    },
    {
      url: "#",
      text: "Hauseigentümer",
      isNeu: false,
    },
  ],
};

export const datenschutzLinksGroup: FooterLinkGroupType = {
  title: "Datenschutz",
  mainUrl: ROUTE_DATENSCHUTZHINWEISE,
  groupLinks: [
    {
      url: ROUTE_DATENSCHUTZHINWEISE,
      text: "AGB",
      isNeu: false,
    },
    {
      url: ROUTE_IMPRESSUM,
      text: "Impressum",
      isNeu: false,
    },
    {
      url: ROUTE_DATENSCHUTZHINWEISE,
      text: "Datenschutz",
      isNeu: false,
    },
  ],
};

export const newsInfoLinksGroup: FooterLinkGroupType = {
  title: "News & Info",
  mainUrl: "#",
  groupLinks: [
    {
      url: "#",
      text: "Blog",
      isBeliebt: true,
    },
    {
      url: "#",
      text: "Newsletter",
      isNeu: false,
    },
    {
      url: "#",
      text: "Webinare",
      isNeu: false,
    },
    {
      url: "#",
      text: "Vororttermin",
      isNeu: true,
    },
    {
      url: "#",
      text: "Downloads",
      isNeu: false,
    },
    {
      url: "#",
      text: "FAQ",
      isNeu: false,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="px-[72px] max-megalarge:px-6 max-medium:px-5 bg-card_dark_bg pt-16 pb-12">
      <div className="flex items-center justify-between gap-5 max-large:flex-wrap max-large:gap-3">
        {simpleFooterLinks.map((link) => (
          <Link
            className="text-lg leading-[21px] font-bold text-dark_text"
            href={link.url}
            key={link.text}>
            {link.text}
          </Link>
        ))}
      </div>
      <div className="border-b border-dark_green/10 pb-16">
        <div className="mt-6 grid grid-cols-5 gap-10 max-megalarge:gap-4 max-large:flex max-large:items-start max-large:justify-between max-large:flex-wrap">
          <div className="space-y-9">
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={gerateLinksGroup.mainUrl}>
                {gerateLinksGroup.title}
              </Link>
              {gerateLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={dienstleistungLinksGroup.mainUrl}>
                {dienstleistungLinksGroup.title}
              </Link>
              {dienstleistungLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Link
              className="text-lg leading-[21px] font-bold text-dark_text"
              href={standorteLinksGroup.mainUrl}>
              {standorteLinksGroup.title}
            </Link>
            {standorteLinksGroup.groupLinks.map((link) => (
              <FooterLink key={link.text} link={link} />
            ))}
          </div>
          <div className="space-y-2.5">
            <Link
              className="text-lg leading-[21px] font-bold text-dark_text"
              href={rechtlichesLinksGroup.mainUrl}>
              {rechtlichesLinksGroup.title}
            </Link>
            {rechtlichesLinksGroup.groupLinks.map((link) => (
              <FooterLink key={link.text} link={link} />
            ))}
          </div>
          <div className="space-y-9">
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={kundenLinksGroup.mainUrl}>
                {kundenLinksGroup.title}
              </Link>
              {kundenLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={datenschutzLinksGroup.mainUrl}>
                {datenschutzLinksGroup.title}
              </Link>
              {datenschutzLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Link
              className="text-lg leading-[21px] font-bold text-dark_text"
              href={newsInfoLinksGroup.mainUrl}>
              {newsInfoLinksGroup.title}
            </Link>
            {newsInfoLinksGroup.groupLinks.map((link) => (
              <FooterLink key={link.text} link={link} />
            ))}
          </div>
        </div>
      </div>
      <div className="border-b border-dark_green/10 py-8 flex items-center justify-between max-megalarge:gap-4 max-megalarge:flex-wrap max-megalarge:justify-start">
        <div className="max-medium:hidden">
          <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="block mb-2"
            src={footer_logo}
            alt="footer logo"
          />
          <p className="max-w-[180px] text-dark_text/50 text-lg leading-[21px]">
            Heidi Systems GmbH Rungestrasse 21 10179 Berlin
          </p>
        </div>
        <div className="text-dark_text text-[30px] leading-9 max-w-lg max-medium:text-[19px] max-medium:leading-[22px] max-large:max-w-full">
          Werde Teil der Revolution: Schon mehr als 15.000+ Geräte erfolgreich
          installiert.
        </div>
        <FooterEmailForm />
      </div>
      <div className="pt-8 flex items-start justify-between max-large:flex-wrap max-medium:flex-col-reverse max-medium:items-center max-large:justify-start max-large:gap-3 max-medium:gap-8">
        <p className="text-dark_text text-xs leading-[14px] max-w-4xl">
          © {format(new Date(), "yyyy")} „Heidi“ und das Heidi-Logo sind
          eingetragene Markenzeichen unseres Unternehmens. Die Heidi Commercial
          und die Heidi Visa Corporate werden von der Sutton Bank bzw. der
          Celtic Bank (Mitglieder der FDIC) herausgegeben. Wir berechnen die
          durchschnittlichen Einsparungen als Prozentsatz des Gesamumsatzes
          eines beispielhaften Kunden, der Heidi-Funktionen zur Reduzierung von
          Geschäftsausgaben nutzt. Beachten Sie, dass es sich hierbei um eine
          Schätzung, nicht um eine Garantie handelt. Einsparungen können
          beispielsweise durch weniger Zeitaufwand für maneulle
          Spesenabrechnungen, finanzielle Vorteile durch Cashback oder andere
          Prämien, intelligente Ausgabenüberwachung und das Eliminieren von
          Kosten alternativer Lösungen entstehen. Unsere Berechnungen basieren
          auf Plattformdaten, Branchenforschung, Kundenbefragungen und
          Informationen zu alternativen Optionen. Ihre tatsächlichen
          Einsparungen können variieren. Für weitere Details besuchen Sie bitte
          unsere Nutzungsbedingungen. Lesen Sie unsere redaktionellen
          Richtlinien und Datenschutzbestimmungen. Heidi Corporation - NMLS
          3241435, Heidi Corporation - NMLS 2431378
        </p>
        <div className="flex items-center justify-end gap-3">
          <Link href="https://www.youtube.com/channel/UCv0HIBEJGgD_vNRIkNg6--Q">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={youtube}
              alt="youtube"
            />
          </Link>
          <Link href="https://x.com/Heidisystems">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={xIcon}
              alt="x"
            />
          </Link>
          <Link href="https://www.linkedin.com/company/heidisystems/">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={linkedin}
              alt="linkedin"
            />
          </Link>
          <Link href="https://www.instagram.com/heidisystems/">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={insta}
              alt="insta"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
