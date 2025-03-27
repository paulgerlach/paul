import FAQSection from "@/components/Basic/FAQ/FAQSection";
import Kostenfrei from "@/components/Basic/Kostenfrei/Kostenfrei";
import { ROUTE_FRAGEBOGEN } from "@/routes/routes";
import { article_image, hero_review, idea } from "@/static/icons";
import Image from "next/image";
import Link from "next/link";

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string };

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("blogpost", uid).catch(() => notFound());

  return (
    <main id="content relative">
      <div className="flex items-start max-medium:flex-col justify-between relative max-large:px-20 max-medium:px-10 max-small:px-5 after:top-0 after:left-0 after:content-[''] after:bg-[#EFEFEF] after:w-screen after:h-screen after:absolute after:z-[-1] max-medium:after:hidden">
        <div
          id="heroText"
          className="max-medium:!relative w-1/2 bg-[#EFEFEF] sticky h-screen pl-[120px] max-large:pl-20 max-medium:pl-10 max-small:pl-5 top-0 py-[150px] max-medium:py-8 flex flex-col justify-center items-start">
          <h1 className="text-[65px] max-megalarge:text-[50px] max-megalarge:leading-[1] max-large:text-4xl max-medium:text-2xl leading-[78px] text-dark_text mb-2">
            Fernablesung wird <br />
            Pflicht nach Art. 27
          </h1>
          <p className="text-dark_text text-xl">
            Fernablesbare Zähler für Warm- und Kaltwasser <br />
            verpflichtend bis 1. Januar 2027
          </p>
          <Link
            href={ROUTE_FRAGEBOGEN}
            className="max-medium:w-full text-center w-fit block py-5 max-medium:py-3 px-10 text-lg text-dark_text bg-green rounded-halfbase my-5">
            Jetzt installieren lassen
          </Link>
          <p className="text-dark_text text-[15px]">
            Kostenfreie Installation der Funkgeräte
          </p>
        </div>
        <div className="w-1/2 max-medium:w-full ml-auto mr-0">
          <SliceZone slices={page.data.slices} components={components} />
          {/* <Image
            width={0}
            height={0}
            sizes="100vw"
            loading="lazy"
            className="w-full object-cover max-h-screen h-dvh max-medium:hidden"
            src={hero_review}
            alt="hero_review"
          /> */}
          <div className="px-8 space-y-[30px]">
            <h4 className="text-2xl mt-[30px] pr-14 max-medium:mr-0 text-dark_text font-bold">
              Pflicht für neu installierte Geräte
            </h4>
            <p className="text-dark_text text-lg">
              Die EED sieht vor, dass die Messgeräte zur Ermittlung der
              Heizkosten, die ab 25.10.2020 neu installiert werden,
              fernauslesbar sein müssen - vorausgesetzt, dies ist technisch
              machbar und kosteneffizient und im Hinblick auf
              Energieeinsparungen verhältnismäßig. Was unter technischer
              Machbarkeit und Kosteneffizienz zu verstehen ist, soll im Rahmen
              der Novelle der Heizkostenverordnung, die noch für dieses Jahres
              vorgesehen ist, festgelegt werden.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Bestandsschutz bis 2027
            </h4>
            <p className="text-dark_text text-lg">
              Ein Bestandsschutz gilt für bestehende Heizkostenverteiler,
              Wärmemengenzähler und Warmwasserzähler bis zum 1.1.2027. Diese
              müssen bis dahin nachgerüstet oder ausgetauscht werden (außer es
              wird nachgewiesen, dass dies nicht wirtschaftlich ist).
            </p>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className="rounded-base w-full"
              src={article_image}
              alt="article_image"
            />
            <h4 className="text-2xl text-dark_text font-bold">
              Unterjährige Verbrauchsinformationen
            </h4>
            <p className="text-dark_text text-lg">
              Hausbewohner, deren Wohnungen mit fernauslesbaren Messgeräten
              ausgestattet wurden, haben außerdem ab 25.10.2020 einen Anspruch
              darauf, eine halbjährliche Aufstellung ihrer Verbrauchsdaten zu
              erhalten. Ab <b>1.1.2022</b> müssen die Verbrauchsinformation
              sogar monatlich bereitgestellt werden - das soll für mehr
              Transparenz sorgen und Anreize zum Energiesparen schaffen.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Die Heizkostenverordnung
            </h4>
            <p className="text-dark_text text-lg">
              Die Heizkostenverordnung schreibt vor, dass zwischen 50 und 70
              Prozent der Gesamtheizkosten anhand des gemessenen Verbrauchs
              abzurechnen sind, die restlichen
              <b>30 bis 50 Prozent</b> unabhängig vom Verbrauch nach der
              beheizbaren Wohn- oder Nutzfläche oder dem umbauten Raum
              (Grundkosten). Nähere Informationen finden Sie unter anderem hier.
              Eine nicht der Heizkostenverordnung entsprechende Abrechnung
              entspricht nicht ordnungsmäßiger Verwaltung und ist anfechtbar.
            </p>
            <div className="bg-[#FCF8F3] rounded-base py-6 space-y-8 px-8">
              <div className="flex items-end justify-start gap-5 uppercase text-xl text-dark_text">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  loading="lazy"
                  src={idea}
                  alt="idea"
                />
                TIPP
              </div>
              <p className="text-dark_text text-lg">
                Rüsten Sie zeitnah um, wir von Heidi Systems helfen Ihnen sich
                an die <b>Energieeffizienzrichtlinie</b> einzuhalten. Jetzt
                kostenfreies Angebot erhalten.
              </p>
            </div>
            <h4 className="text-2xl text-dark_text font-bold">
              Mit Digitalisierung den Herausforderungen der
              Energieeffizienzrichtlinie (EED) begegnen
            </h4>
            <p className="text-dark_text text-lg">
              Wesentlicher Bestandteile der Ende Oktober hierzulande in Kraft
              getretenen EU-Energieeffizienzrichtlinie (EED) sind das
              Bereitstellen unterjähriger Verbrauchsinformationen für
              Wohnungsnutzer sowie der verpflichtende Einsatz von
              Funkmesstechnik in der Verbrauchserfassung. Im Interview erläutert
              Stephan Bause, Geschäftsführer der noventic-Tochter beyonnex, was
              die neuen Vorgaben für Mieter und Bestandshalter mit sich bringen.
              Nicht zu unterschätzen sind die Chancen für Energieeinsparungen.
              Zudem ist mit der nun zu installierenden Infrastruktur der
              Einstieg in das digitale Gebäude der Zukunft mit allen Optionen
              gelegt.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Pflicht für neu installierte Geräte
            </h4>
            <p className="text-dark_text text-lg">
              Die EED sieht vor, dass die Messgeräte zur Ermittlung der
              Heizkosten, die ab 25.10.2020 neu installiert werden,
              fernauslesbar sein müssen - vorausgesetzt, dies ist technisch
              machbar und kosteneffizient und im Hinblick auf
              Energieeinsparungen verhältnismäßig. Was unter technischer
              Machbarkeit und Kosteneffizienz zu verstehen ist, soll im Rahmen
              der Novelle der Heizkostenverordnung, die noch für dieses Jahres
              vorgesehen ist, festgelegt werden.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Bestandsschutz bis 2027
            </h4>
            <p className="text-dark_text text-lg">
              Ein Bestandsschutz gilt für bestehende Heizkostenverteiler,
              Wärmemengenzähler und Warmwasserzähler bis zum 1.1.2027. Diese
              müssen bis dahin nachgerüstet oder ausgetauscht werden (außer es
              wird nachgewiesen, dass dies nicht wirtschaftlich ist).
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Mit Digitalisierung den Herausforderungen der
              Energieeffizienzrichtlinie (EED) begegnen
            </h4>
            <p className="text-dark_text text-lg">
              Wesentlicher Bestandteile der Ende Oktober hierzulande in Kraft
              getretenen EU-Energieeffizienzrichtlinie (EED) sind das
              Bereitstellen unterjähriger Verbrauchsinformationen für
              Wohnungsnutzer sowie der verpflichtende Einsatz von
              Funkmesstechnik in der Verbrauchserfassung. Im Interview erläutert
              Stephan Bause, Geschäftsführer der noventic-Tochter beyonnex, was
              die neuen Vorgaben für Mieter und Bestandshalter mit sich bringen.
              Nicht zu unterschätzen sind die Chancen für Energieeinsparungen.
              Zudem ist mit der nun zu installierenden Infrastruktur der
              Einstieg in das digitale Gebäude der Zukunft mit allen Optionen
              gelegt.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Pflicht für neu installierte Geräte
            </h4>
            <p className="text-dark_text text-lg">
              Die EED sieht vor, dass die Messgeräte zur Ermittlung der
              Heizkosten, die ab 25.10.2020 neu installiert werden,
              fernauslesbar sein müssen - vorausgesetzt, dies ist technisch
              machbar und kosteneffizient und im Hinblick auf
              Energieeinsparungen verhältnismäßig. Was unter technischer
              Machbarkeit und Kosteneffizienz zu verstehen ist, soll im Rahmen
              der Novelle der Heizkostenverordnung, die noch für dieses Jahres
              vorgesehen ist, festgelegt werden.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Bestandsschutz bis 2027
            </h4>
            <p className="text-dark_text text-lg">
              Ein Bestandsschutz gilt für bestehende Heizkostenverteiler,
              Wärmemengenzähler und Warmwasserzähler bis zum 1.1.2027. Diese
              müssen bis dahin nachgerüstet oder ausgetauscht werden (außer es
              wird nachgewiesen, dass dies nicht wirtschaftlich ist).
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Pflicht für neu installierte Geräte
            </h4>
            <p className="text-dark_text text-lg">
              Die EED sieht vor, dass die Messgeräte zur Ermittlung der
              Heizkosten, die ab 25.10.2020 neu installiert werden,
              fernauslesbar sein müssen - vorausgesetzt, dies ist technisch
              machbar und kosteneffizient und im Hinblick auf
              Energieeinsparungen verhältnismäßig. Was unter technischer
              Machbarkeit und Kosteneffizienz zu verstehen ist, soll im Rahmen
              der Novelle der Heizkostenverordnung, die noch für dieses Jahres
              vorgesehen ist, festgelegt werden.
            </p>
            <h4 className="text-2xl text-dark_text font-bold">
              Bestandsschutz bis 2027
            </h4>
            <p className="text-dark_text text-lg">
              Ein Bestandsschutz gilt für bestehende Heizkostenverteiler,
              Wärmemengenzähler und Warmwasserzähler bis zum 1.1.2027. Diese
            </p>
          </div>
        </div>
      </div>
      <FAQSection />
      <Kostenfrei />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  // Fetch metadata on each request
  const page = await client.getByUID("blogpost", uid).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
