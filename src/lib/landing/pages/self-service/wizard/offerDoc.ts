/**
 * The words and figures of one offer document, shared by its two renderings:
 * the preview (`steps/OfferDoc.svelte`) and the stored PDF (`offerPdf.ts`).
 * Pure.
 */
import { features, OFFER_TERMS } from "./data";
import {
	billingLines,
	calc,
	gross,
	n2,
	offerDates,
	propertyLines,
	scope,
	tech,
	totalPrice,
	unitPrice,
	type Offer,
	type OfferPart,
	type Position,
	type State,
} from "./model";

/** A column: its heading, right-aligned or not. */
export type OfferColumn = [string, boolean];

export type OfferTable = {
	/** The heading above it, and the line under the heading. */
	title: string;
	kicker: string;
	cols: OfferColumn[];
	rows: (string | number)[][];
	/** A first row across all columns ("" for none). */
	first: string;
	labelNet: string;
	totalNet: number;
	labelGross: string;
	totalGross: number;
};

const SERVICES: OfferColumn[] = [
	["Servicedienstleistungen jährlich", false],
	["Mengeneinheit", true],
	["Stück", true],
	["Einzelpreis in €", true],
	["Gesamtpreis in €", true],
];
const row = (r: Position) => [r.t, r.me, r.n, n2(r.ep), n2(r.n * r.ep)];

export function offerDoc(s: State, offer: Offer, part: OfferPart) {
	const c = calc(s);
	const p = part.p;
	const abr = part.kind === "a";
	const dates = offerDates(offer);
	const property = propertyLines(s);
	const selfMounted = c.self && tech(s);

	const yearly: OfferTable = {
		title: "Servicedienstleistungen",
		kicker: "Jährlich",
		cols: SERVICES,
		rows: p.svc.map(row),
		first: `Leistungsumfang: ${scope(s).join(", ") || "nach Prüfung"}`,
		labelNet: "Gesamtpreis Servicedienstleistungen pro Jahr netto",
		totalNet: p.sS,
		labelGross: "Gesamtpreis Servicedienstleistungen pro Jahr inkl. 19% MwSt.",
		totalGross: gross(p.sS),
	};
	const rental: OfferTable = {
		title: p.buy ? "Gerätekauf" : "Gerätemiete",
		kicker: p.buy ? "Einmalig, Preis auf Anfrage" : "Jährlich",
		cols: [["Gerätetyp", false], ["Laufzeit", true], ...SERVICES.slice(1)],
		rows: p.rental.map((r) => [
			r.t,
			r.lz || "–",
			r.me,
			r.n,
			unitPrice(r),
			totalPrice(r),
		]),
		first: tech(s)
			? ""
			: "Gerätepositionen ergänzen wir nach Prüfung Ihrer Unterlagen.",
		labelNet: "Gesamtpreis Gerätemiete pro Jahr netto",
		totalNet: p.sM,
		labelGross: "Gesamtpreis Gerätemiete pro Jahr inkl. 19% MwSt.",
		totalGross: gross(p.sM),
	};
	const once: OfferTable = {
		title: "Servicedienstleistungen",
		kicker: "Einmalig",
		cols: [["Servicedienstleistungen einmalig", false], ...SERVICES.slice(1)],
		rows: p.once.map(row),
		first: p.once.length
			? ""
			: selfMounted
				? "Montage durch Sie oder Ihren Hausinstallateur, keine Installationspauschale."
				: "Keine einmaligen Leistungen.",
		labelNet: "Gesamtpreis einmalige Servicedienstleistungen netto",
		totalNet: p.sO,
		labelGross: "Gesamtpreis einmalige Servicedienstleistungen inkl. 19% MwSt.",
		totalGross: gross(p.sO),
	};

	return {
		abr,
		p,
		dates,
		property,
		billing: billingLines(s),
		features: features(c.self),
		pages: abr ? 3 : 4,
		heading: `Angebot ${part.title}`,
		intro: [
			"Sehr geehrte Damen und Herren, auf den folgenden Seiten finden Sie unser Angebot für ",
			property.join(", "),
			". Ihr Lieferumfang im Überblick:",
		] as const,
		overview: "Angebotsübersicht zu Ihrer Anfrage",
		onceLabel: "Einmalige Servicedienstleistungen",
		yearLabel: "Gesamtpreis pro Jahr",
		exVat: "zzgl. der gesetzlichen MwSt.",
		serviceLabel: abr
			? "Heizkostenabrechnung pro Jahr"
			: "Geräteservice pro Jahr",
		deviceLabel: p.buy ? "Gerätekauf (einmalig)" : "Gerätemiete pro Jahr",
		deviceValue: p.buy ? "auf Anfrage" : `${n2(p.sM)} €`,
		separate: abr
			? "Die Gerätemiete bieten wir Ihnen in einem separaten Angebot an."
			: "Die Heizkostenabrechnung bieten wir Ihnen in einem separaten Angebot an.",
		requested:
			p.onRequest.length || p.extras.length
				? `Zusätzlich angefragt: ${[
						...p.onRequest.map((r) => `${r.n} × ${r.sub}`),
						...p.extras,
					].join(
						", ",
					)}. Richtwerte netto, den genauen Preis ergänzen wir im Angebot.`
				: "",
		closing: [
			`Auf das erste Vertragsjahr entfällt ein Betrag von ${n2(p.first)} €. Ab dem zweiten Vertragsjahr wird jährlich ein Betrag von ${n2(p.year)} € fällig.`,
			`Das Angebot ist gültig bis einschließlich ${dates.valid}. Für Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung und freuen uns auf die Zusammenarbeit.`,
			"Alle Preise verstehen sich zzgl. der gesetzlichen MwSt.",
		],
		greeting: "Mit freundlichen Grüßen",
		yearly,
		rental,
		once,
		terms: OFFER_TERMS,
		selfMounted: selfMounted
			? "Die Montage übernehmen Sie oder Ihr Hausinstallateur. Eine Installationspauschale fällt nicht an. Einbausätze, Rohr- und Sanitärarbeiten sind nicht enthalten."
			: "",
		checksIntro:
			"Grundlage dieses Angebots sind Ihre Angaben im Heidi Self-Service. Vor der Lieferung prüfen wir:",
		checks: c.checks.slice(0, 8),
	};
}
