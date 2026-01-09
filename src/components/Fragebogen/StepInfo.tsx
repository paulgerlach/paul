"use client";

import { chevron, info_circle_grey } from "@/static/icons";
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
					text: "Diese Angabe hilft uns, die Größe und Struktur Ihres Immobilienbestands besser einzuordnen. Auf dieser Basis können wir unsere Lösungen und Empfehlungen passgenau auf Ihre Anforderungen abstimmen. Die Informationen werden ausschließlich zur besseren Beratung und Einordnung Ihrer Situation verwendet.",
				};
			case 1:
				return {
					title: "Erklärung",
					text: "Diese Angabe hilft uns, besser einzuordnen, wie Ihre aktuelle Messdienstleister-Struktur aussieht und wie komplex die Zusammenarbeit organisiert ist. So können wir Ihre Situation besser verstehen und gezielt darauf eingehen.",
				};
			case 2:
				return {
					title: "Erklärung",
					text: "Mit Ihrer Antwort helfen Sie uns, besser zu verstehen, wie zufrieden Sie aktuell mit der Zusammenarbeit mit Ihrem Messdienstleister sind. Die Einschätzung dient als Grundlage, um Prozesse, Servicequalität und Alternativen besser einordnen zu können.",
				};
			case 3:
				return {
					title: "Erklärung",
					text: "Mit dieser Frage möchten wir verstehen, ob es aktuell ein Objekt gibt, bei dem zeitnah Unterstützung, Klärung oder eine konkrete Lösung erforderlich ist. So können wir Prioritäten setzen und gezielt reagieren.",
				};
			case 4:
				return {
					title: "Erklärung",
					text: "Ihre Angaben helfen uns, Ihre Verwaltung besser kennenzulernen und Ihnen ein regional passendes Angebot zu erstellen. So können wir sicherstellen, dass die Lösung genau auf Ihre Gegebenheiten zugeschnitten ist.",
				};
			case 5:
				return {
					title: "Erklärung",
					text: "Um eine reibungslose und effiziente Bearbeitung Ihrer Anfrage zu gewährleisten, benötigen wir Ihre persönlichen Daten. Diese ermöglichen es uns, bei eventuellen Rückfragen direkt mit Ihnen in Kontakt zu treten.",
				};
			default:
				return {
					title: "Erklärung",
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
			<div className="questionare-answer-item bg-dark_green/5 rounded-2xl">
				<div
					onClick={handleInfoSlide}
					className={`questionare-answer-header p-5 cursor-pointer flex items-center justify-between ${isInfoOpened ? "opened" : ""}`}
				>
					<p className="questionare-question text-dark_text/40 flex items-center justify-between gap-3 text-[20px]">
						<Image
							width={24}
							height={24}
							loading="lazy"
							src={info_circle_grey}
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
							className={`${isInfoOpened ? "rotate-270" : "rotate-90"} transition-all duration-300 colored-to-black opacity-30 size-4`}
							src={chevron}
							alt="chevron"
						/>
					</div>
				</div>
				<div
					ref={infoRef}
					className="questionare-answer-content px-5 pb-5 hidden"
				>
					<p className="text-[16px] text-dark_text/70 leading-relaxed">{stepData().text}</p>
				</div>
			</div>
		</div>
	);
}
