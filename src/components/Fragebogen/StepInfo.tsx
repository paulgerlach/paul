"use client";

import { chevron, info } from "@/static/icons";
import { slideDown, slideUp } from "@/utils";
import Image from "next/image";
import { useRef, useState } from "react";

export default function StepInfo({ activeStep }: { activeStep: number }) {
  const infoRef = useRef<HTMLDivElement>(null);
  const [isInfoOpened, setIsInfoOpened] = useState<boolean>(false);

  const stepData = () => {
    switch (activeStep) {
      case 0:
        return {
          title: "Erklärung",
          text: "Bitte geben Sie an, wie viele Wohnungen aktuell von Ihnen betreut werden und für die eine Umrüstung auf Funkzähler geplant ist. Diese Angabe ist wichtig für die Angebotserstellung und zur Einhaltung gesetzlicher Vorgaben.",
        };
      case 1:
        return {
          title: "Erklärung",
          text: "Bitte wählen Sie aus, wie die Heizkosten derzeit abgerechnet werden (z. B. über Ablesedienste oder durch Sie selbst). Diese Information hilft uns, den aktuellen Stand zu verstehen und den Aufwand für die Umstellung auf Funkzähler besser einzuschätzen.",
        };
      case 2:
        return {
          title: "Erklärung",
          text: "Bitte geben Sie an, ob eine zentrale Heizungsanlage vorhanden ist, die alle Wohneinheiten versorgt. Diese Information ist wichtig für die Auswahl der passenden Messtechnik und die Planung der Verbrauchserfassung.",
        };
      case 3:
        return {
          title: "Erklärung",
          text: "Bitte geben Sie an, ob das Warmwasser zentral über eine Heizungsanlage erzeugt wird. Diese Angabe ist relevant, da bei zentraler Versorgung auch der Warmwasserverbrauch individuell erfasst und abgerechnet werden muss.",
        };
      case 4:
        return {
          title: "Erklärung",
          text: "Bitte wählen Sie aus, ob die Wohnungen über eine zentrale Heizungsanlage oder dezentrale Systeme (z. B. Etagenheizung, oder Wärmepumpe) beheizt werden. Diese Information ist wichtig, um den passenden Mess- und Abrechnungslösungen für Ihre Immobilie zu ermitteln.",
        };
      case 5:
        return {
          title: "Erklärung",
          text: "Bitte geben Sie an, welche Energiequelle für die Beheizung der Gebäude genutzt werden (z. B. Gas, Fernwärme, Öl, Wärmepumpe). Diese Information hilft uns, die technische Umsetzung und mögliche Fördermöglichkeiten besser einzuschätzen.",
        };
      case 6:
        return {
          title: "Erklärung",
          text: "Um eine reibungslose und effiziente Bearbeitung Ihrer Anfrage zu gewährleisten, benötigen wir Ihre persönlichen Daten. Diese ermöglichen es uns, bei eventuellen Rückfragen direkt mit Ihnen in Kontakt zu treten.",
        };
      default:
        return {
          title: "Unbekannter Schritt",
          text: "Keine Informationen verfügbar.",
        };
    }
  };

  const handleInfoSlide = () => {
    if (!infoRef.current) return;

    if (isInfoOpened) {
      slideUp(infoRef.current);
    } else {
      slideDown(infoRef.current);
    }
    setIsInfoOpened(!isInfoOpened);
  };

  return (
    <div className="questionare-info max-w-[40%] max-large:max-w-full w-full max-medium:mr-0 mt-2 -mr-10">
      <div className="questionare-answer-item bg-dark_green/5 rounded-base">
        <div
          onClick={handleInfoSlide}
          className={`questionare-answer-header p-4 cursor-pointer flex items-center justify-between ${isInfoOpened ? "opened" : ""}`}>
          <p className="questionare-question text-dark_text/30 flex items-center justify-between gap-3">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              src={info}
              alt="info"
            />
            {stepData().title}
          </p>
          <div className="questionare-icon">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              loading="lazy"
              className={`${isInfoOpened ? "rotate-270" : "rotate-90"} transition-all duration-300 colored-to-black opacity-50 size-4`}
              src={chevron}
              alt="chevron"
            />
          </div>
        </div>
        <div
          ref={infoRef}
          className="questionare-answer-content px-4 pb-4 hidden">
          <p>{stepData().text}</p>
        </div>
      </div>
    </div>
  );
}
