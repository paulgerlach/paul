import {
  ROUTE_DATENSCHUTZHINWEISE,
  ROUTE_FUNKTIONEN,
  ROUTE_GERAETE,
  ROUTE_IMPRESSUM,
  ROUTE_BLOG,
  ROUTE_HOME,
} from "@/routes/routes";
import {
  footer_logo,
  insta,
  linkedin,
  xIcon,
  youtube,
  vdiv_footer,
} from "@/static/icons";
import Image from "next/image";
import Link from "next/link";
import FooterLink from "./FooterLink";
import type { FooterLinkGroupType } from "@/types";
import FooterEmailForm from "./FooterEmailForm";

export const gerateLinksGroup: FooterLinkGroupType = {
  title: "Geräte",
  mainUrl: ROUTE_GERAETE,
  groupLinks: [
    {
      url: ROUTE_GERAETE,
      text: "Kaltwasser",
      isNeu: false,
    },
    {
      url: ROUTE_GERAETE,
      text: "Warmwasser",
      isNeu: false,
    },
    {
      url: ROUTE_GERAETE,
      text: "Heizung",
      isNeu: false,
    },
    {
      url: ROUTE_GERAETE,
      text: "Rauchmelder",
      isNeu: false,
    },
    {
      url: ROUTE_GERAETE,
      text: "Gas",
      isNeu: false,
    },
  ],
};

export const DienstleistungenLinksGroup: FooterLinkGroupType = {
  title: "Dienstleistungenen",
  mainUrl: ROUTE_FUNKTIONEN,
  groupLinks: [
    {
      url: ROUTE_FUNKTIONEN,
      text: "Unterjährige Verbrauchserfassung",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Heizkostenabrechnung",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Verbrauchsinformation",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Energieausweis",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Großprojekte",
      isNeu: false,
    },
  ],
};

export const standorteLinksGroup: FooterLinkGroupType = {
  title: "Standorte",
  mainUrl: ROUTE_FUNKTIONEN,
  groupLinks: [
    {
      url: ROUTE_FUNKTIONEN,
      text: "Berlin",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Hamburg",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "München",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Frankfurt",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Leipzig",
      isNeu: true,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Stuttgart",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Hannover",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Bielefeld",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Wolfsburg",
      isNeu: true,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Gera",
      isBeliebt: true,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Köln",
      isNeu: false,
    },
    {
      url: ROUTE_FUNKTIONEN,
      text: "Ihre Stadt",
      isNeu: false,
    },
  ],
};

export const rechtlichesLinksGroup: FooterLinkGroupType = {
  title: "Rechtliches",
  mainUrl: ROUTE_BLOG,
  groupLinks: [
    {
      url: ROUTE_BLOG,
      text: "Die Neuerung",
      isNeu: true,
    },
    {
      url: ROUTE_BLOG,
      text: "Rohrwärme (VDI 2077)",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Rauchmelderpflicht",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Mess- und Eichverordnung",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Der CO2- Kostenrechner",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "BAFA Förderantrag",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Kostenaufteilungsrechner",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Heizkostenverordnung",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Funkmesserpflicht",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Eichverordnung",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Energieausweis",
      isNeu: false,
    },
  ],
};

export const kundenLinksGroup: FooterLinkGroupType = {
  title: "Kunden",
  mainUrl: ROUTE_HOME,
  groupLinks: [
    {
      url: ROUTE_HOME,
      text: "Hausverwaltungen",
      isNeu: false,
    },
    {
      url: ROUTE_HOME,
      text: "Private Equity",
      isNeu: false,
    },
    {
      url: ROUTE_HOME,
      text: "Wohnungsgesellschaften",
      isNeu: false,
    },
    {
      url: ROUTE_HOME,
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
  mainUrl: ROUTE_BLOG,
  groupLinks: [
    {
      url: ROUTE_BLOG,
      text: "Blog",
      isBeliebt: true,
    },
    {
      url: ROUTE_BLOG,
      text: "Newsletter",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Webinare",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "Vororttermin",
      isNeu: true,
    },
    {
      url: ROUTE_BLOG,
      text: "Downloads",
      isNeu: false,
    },
    {
      url: ROUTE_BLOG,
      text: "FAQ",
      isNeu: false,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="px-[72px] max-megalarge:px-6 max-medium:px-5 bg-card_dark_bg pt-16 pb-12">
      {/*<div className="flex items-center justify-between gap-5 max-large:flex-wrap max-large:gap-3">
        {simpleFooterLinks.map((link) => (
          <Link
            className="text-lg leading-[21px] font-bold text-dark_text"
            href={link.url}
            key={link.text}
          >
            {link.text}
          </Link>
        ))}
      </div>*/}
      <div className="border-b border-dark_green/10 pb-16">
        <div className="mt-6 grid grid-cols-5 gap-10 max-megalarge:gap-4 max-large:flex max-large:items-start max-large:justify-between max-large:flex-wrap">
          <div className="space-y-9">
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={gerateLinksGroup.mainUrl}
              >
                {gerateLinksGroup.title}
              </Link>
              {gerateLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={DienstleistungenLinksGroup.mainUrl}
              >
                {DienstleistungenLinksGroup.title}
              </Link>
              {DienstleistungenLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            <Link
              className="text-lg leading-[21px] font-bold text-dark_text"
              href={standorteLinksGroup.mainUrl}
            >
              {standorteLinksGroup.title}
            </Link>
            {standorteLinksGroup.groupLinks.map((link) => (
              <FooterLink key={link.text} link={link} />
            ))}
          </div>
          <div className="space-y-2.5">
            <Link
              className="text-lg leading-[21px] font-bold text-dark_text"
              href={rechtlichesLinksGroup.mainUrl}
            >
              {rechtlichesLinksGroup.title}
            </Link>
            {rechtlichesLinksGroup.groupLinks.map((link) => (
              <FooterLink key={link.text} link={link} />
            ))}
          </div>
          <div className="space-y-9 flex flex-col justify-between">
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={kundenLinksGroup.mainUrl}
              >
                {kundenLinksGroup.title}
              </Link>
              {kundenLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={datenschutzLinksGroup.mainUrl}
              >
                {datenschutzLinksGroup.title}
              </Link>
              {datenschutzLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div className="space-y-2.5">
              <Link
                className="text-lg leading-[21px] font-bold text-dark_text"
                href={newsInfoLinksGroup.mainUrl}
              >
                {newsInfoLinksGroup.title}
              </Link>
              {newsInfoLinksGroup.groupLinks.map((link) => (
                <FooterLink key={link.text} link={link} />
              ))}
            </div>
            <div className="flex items-start justify-center flex-col">
              <p className="text-xs text-dark_text">Kooperationspartner:</p>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="block mb-2 max-h-[92px] max-w-[150px]"
                src={vdiv_footer}
                alt="footer logo"
              />
            </div>
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
          “Die Heidi Systems GmbH erbringt Messdienstleistungen sowie digitale
          Verbrauchserfassungs- und Abrechnungslösungen nach Maßgabe der jeweils
          geltenden gesetzlichen Bestimmungen. Alle auf dieser Website
          bereitgestellten Inhalte dienen ausschließlich der allgemeinen
          Information und begründen weder einen Rechtsanspruch noch eine
          Verpflichtung. Trotz sorgfältiger Prüfung wird keine Haftung für die
          Richtigkeit, Vollständigkeit oder Aktualität der dargestellten
          Informationen übernommen. Haftungsansprüche gegen die Heidi Systems
          GmbH aufgrund von materiellen oder immateriellen Schäden sind – soweit
          gesetzlich zulässig – ausgeschlossen. Sämtliche auf dieser Website
          verwendeten Texte, Marken, Darstellungen und technischen Inhalte
          unterliegen dem Urheberrecht und dürfen nur mit schriftlicher
          Zustimmung verwendet werden. Verbindliche Aussagen zu Leistungen,
          Preisen oder technischen Spezifikationen erfolgen ausschließlich im
          Rahmen eines individuellen Vertragsverhältnisses.”
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
