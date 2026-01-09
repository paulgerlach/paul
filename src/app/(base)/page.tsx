import MobileDifference from "@/components/Basic/MobileDifference/MobileDifference";
import Subscription from "@/components/Basic/Subscription/Subscription";
import HomeHero from "@/components/Hero/HomeHero";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import FunctionsList from "@/components/Swipers/FunctionsList";
import FunctionsSwiper from "@/components/Swipers/FunctionsSwiper";
import NewsList from "@/components/Swipers/NewsList";
import NewsSwiper from "@/components/Swipers/NewsSwiper";
import PersonSwiper from "@/components/Swipers/PersonSwiper";
import { ROUTE_FRAGEBOGEN, ROUTE_FUNKTIONEN } from "@/routes/routes";
import {
  checkmarks3,
  clock,
  counter,
  doc,
  doc_phone,
  eu_gdpr,
  eu_lock,
  instruments,
  list2,
  right_arrow,
  weight,
  werne_green,
  wagner_green,
  vitec_green,
  schleicher_green,
  raum_green,
  niesen_green,
  neckar_green,
  idgim_green,
  hsp_green,
  harte_green,
  dumax_green,
  berlin_bear_green,
  quarterback_green,
  progera_green,
} from "@/static/icons";
import animation1 from "@/animations/Animation_1.json";
import animation2 from "@/animations/Animation_2.json";
import animation3 from "@/animations/Animation_3.json";
import AuthRedirect from "@/components/Basic/AuthRedirect";
import Image from "next/image";
import Link from "next/link";
import ChatBotContainer from "@/components/Common/ChatBot";
import { supabaseServer } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/components/Basic/Loading/Loading";

export default async function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://heidisystems.com/#organization",
        name: "Heidi Systems",
        url: "https://heidisystems.com",
        logo: {
          "@type": "ImageObject",
          url: "https://heidisystems.com/admin_logo.png",
        },
        description:
          "Digitale Erfassung aller Verbrauchsdaten im Gebäude. Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+49-30-555-12345",
          contactType: "customer service",
          availableLanguage: ["de", "en"],
        },
        sameAs: [],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://heidisystems.com/#localbusiness",
        name: "Heidi Systems",
        image: "https://heidisystems.com/admin_logo.png",
        description:
          "Modernste Funkzähler-Technologie für digitale Erfassung von Warm-, Kaltwasser- und Heizungsverbrauch. Kostenlose Installation und automatisierte Betriebskostenabrechnung.",
        address: {
          "@type": "PostalAddress",
          addressCountry: "DE",
          addressLocality: "Deutschland",
        },
        priceRange: "$$",
        url: "https://heidisystems.com",
        telephone: "+49-30-555-12345",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://heidisystems.com/#website",
        url: "https://heidisystems.com",
        name: "Heidi Systems",
        description:
          "Digitale Erfassung aller Verbrauchsdaten im Gebäude Heidi Systems bündelt alle Energiedaten Ihres Portfolios und vereinfacht die Betriebs- und Heizkostenabrechnung.",
        publisher: {
          "@id": "https://heidisystems.com/#organization",
        },
        inLanguage: "de-DE",
      },
      {
        "@type": "Service",
        "@id": "https://heidisystems.com/#service",
        serviceType: "Energiemanagement und Verbrauchserfassung",
        provider: {
          "@id": "https://heidisystems.com/#organization",
        },
        areaServed: "DE",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Heidi Systems Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Kostenfreie Installation von Funkzählern",
                description:
                  "Umrüstung auf fernablesbare Funkzähler für Warmwasser, Kaltwasser und Heizung - komplett kostenfrei",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Automatisierte Betriebskostenabrechnung",
                description:
                  "Digitale Erfassung und automatische Verarbeitung aller Verbrauchsdaten für präzise Nebenkostenabrechnungen",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Echtzeit-Dashboard und Verbrauchsanalyse",
                description:
                  "Übersichtliches Dashboard zur Überwachung aller Energiedaten in Echtzeit",
              },
            },
          ],
        },
      },
    ],
  };

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isExistingClient = !!user;

  return (
    <Suspense fallback={<Loading />}>
      <main id="content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <AuthRedirect />
        <HomeHero />
        <div className="mt-28 px-[140px] max-megalarge:px-16 max-large:px-6 max-medium:px-5 hero max-small:mt-6">
          <h2 className="section-title hero-title hidden max-large:block text-[50px] max-medium:text-4xl max-small:text-3xl leading-[60px] max-medium:leading-tight mb-10 max-small:mb-12 text-center relative text-dark_text">
            Jetzt Vorteile sichern
          </h2>
          <div className="grid mb-32 hero-1 grid-cols-4 gap-20 max-large:gap-8 items-stretch max-medium:grid-cols-2 max-medium:gap-16 justify-center max-small:grid-cols-1 max-small:gap-14">
            <div className="space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
              <span className="circleIcon inline-block shrink-0 max-small:!w-9 max-small:!h-9">
                <Image
                  width={25}
                  height={25}
                  priority
                  sizes="25px"
                  className="size-[25px] max-small:size-[18px]"
                  src={weight}
                  alt="weight"
                />
              </span>
              <p className="text-[26px] leading-tight max-small:text-lg text-dark_text font-bold max-medium:text-center">
                EU-Vorschriften
                <br className="max-medium:hidden" /> einhalten
              </p>
              <p className="text-lg max-small:text-sm leading-relaxed text-dark_text max-medium:text-center">
                Mit unseren fernablesbaren Zählern erfüllen Sie alle
                gesetzlichen Vorgaben und profitieren gleichzeitig von höherer
                Effizienz und Transparenz. Modernste Energiemanagement-
                Technologie sorgt für eine zukunftssichere Lösung.
              </p>
              <a
                href="/datenschutzhinweise"
                className="hidden max-medium:block text-link underline text-sm leading-4"
              >
                mehr erfahren
              </a>
            </div>
            <div className="space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
              <span className="circleIcon inline-block shrink-0 max-small:!w-9 max-small:!h-9">
                <Image
                  width={25}
                  height={25}
                  priority
                  sizes="25px"
                  className="size-[25px] max-small:size-[18px]"
                  src={clock}
                  alt="clock"
                />
              </span>
              <p className="text-[26px] leading-tight max-small:text-lg text-dark_text font-bold max-medium:text-center">
                Zeit- und
                <br className="max-medium:hidden" /> Kostenersparnis
              </p>
              <p className="text-lg max-small:text-sm leading-relaxed text-dark_text max-medium:text-center">
                Reduzieren Sie manuelle Aufwände und sparen Sie wertvolle Zeit.
                Unsere automatisierten Prozesse übernehmen die
                Verbrauchserfassung effizient und zuverlässig.
              </p>
              <a
                href="#"
                className="border hidden max-medium:flex border-green bg-transparent py-2 px-4 items-center justify-center text-sm text-green rounded-halfbase duration-300 hover:opacity-80"
              >
                Kosteneinsparung berechnen
              </a>
            </div>
            <div className="space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
              <span className="circleIcon inline-block shrink-0 max-small:!w-9 max-small:!h-9">
                <Image
                  width={25}
                  height={25}
                  priority
                  sizes="25px"
                  className="size-[25px] max-small:size-[18px]"
                  src={instruments}
                  alt="instruments"
                />
              </span>
              <p className="text-[26px] leading-tight max-small:text-lg text-dark_text font-bold max-medium:text-center">
                Kostenfreie
                <br className="max-medium:hidden" /> Installation
              </p>
              <p className="text-lg max-small:text-sm leading-relaxed text-dark_text max-medium:text-center">
                Steigen Sie ohne Mehrkosten auf unsere innovative Technologie
                um. Die Umrüstung erfolgt für Sie völlig kostenlos und ohne
                Aufwand.
              </p>
              <Link
                href="/fragebogen"
                className="border hidden max-medium:flex border-green bg-green py-2 px-4 items-center justify-center text-sm text-white rounded-halfbase duration-300 hover:opacity-80"
              >
                Jetzt installieren lassen
              </Link>
            </div>
            <div className="space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
              <span className="circleIcon inline-block shrink-0 max-small:!w-9 max-small:!h-9">
                <Image
                  width={25}
                  height={25}
                  priority
                  sizes="25px"
                  className="size-[25px] max-small:size-[18px]"
                  src={doc}
                  alt="doc"
                />
              </span>
              <p className="text-[26px] leading-tight max-small:text-lg text-dark_text font-bold max-medium:text-center">
                Heizkostenabrechnung
                <br className="max-medium:hidden" /> erstellen
              </p>
              <p className="text-lg max-small:text-sm leading-relaxed text-dark_text max-medium:text-center">
                Unsere drahtlosen Messgeräte erfassen alle Verbrauchsdaten
                automatisch und bereiten sie für eine präzise und effiziente
                Nebenkostenabrechnung auf.
              </p>
              <a
                href="/datenschutzhinweise"
                className="hidden max-medium:block text-link underline text-sm leading-4"
              >
                mehr erfahren
              </a>
            </div>
          </div>
        </div>
        <div className="grid gap-4 hero-3 grid-cols-3 max-medium:flex max-medium:flex-col max-medium:items-start max-medium:justify-start max-medium:space-y-4">
          <p className="col-span-1 text-lg text-dark_text max-medium:text-center font-bold">
            Die Wahl führender Innovatoren und Branchenführer
          </p>
          <div className="grid col-span-2 items-center justify-center grid-cols-4 max-medium:col-span-1 max-medium:grid-cols-3 max-medium:justify-items-center gap-x-10 gap-y-8">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-10"
              src={berlin_bear_green}
              alt="berlinBear"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto w-24 h-8"
              src={dumax_green}
              alt="dumax"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto w-24 h-8"
              src={harte_green}
              alt="harte"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto w-20 h-8"
              src={hsp_green}
              alt="hsp"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-4"
              src={idgim_green}
              alt="idgim"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-8"
              src={raum_green}
              alt="raum"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-28 h-14"
              src={schleicher_green}
              alt="schleicher_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-8"
              src={vitec_green}
              alt="vitec"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-32 h-8"
              src={wagner_green}
              alt="wagner"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-8"
              src={werne_green}
              alt="werne_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-8"
              src={neckar_green}
              alt="neckar_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-8"
              src={niesen_green}
              alt="niesen_green"
            />
          </div>
        </div>
        <div className="hero-2 max-medium:px-4">
          <h2 className="section-title max-small:text-2xl max-small:leading-7 text-[50px] leading-[60px] mb-5 text-center relative text-dark_text">
            Jetzt auf Funkzähler umsteigen
          </h2>
          <p className="text-dark_text leading-[19.2px] text-base max-small:text-sm mb-16 max-w-3xl mx-auto text-center">
            Revolutionieren Sie Ihr Energiemanagement: Reduzieren Sie Kosten,
            steigern Sie die Effizienz und profitieren Sie von automatisierten
            Überwachungs- und Steuerungslösungen für eine zukunftssichere
            Verbrauchserfassung.
          </p>
          <div className="grid grid-cols-2 max-medium:grid-cols-1 mb-[18px] gap-6">
            <div className="px-5 pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-end">
              <p className="text-[25px] max-small:text-xl mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Kostenfreie Installation
              </p>
              <p className="text-center text-dark_text text-base max-small:text-sm leading-[19.2px]">
                Wir rüsten Sie kostenlos mit modernsten Funkzählern zur
                digitalen Erfassung Ihres Warm-, Kaltwasser- und
                Heizungsverbrauchs aus.
              </p>
              <Link
                href={ROUTE_FRAGEBOGEN}
                className="my-4 w-fit mx-auto border border-dark_green/20 flex items-center justify-center rounded-base py-3 px-6 text-dark_text/20 text-base leading-[19.2px] duration-300 hover:bg-green hover:border-green hover:text-white"
              >
                Jetzt umrüsten lassen
              </Link>
              <div className="bg-white/90 flex items-center justify-center pt-[60px] px-[116px] max-megalarge:px-20 rounded-t-[20px]">
                <Image
                  width={300}
                  height={400}
                  priority
                  sizes="(max-width: 768px) 100vw, 300px"
                  src={counter}
                  alt="counter"
                />
              </div>
            </div>
            <div className="px-5 pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-end">
              <p className="text-[25px] max-small:text-xl mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Dokumenten-Management
              </p>
              <p className="text-center text-dark_text text-base max-small:text-sm leading-[19.2px]">
                Alle Verbrauchsdaten werden automatisch erfasst und stehen
                Ihnen direkt für die Betriebskostenabrechnung zur Verfügung.
              </p>
              <Link
                href={ROUTE_FUNKTIONEN}
                className="block mb-10 text-center w-fit mx-auto text-green underline text-base leading-[19.2px]"
              >
                mehr erfahren
              </Link>
              <Image
                width={400}
                height={300}
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                src={doc_phone}
                alt="screenshot"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 max-medium:grid-cols-1 mb-20 gap-[18px]">
            <div className="px-[25px] overflow-hidden pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-between">
              <p className="text-[25px] max-small:text-xl relative z-[2] mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Dashboard
              </p>
              <p className="text-center relative z-[2] text-dark_text text-base max-small:text-sm leading-[19.2px] mb-12">
                Alle Verbrauchswerte für Warmwasser, Kaltwasser und Heizkosten
                in einer übersichtlichen Darstellung.
              </p>
              <LazyLottie
                animationData={animation3}
                id="animation3"
                wrapperClassName="overflow-hidden relative z-[0]"
              />
            </div>
            <div className="pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-between">
              <p className="text-[25px] max-small:text-xl mb-2 text-dark_text leading-[30px] text-center font-bold break-all px-[25px]">
                Digitale Funkablesung
              </p>
              <p className="text-center text-dark_text px-[25px] text-base max-small:text-sm leading-[19.2px]">
                Erfassen Sie Verbrauchsdaten über alle Sparten hinweg –
                komplett ohne manuelles Ablesen oder Vor-Ort-Termine.
              </p>
              <Link
                href={ROUTE_FUNKTIONEN}
                className="block mb-10 text-center w-fit mx-auto text-green underline text-base leading-[19.2px]"
              >
                mehr erfahren
              </Link>
              <LazyLottie
                animationData={animation2}
                id="animation21"
                wrapperClassName="overflow-hidden pl-10 relative"
              />
            </div>
            <div className="px-[25px] pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-between">
              <p className="text-[25px] max-small:text-xl mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Heizkostenabrechnung
              </p>
              <p className="text-center text-dark_text text-base max-small:text-sm leading-[19.2px]">
                Erstellen Sie Ihre Betriebskostenabrechnung schnell, einfach
                und präzise.
              </p>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="block px-16 w-full mt-auto mb-0"
                src={checkmarks3}
                alt="checkmarks3"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 hero-3 grid-cols-3 max-medium:flex max-medium:flex-col max-medium:items-start max-medium:justify-start max-medium:space-y-4">
          <p className="col-span-1 text-lg text-dark_text max-medium:text-center font-bold">
            Die Wahl führender Innovatoren und Branchenführer
          </p>
          <div className="grid col-span-2 items-center justify-center grid-cols-4 max-medium:col-span-1 max-medium:grid-cols-3 max-medium:justify-items-center gap-x-10 gap-y-8">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-10"
              src={berlin_bear_green}
              alt="berlinBear"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto w-24 h-8"
              src={dumax_green}
              alt="dumax"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto w-24 h-8"
              src={harte_green}
              alt="harte"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto w-20 h-8"
              src={hsp_green}
              alt="hsp"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-4"
              src={idgim_green}
              alt="idgim"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block col-span-2 mx-auto h-9"
              src={quarterback_green}
              alt="quarterback"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-8"
              src={raum_green}
              alt="raum"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-28 h-14"
              src={schleicher_green}
              alt="schleicher_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-8"
              src={vitec_green}
              alt="vitec"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-32 h-8"
              src={wagner_green}
              alt="wagner"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-8"
              src={werne_green}
              alt="werne_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-8"
              src={neckar_green}
              alt="neckar_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-20 h-8"
              src={niesen_green}
              alt="niesen_green"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto max-w-24 h-8"
              src={progera_green}
              alt="progera_green"
            />
          </div>
        </div>
        <PersonSwiper />
        <div className="px-[72px] max-large:px-6">
          <h2 className="mt-48 max-large:mt-16 section-title text-center text-[50px] max-medium:text-4xl max-small:text-3xl leading-[60px] max-medium:leading-tight mb-5 text-dark_text relative">
            So funktioniert die Installation
          </h2>
          <p className="mb-32 max-medium:mb-24 max-w-4xl mx-auto text-center text-dark_text text-base max-small:text-sm leading-[19.2px]">
            Die innovativen Geräte von Heidi machen manuelles Ablesen
            überflüssig –Warm- und Kaltwasserzähler werden automatisch erfasst,
            ganz ohne Vor-Ort-Termine. Die Verbrauchsdaten werden digital
            übertragen und direkt in Ihre Betriebskostenabrechnung integriert.
          </p>
          <div>
            <div className="flex items-stretch justify-center gap-16 py-16 max-medium:py-8 max-large:border-transparent border-b border-dark_green/10 max-large:flex-col max-large:gap-4">
              <div className="flex-col flex items-start justify-between max-w-lg max-small:max-w-lg">
                <h3 className="text-dark_text text-[40px] max-large:relative numberedTitle leading-[48px] max-medium:text-2xl max-small:text-xl max-medium:leading-7 max-medium:mb-9">
                  1 Bedarfsanalyse
                </h3>
                <div>
                  <p className="mt-auto text-dark_text text-[25px] leading-[30px] mb-0 max-small:text-base">
                    Teilen Sie uns mit, welche Funkzähler Sie benötigen –den
                    Rest übernehmen wir. In Zusammenarbeit mit erfahrenen
                    Meisterbetrieben sorgen wir für eine passgenaue Umsetzung,
                    die Ihren Anforderungen entspricht. Effizient, zuverlässig,
                    unkompliziert.
                  </p>
                  <Link
                    className="mt-10 group text-link text-base leading-[19.2px] flex items-center justify-start gap-2"
                    href={ROUTE_FUNKTIONEN}
                  >
                    Erfahren Sie mehr
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="arrowLink group-hover:translate-x-1.5 group-hover:-rotate-90 duration-300"
                      src={right_arrow}
                      alt="chevron"
                    />
                  </Link>
                </div>
              </div>
              <div className="large:flex max-large:items-center max-large:justify-center">
                <LazyLottie
                  animationData={animation1}
                  id="animation1"
                  wrapperClassName="relative max-w-[537px] w-full overflow-hidden max-large:w-full max-large:object-fill"
                />
              </div>
            </div>
            <div className="flex items-stretch justify-center gap-16 py-16 max-medium:py-8 max-large:border-transparent border-b border-dark_green/10 max-large:flex-col max-large:gap-4">
              <div className="flex-col flex items-start justify-between max-w-lg">
                <h3 className="text-dark_text text-[40px] numberedTitle max-large:relative leading-[48px] max-medium:text-2xl max-small:text-xl max-medium:leading-7 max-medium:mb-9">
                  2 Installation der Funktechnologie
                </h3>
                <div>
                  <p className="mt-auto text-dark_text text-[25px] leading-[30px] mb-0 max-small:text-base">
                    Unsere Experten rüsten Ihre Zähler für Warmwasser,
                    Kaltwasser und Heizung mit modernster Funktechnologie aus
                    –komplett kostenfrei. Genießen Sie den Komfort der
                    automatisierten Fernablesung und verabschieden Sie sich von
                    Vor-Ort-Terminen.
                  </p>
                  <Link
                    className="mt-10 group text-link text-base leading-[19.2px] flex items-center justify-start gap-2"
                    href={ROUTE_FUNKTIONEN}
                  >
                    Erfahren Sie mehr
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="arrowLink group-hover:translate-x-1.5 group-hover:-rotate-90 duration-300"
                      src={right_arrow}
                      alt="chevron"
                    />
                  </Link>
                </div>
              </div>
              <div className="relative max-w-[537px] w-full overflow-hidden max-large:w-full max-large:object-fill">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  className="max-w-[537px] w-full"
                  src={list2}
                  alt="list image"
                />
              </div>
            </div>
            <div className="flex items-stretch justify-center gap-16 py-16 max-medium:py-8 max-large:border-transparent border-b border-dark_green/10 max-large:flex-col max-large:gap-4">
              <div className="flex-col flex items-start justify-between max-w-lg">
                <h3 className="text-dark_text text-[40px] numberedTitle max-large:relative leading-[48px] max-medium:text-2xl max-small:text-xl max-medium:leading-7 max-medium:mb-9">
                  3 Intelligente Verbrauchsanalyse
                </h3>
                <div>
                  <p className="mt-auto text-dark_text text-[25px] leading-[30px] mb-0 max-small:text-base">
                    Behalten Sie Ihre Verbrauchsdaten jederzeit im Blick. Unsere
                    individuell anpassbaren Dashboards erfassen alle Werte in
                    Echtzeit und ermöglichen präzise Betriebskostenabrechnungen
                    mit nur wenigen Klicks.
                  </p>
                  <Link
                    className="mt-10 group text-link text-base leading-[19.2px] flex items-center justify-start gap-2"
                    href={ROUTE_FUNKTIONEN}
                  >
                    Erfahren Sie mehr
                    <Image
                      width={0}
                      height={0}
                      sizes="100vw"
                      loading="lazy"
                      className="arrowLink group-hover:translate-x-1.5 group-hover:-rotate-90 duration-300"
                      src={right_arrow}
                      alt="chevron"
                    />
                  </Link>
                </div>
              </div>
              <div className="large:flex max-large:items-center max-large:justify-center">
                <LazyLottie
                  animationData={animation2}
                  id="animation2"
                  wrapperClassName="relative max-w-[537px] w-full overflow-hidden max-large:w-full max-large:object-fill"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-[72px] max-large:px-6">
          <h2 className="mt-48 max-medium:mt-24 section-title max-small:text-2xl max-small:leading-7 text-center text-[50px] leading-[60px] mb-5 text-dark_text relative">
            Essenzielle Funktionen
          </h2>
          <p className="mb-32 max-medium:mb-16 max-w-4xl mx-auto text-center text-dark_text text-base max-small:text-sm leading-[19.2px]">
            Profitieren Sie von maßgeschneiderten Lösungen, die Zeit und Kosten
            sparen. Unsere intelligente Technologie nimmt Ihnen Arbei t ab,
            damit Sie sich auf das Wesentliche konzentrieren können.
          </p>
          <MobileDifference
            desktopComponent={<FunctionsList />}
            mobileComponent={<FunctionsSwiper />}
          />
          <Link
            className="my-10 group mx-auto text-link text-base leading-[19.2px] flex items-center justify-center gap-2"
            href={ROUTE_FUNKTIONEN}
          >
            Erfahren Sie mehr
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="arrowLink group-hover:translate-x-1.5 group-hover:-rotate-90 duration-300"
              src={right_arrow}
              alt="chevron"
            />
          </Link>
        </div>
        <div className="bg-section-bg pt-[70px] max-medium:py-16 pb-[100px]">
          <h2 className="text-center max-w-4xl px-[72px] max-large:px-6 mx-auto text-[50px] leading-[60px] max-medium:text-2xl max-small:text-xl max-medium:leading-7 mb-5 text-dark_text relative">
            Wir sind Ihr langfristiger Partner für Klimaschutz-Technologie
          </h2>
          <p className="mb-10 px-[72px] max-large:px-6 max-w-4xl mx-auto text-center text-dark_text max-small:text-sm text-base leading-[19.2px]">
            Wir installieren Funksender für Warmwasser, Kaltwasser, für den
            Verbrauch von Heizungen und Rauchmelder.
          </p>
          <MobileDifference
            mobileComponent={<NewsSwiper />}
            desktopComponent={<NewsList />}
          />
          <h2 className="text-center max-small:hidden max-w-4xl mx-auto text-[25px] leading-[30px] mb-5 text-dark_text relative">
            Nach der EU-Heizkostenverordnung (Artikel 9c) müssen bis 2027 alle
            herkömmlichen Zähler auf fernablesbare Modelle umgerüstet werden, um
            Effizienz und Transparenz zu verbessern.
          </h2>
          <p className="mb-[84px] max-small:hidden max-w-4xl mx-auto text-center text-dark_text text-base leading-[19.2px]">
            Immobilienbesitzer müssen daher ihre Systeme entsprechend umrüsten.
            Wir helfen Ihnen
          </p>
          <div className="flex items-center max-medium:flex-col justify-center gap-4">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="max-small:hidden w-[313px] h-[269px]"
              src={eu_lock}
              alt="eu_lock"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={eu_gdpr}
              className="w-[313px] h-[269px]"
              alt="eu_gdpr"
            />
          </div>
        </div>
        <Subscription />
        <ChatBotContainer isExistingClient={isExistingClient} />
      </main>
    </Suspense>
  );
}
