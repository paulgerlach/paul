import MobileDifference from "@/components/Basic/MobileDifference/MobileDifference";
import Subscription from "@/components/Basic/Subscription/Subscription";
import HomeHero from "@/components/Hero/HomeHero";
import { LazyLottie } from "@/components/Lottie/LazyLottie";
import FunctionsList from "@/components/Swipers/FunctionsList";
import FunctionsSwiper from "@/components/Swipers/FunctionsSwiper";
import NewsList from "@/components/Swipers/NewsList";
import NewsSwiper from "@/components/Swipers/NewsSwiper";
import PersonSwiper from "@/components/Swipers/PersonSwiper";
import { ROUTE_DATENSCHUTZHINWEISE, ROUTE_FRAGEBOGEN } from "@/routes/routes";
import {
  checkmarks3,
  clock,
  counter,
  doc,
  doc_phone,
  eu_gdpr,
  eu_lock,
  fewocare,
  flyla,
  haus_hirst,
  instruments,
  ki_akademie,
  list2,
  parkdepot,
  right_arrow,
  sameday,
  vitolos,
  weight,
  wemolo,
} from "@/static/icons";
import { animation1, animation2, animation3 } from "@/static/lottieAnimations";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main id="content">
      <HomeHero />
      <div className="mt-28 px-[140px] max-megalarge:px-16 max-large:px-6 max-medium:px-5 hero max-small:mt-6">
        <h2 className="section-title hero-title hidden max-large:block max-small:text-3xl max-small:leading-9 text-[50px] leading-[60px] mb-5 text-center relative text-dark_text">
          Jetzt Vorteile sichern
        </h2>
        <div className="grid mb-32 hero-1 grid-cols-4 gap-20 max-large:gap-8 items-stretch max-medium:grid-cols-2 justify-center max-small:grid-cols-1">
          <div className="space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
            <span className="circleIcon inline-block">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="size-[25px]"
                src={weight}
                alt="weight"
              />
            </span>
            <p className="text-xl text-dark_text font-bold max-medium:text-center">
              EU-Vorschriften <br />
              einhalten
            </p>
            <p className="text-[15px] leading-[18px] text-dark_text max-medium:text-center">
              Mit unseren fernablesbaren Zählern erfüllen Sie alle gesetzlichen
              Vorgaben und profitieren gleichzeitig von höherer Effizienz und
              Transparenz. Modernste Energiemanagement- Technologie sorgt für
              eine zukunftssichere Lösung.
            </p>
            <a
              href="/datenschutzhinweise"
              className="hidden max-medium:block text-link underline text-sm leading-4"
            >
              mehr erfahren
            </a>
          </div>
          <div className="max-medium:flex space-y-4 max-medium:flex-col max-medium:items-center max-medium:justify-start">
            <span className="circleIcon inline-block">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="size-[25px]"
                src={clock}
                alt="clock"
              />
            </span>
            <p className="text-xl text-dark_text font-bold max-medium:text-center">
              Zeit- und <br />
              Kostenersparnis
            </p>
            <p className="text-[15px] max-large:!mt-7 leading-[18px] text-dark_text max-medium:text-center">
              Reduzieren Sie manuelle Aufwände und sparen Sie wertvolle Zeit.
              Unsere automatisierten Prozesse übernehmen die Verbrauchserfassung
              effizient und zuverlässig.
            </p>
            <a
              href="#"
              className="border hidden max-medium:flex border-green bg-transparent py-2 px-4 items-center justify-center text-sm text-green rounded-halfbase duration-300 hover:opacity-80"
            >
              Kosteneinsparung berechnen
            </a>
          </div>
          <div className="space-y-4 max-medium:flex max-medium:flex-col max-medium:items-center max-medium:justify-start">
            <span className="circleIcon inline-block">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="size-[25px]"
                src={instruments}
                alt="instruments"
              />
            </span>
            <p className="text-xl text-dark_text font-bold max-medium:text-center">
              Kostenfreie <br />
              Installation
            </p>
            <p className="text-[15px] max-large:!mt-7 leading-[18px] text-dark_text max-medium:text-center">
              Steigen Sie ohne Mehrkosten auf unsere innovative Technologie um.
              Die Umrüstung erfolgt für Sie völlig kostenlos und ohne Aufwand.
            </p>
            <Link
              href="/fragebogen"
              className="border hidden max-medium:flex border-green bg-green py-2 px-4 items-center justify-center text-sm text-white rounded-halfbase duration-300 hover:opacity-80"
            >
              Jetzt installieren lassen
            </Link>
          </div>
          <div className="space-y-4 max-medium:hidden max-medium:flex-col max-medium:items-center max-medium:justify-start">
            <span className="circleIcon inline-block">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                className="size-[25px]"
                src={doc}
                alt="doc"
              />
            </span>
            <p className="text-xl text-dark_text font-bold max-medium:text-center">
              Betriebskosten-
              <br />
              abrechnung erstellen
            </p>
            <p className="text-[15px] leading-[18px] text-dark_text max-medium:text-center">
              Unsere drahtlosen Messgeräte erfassen alle Verbrauchsdaten
              automatisch und bereiten sie für eine präzise und effiziente
              Nebenkostenabrechnung auf.
            </p>
          </div>
        </div>
        <div className="hero-2 max-medium:px-4">
          <h2 className="section-title max-small:text-3xl max-small:leading-9 text-[50px] leading-[60px] mb-5 text-center relative text-dark_text">
            Jetzt auf Funkzähler umsteigen
          </h2>
          <p className="text-dark_text leading-[19.2px] text-base mb-16 max-w-3xl mx-auto text-center">
            Revolutionieren Sie Ihr Energiemanagement: Reduzieren Sie Kosten,
            steigern Sie die Effizienz und profitieren Sie von automatisierten
            Überwachungs- und Steuerungslösungen für eine zukunftssichere
            Verbrauchserfassung.
          </p>
          <div className="grid grid-cols-2 max-medium:grid-cols-1 mb-[18px] gap-6">
            <div className="px-5 pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-end">
              <p className="text-[25px] mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Kostenfreie Installation
              </p>
              <p className="text-center text-dark_text text-base leading-[19.2px]">
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
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  src={counter}
                  alt="counter"
                />
              </div>
            </div>
            <div className="px-5 pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-end">
              <p className="text-[25px] mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Dokumenten-Management
              </p>
              <p className="text-center text-dark_text text-base leading-[19.2px]">
                Alle Verbrauchsdaten werden automatisch erfasst und stehen Ihnen
                direkt für die Betriebskostenabrechnung zur Verfügung.
              </p>
              <Link
                href={ROUTE_DATENSCHUTZHINWEISE}
                className="block mb-10 text-center w-fit mx-auto text-green underline text-base leading-[19.2px]"
              >
                mehr erfahren
              </Link>
              <Image
                width={0}
                height={0}
                sizes="100vw"
                loading="lazy"
                src={doc_phone}
                alt="screenshot"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 max-medium:grid-cols-1 mb-20 gap-[18px]">
            <div className="px-[25px] overflow-hidden pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-between">
              <p className="text-[25px] relative z-[2] mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Dashboard
              </p>
              <p className="text-center relative z-[2] text-dark_text text-base leading-[19.2px] mb-12">
                Alle Verbrauchswerte für Warmwasser, Kaltwasser und Heizkosten
                in einer übersichtlichen Darstellung.
              </p>
              <LazyLottie
                animationData={animation3}
                id="animation3"
                wrapperClassName="overflow-hidden relative mt-[-150px] z-[0]"
              />
            </div>
            <div className="pt-8 bg-card_dark_bg rounded-base flex flex-col items-center justify-between">
              <p className="text-[25px] mb-2 text-dark_text leading-[30px] text-center font-bold break-all px-[25px]">
                Digitale Funkablesung
              </p>
              <p className="text-center text-dark_text px-[25px] text-base leading-[19.2px]">
                Erfassen Sie Verbrauchsdaten über alle Sparten hinweg – komplett
                ohne manuelles Ablesen oder Vor-Ort-Termine.
              </p>
              <Link
                href={ROUTE_DATENSCHUTZHINWEISE}
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
              <p className="text-[25px] mb-2 text-dark_text leading-[30px] text-center font-bold break-all">
                Betriebskostenabrechnung
              </p>
              <p className="text-center text-dark_text text-base leading-[19.2px]">
                Erstellen Sie Ihre Betriebskostenabrechnung schnell, einfach und
                präzise.
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
            Trusted by innovators and industry leaders
          </p>
          <div className="grid col-span-2 items-center justify-center grid-cols-4 max-medium:col-span-1 max-medium:grid-cols-3 gap-x-10 gap-y-8">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-10"
              src={flyla}
              alt="flyla"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-10"
              src={sameday}
              alt="sameday"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-7"
              src={wemolo}
              alt="wemolo"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-8"
              src={parkdepot}
              alt="parkdepot"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-8"
              src={vitolos}
              alt="vitolos"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-10"
              src={ki_akademie}
              alt="ki_akademie"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-12"
              src={fewocare}
              alt="fewocare"
            />
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="inline-block mx-auto h-10"
              src={haus_hirst}
              alt="haus_hirst"
            />
          </div>
        </div>
      </div>
      <PersonSwiper />
      <div className="px-[72px] max-large:px-6">
        <h2 className="mt-48 max-large:mt-16 section-title text-center text-[50px] leading-[60px] mb-5 text-dark_text relative max-small:text-3xl max-small:leading-9">
          So funktioniert die Installation
        </h2>
        <p className="mb-32 max-medium:mb-24 max-w-4xl mx-auto text-center text-dark_text text-base leading-[19.2px]">
          Die innovativen Geräte von Heidi machen manuelles Ablesen überflüssig
          –Warm- und Kaltwasserzähler werden automatisch erfasst, ganz ohne
          Vor-Ort-Termine. Die Verbrauchsdaten werden digital übertragen und
          direkt in Ihre Betriebskostenabrechnung integriert.
        </p>
        <div>
          <div className="flex items-stretch justify-center gap-16 py-16 max-medium:py-8 max-large:border-transparent border-b border-dark_green/10 max-large:flex-col max-large:gap-4">
            <div className="flex-col flex items-start justify-between max-w-lg max-small:max-w-lg">
              <h3 className="text-dark_text text-[40px] max-large:relative numberedTitle leading-[48px] max-medium:text-[30px] max-medium:leading-9 max-medium:mb-9">
                1 Bedarfsanalyse
              </h3>
              <div>
                <p className="mt-auto text-dark_text text-[25px] leading-[30px] mb-0 max-small:text-lg">
                  Teilen Sie uns mit, welche Funkzähler Sie benötigen –den Rest
                  übernehmen wir. In Zusammenarbeit mit erfahrenen
                  Meisterbetrieben sorgen wir für eine passgenaue Umsetzung, die
                  Ihren Anforderungen entspricht. Effizient, zuverlässig,
                  unkompliziert.
                </p>
                <a
                  className="mt-10 group text-link text-base leading-[19.2px] flex items-center justify-start gap-2"
                  href="/datenschutzhinweise"
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
                </a>
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
              <h3 className="text-dark_text text-[40px] numberedTitle max-large:relative leading-[48px] max-medium:text-[30px] max-medium:leading-9 max-medium:mb-9">
                2 Installation der Funktechnologie
              </h3>
              <div>
                <p className="mt-auto text-dark_text text-[25px] leading-[30px] mb-0 max-small:text-lg">
                  Unsere Experten rüsten Ihre Zähler für Warmwasser, Kaltwasser
                  und Heizung mit modernster Funktechnologie aus –komplett
                  kostenfrei. Genießen Sie den Komfort der automatisierten
                  Fernablesung und verabschieden Sie sich von Vor-Ort-Terminen.
                </p>
                <a
                  className="mt-10 text-link group text-base leading-[19.2px] flex items-center justify-start gap-2"
                  href="/datenschutzhinweise"
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
                </a>
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
              <h3 className="text-dark_text text-[40px] numberedTitle max-large:relative leading-[48px] max-medium:text-[30px] max-medium:leading-9 max-medium:mb-9">
                3 Intelligente Verbrauchsanalyse
              </h3>
              <div>
                <p className="mt-auto text-dark_text text-[25px] leading-[30px] mb-0 max-small:text-lg">
                  Behalten Sie Ihre Verbrauchsdaten jederzeit im Blick. Unsere
                  individuell anpassbaren Dashboards erfassen alle Werte in
                  Echtzeit und ermöglichen präzise Betriebskostenabrechnungen
                  mit nur wenigen Klicks.
                </p>
                <a
                  className="mt-10 group text-link text-base leading-[19.2px] flex items-center justify-start gap-2"
                  href="/datenschutzhinweise"
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
                </a>
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
        <h2 className="mt-48 max-medium:mt-24 section-title max-small:text-3xl max-small:leading-9 text-center text-[50px] leading-[60px] mb-5 text-dark_text relative">
          Essenzielle Funktionen
        </h2>
        <p className="mb-32 max-medium:mb-16 max-w-4xl mx-auto text-center text-dark_text text-base leading-[19.2px]">
          Profitieren Sie von maßgeschneiderten Lösungen, die Zeit und Kosten
          sparen. Unsere intelligente Technologie nimmt Ihnen Arbei t ab, damit
          Sie sich auf das Wesentliche konzentrieren können.
        </p>
        <MobileDifference
          desktopComponent={<FunctionsList />}
          mobileComponent={<FunctionsSwiper />}
        />
        <Link
          className="my-10 group mx-auto text-link text-base leading-[19.2px] flex items-center justify-center gap-2"
          href="/datenschutzhinweise"
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
        <h2 className="text-center max-w-4xl px-[72px] max-large:px-6 mx-auto text-[50px] leading-[60px] max-medium:text-[30px] max-medium:leading-9 mb-5 text-dark_text relative">
          Wir sind Ihr langfristiger Partner für Klimaschutz-Technologie
        </h2>
        <p className="mb-10 px-[72px] max-large:px-6 max-w-4xl mx-auto text-center text-dark_text max-medium:text-sm max-medium:leading-4 text-base leading-[19.2px]">
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
    </main>
  );
}
