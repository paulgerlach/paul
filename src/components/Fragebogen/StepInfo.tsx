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
          text: "Die Menge der vorhandenen Wohnungen bestimmt, wie viele Funkmelder wir zu Ihrer Verfügung einrichten, damit sämtliche Verbrauchsdaten digital erfasst werden.",
        };
      case 1:
        return {
          title: "Erklärung",
          text: "Die Daten, die von den drahtlosen Messgeräten erfasst werden, fließen automatisch ein und sind für die Zusammenstellung Ihrer Nebenkostenabrechnung verfügbar.",
        };
      case 2:
        return {
          title: "Erklärung",
          text: "Eine Zentralheizung oder Sammelheizung versorgt ein ganzes Gebäude mit Wärme und steht oft im Keller eines Hauses.",
        };
      case 3:
        return {
          title: "Erklärung",
          text: "Hierbei wird Trinkwasser an einem zentralen Ort durch die Heizungsanlage erwärmt und gelangt dann über Leitungen in die einzelnen Wohnung.",
        };
      case 4:
        return {
          title: "Erklärung",
          text: "Hierbei wird Trinkwasser an einem zentralen Ort durch die Heizungsanlage erwärmt und gelangt dann über Leitungen in die einzelnen Wohnungen.",
        };
      case 5:
        return {
          title: "Erklärung",
          text: "Die Daten, die von den drahtlosen Messgeräten erfasst werden, fließen automatisch ein und sind für die Zusammenstellung Ihrer Nebenkostenabrechnung verfügbar.",
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
