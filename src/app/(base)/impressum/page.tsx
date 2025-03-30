import Subscription from "@/components/Basic/Subscription/Subscription";
import ReviewsSwiper from "@/components/Swipers/ReviewsSwiper";
import Link from "next/link";

export default function ImpressumPage() {
  return (
    <main id="content">
      <div className="pt-4 pb-16 px-36 max-large:px-30 max-medium:px-16 max-small:px-5">
        <h1 className="text-[45px] leading-[54px] mb-20 max-medium:text-2xl text-dark_text">
          Impressum
        </h1>
        <p className="text-lg text-dark_text">KI Akademie Berlin GmbH</p>
        <p className="text-lg text-dark_text">Rungestraße 21</p>
        <p className="text-lg text-dark_text">10179 Berlin</p>
        <br />
        <p className="text-lg text-dark_text">Telefon: +49 (0) 61 22 / 52 20</p>
        <p className="text-lg text-dark_text">
          E-Mail:
          <Link href="malto:info@heidisystems.com"></Link>info@heidisystems.com
        </p>
        <br />
        <p className="text-lg text-dark_text">
          Vertreten durch: Paul Gerlach, Chris Nagel
        </p>
        <p className="text-lg mb-16 text-dark_text">
          Handelsregister: Berlin-Charlottenburg
        </p>
        <p className="text-lg mb-16 text-dark_text">
          Registernummer: HRB 259535 B
        </p>
        <p className="text-lg mb-16 text-dark_text">
          Umsatzsteuer-ID gemäß §27 a Umsatzsteuergesetz: DE365219727
        </p>
        <div className="space-y-16">
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">
              Plattform zur Klärung von Online-Streitigkeiten
            </h4>
            <p className="text-dark_text text-lg">
              Die europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung bereit. Diese Plattform ist eine
              Anlaufstelle für Verbraucher und Unternehmer, die Streitigkeiten
              aus Online-Verträgen außergerichtlich und freiwillig beilegen
              wollen. Sie können diese unter
              <Link href="https://ec.europa.eu/consumers/odr/">
                https://ec.europa.eu/consumers/odr/
              </Link>
              aufrufen.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">
              Informationen zum Verbraucherschutz
            </h4>
            <p className="text-dark_text text-lg">
              Zur Beilegung von Streitigkeiten im Zusammenhang mit Strom- oder
              Gaslieferung können Verbraucher ein Schlichtungsverfahren bei der
              Schlichtungsstelle Energie e.V. beantragen. Voraussetzung dafür
              ist, dass der Kundenservice des Lieferanten angerufen wurde und
              keine beidseitige zufriedenstellende Lösung gefunden wurde. Zur
              Teilnahme am Schlichtungsverfahren ist Heidi Systems in diesem
              Fall verpflichtet.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">
              Schlichtungsstelle
            </h4>
            <p className="text-dark_text text-lg">
              Energie e. V.
              <br />
              <br />
              Friedrichstraße 133
              <br />
              <br />
              10117 Berlin
              <br />
              <br />
              Telefon: <Link href="tel:03027572400">030 27 57 24 00</Link>
              <br />
              Telefax: <Link href="tel:030275724069">030 275 72 40 69</Link>
              <br />
              <br />
              Internet:
              <Link href="www.schlichtungsstelle-energie.de">
                www.schlichtungsstelle-energie.de
              </Link>
              <br />
              <br />
              E-Mail:
              <Link href="mailto:info@schlichtungsstelle-energie.de">
                info@schlichtungsstelle-energie.de
              </Link>
              <br />
              <br />
              Im Übrigen wird Heidi Systems nicht an Streitbeilegungsverfahren
              nach dem Verbraucherstreitbeilegungsgesetz (VSBG) teilnehmen und
              ist hierzu auch nicht verpflichtet.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">
              Widerspruch Werbe-Mails
            </h4>
            <p className="text-dark_text text-lg">
              Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
              Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter
              Werbung und Informationsmaterialien wird hiermit widersprochen.
              Die Betreiber der Seiten behalten sich ausdrücklich rechtliche
              Schritte im Falle der unverlangten Zusendung von
              Werbeinformationen, etwa durch Spam-E-Mails, vor.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">Urheberrecht</h4>
            <p className="text-dark_text text-lg">
              Alle Texte, Bilder, Grafiken, Ton-, Video- und Animationsdateien
              sowie ihre Arrangements unterliegen dem Urheberrecht und anderen
              Gesetzen zum Schutz geistigen Eigentums. Sie dürfen weder für
              Handelszwecke oder zur Weitergabe kopiert, noch verändert und auf
              anderen Websites verwendet werden. Einige Internet-Seiten
              enthalten auch Bilder, die dem Urheberrecht derjenigen
              unterliegen, die diese zur Verfügung gestellt haben.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">
              Gewährleistung
            </h4>
            <p className="text-dark_text text-lg">
              Die Informationen stellt die KI Akademie Berlin GmbH ohne jegliche
              Zusicherung oder Gewährleistung jedweder Art, sei sie ausdrücklich
              oder stillschweigend, zur Verfügung. Ausgeschlossen sind auch alle
              stillschweigenden Gewährleistungen betreffend die
              Handelsfähigkeit, die Eignung für bestimmte Zwecke oder den
              Nichtverstoß gegen Gesetze und Patente. Auch wenn wir davon
              ausgehen, dass die von uns gegebenen Informationen zutreffend
              sind, können sie dennoch Fehler oder Ungenauigkeiten enthalten.
            </p>
          </div>
          <div className="space-y-5">
            <h4 className="text-2xl text-dark_text font-bold">Marken</h4>
            <p className="text-dark_text text-lg">
              Wo nicht anders angegeben, sind alle auf den Internet-Seiten
              genannten Marken gesetzlich geschützte Marken der KI Akademie
              Berlin GmbH oder ihrer Tochterunternehmen.
            </p>
          </div>
        </div>
      </div>
      <ReviewsSwiper />
      <Subscription />
    </main>
  );
}
