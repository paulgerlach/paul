"use client";

import { FAQItemType } from "@/types";
import FAQItem from "./FAQItem";
import { useState } from "react";

const items1: FAQItemType[] = [
	{
		question: "Bin ich verpflichtet, auf Funktechnik umzurüsten?",
		answer:
			"Die Umrüstung auf Funkzähler ist in vielen Fällen gesetzlich vorgeschrieben oder wird empfohlen, um den Energieverbrauch effizienter zu verwalten. Zudem profitieren Sie von automatischer Ablesung und reduziertem Verwaltungsaufwand.",
	},
	{
		question:
			"Gibt es eine gesetzliche Pflicht zum Einbau von Funkmessgeräten?",
		answer:
			"Ja, in Deutschland gibt es gesetzliche Vorgaben zur Einführung von intelligenten Messsystemen. Die genauen Regelungen hängen von Verbrauchsgrenzen und Gebäudearten ab.",
	},
	{
		question: "Welche Daten werden per Funk ausgelesen?",
		answer:
			"Unsere Geräte messen den Verbrauch von Warmwasser, Kaltwasser und Heizenergie. Die erfassten Daten werden sicher und verschlüsselt übertragen, um Datenschutz und Datensicherheit zu gewährleisten.",
	},
	{
		question: "Kann ich meine Verbrauchsdaten in Echtzeit abrufen?",
		answer:
			"a, unsere Funkzähler ermöglichen die automatische Erfassung und digitale Übertragung der Verbrauchsdaten, sodass Sie jederzeit aktuelle Werte einsehen können.",
	},
	{
		question: "Wer übernimmt die Installation der Funkgeräte?",
		answer:
			"Die Installation erfolgt durch unsere zertifizierten Experten direkt vor Ort und ist für Sie kostenlos.",
	},
	{
		question: "Welche Kosten entstehen für die Installation?",
		answer:
			"Die Installation der Funkzähler ist für Sie komplett kostenfrei. Es fallen keine zusätzlichen Gebühren an.",
	},
];
const items2: FAQItemType[] = [
	{
		question: "Was ist ein Smart-Meter-Gateway (SMGW)?",
		answer:
			"Ein Smart-Meter-Gateway ist eine zentrale Kommunikationsschnittstelle, die Messwerte sicher an Energiedienstleister überträgt und eine intelligente Verbrauchssteuerung ermöglicht.",
	},
	{
		question: "Was versteht man unter einem intelligenten Messgerät?",
		answer:
			"Intelligente Messgeräte erfassen Verbrauchsdaten digital, übertragen sie automatisch und ermöglichen eine präzise Analyse sowie eine effizientere Energienutzung.",
	},
	{
		question:
			"Kann ich mit den Funkzählern eine Betriebskostenabrechnung erstellen?",
		answer:
			"Ja, alle erfassten Verbrauchsdaten stehen Ihnen digital zur Verfügung und können problemlos für die Betriebskostenabrechnung genutzt werden.",
	},
	{
		question: "Ist die Wartung der Geräte inbegriffen?",
		answer:
			"Ja, wir übernehmen die regelmäßige Wartung aller installierten Funkgeräte kostenlos und gewährleisten einen zuverlässigen Betrieb.",
	},
	{
		question: "Welche Kosten fallen für den Service an?",
		answer:
			"Die Installation und Wartung der Geräte ist kostenfrei. Für die weiteren Services fällt ein monatlicher Fixbetrag an.",
	},
	{
		question: "Welche Geräte bietet Heidi an?",
		answer:
			"Wir bieten digitale Funkzähler für Warmwasser, Kaltwasser und Heizung sowie smarte Rauchmelder und weitere Messlösungen für eine effiziente Verbrauchsverwaltung.",
	},
];

export default function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [openSecondIndex, setOpenSecondIndex] = useState<number | null>(null);

	const handleClick = (index: number) => {
		setOpenIndex((prev) => (prev === index ? null : index));
	};

	const handleSecondClick = (index: number) => {
		setOpenSecondIndex((prev) => (prev === index ? null : index));
	};

	return (
		<div className="bg-section-bg px-[72px] max-large:px-6 pt-16 pb-32 max-large:pt-8 max-large:pb-20">
			<h3 className="mb-14 text-[45px] leading-[54px] max-medium:text-2xl text-dark_text">
				FAQ
			</h3>
			<div className="faq-tabs-answers grid-cols-2 grid gap-[88px] max-large:gap-11 max-medium:grid-cols-1 max-medium:gap-6">
				<div className="faq-answers-container" data-tab="1">
					{items1.map((item, index) => (
						<FAQItem
							isOpen={openIndex === index}
							onClick={handleClick}
							index={index}
							item={item}
							key={index}
						/>
					))}
				</div>
				<div className="faq-answers-container" data-tab="2">
					{items2.map((item, index) => (
						<FAQItem
							isOpen={openSecondIndex === index}
							onClick={handleSecondClick}
							index={index}
							item={item}
							key={index}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
