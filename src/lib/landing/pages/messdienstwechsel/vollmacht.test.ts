import { describe, expect, it } from "vitest";
import { ADDRESS } from "$lib/company";
import { plainText } from "$lib/landing/pages/muster-kuendigung/letter";
import {
	POWER_KEYS,
	VOLLMACHT_FIELD_KEYS,
	vollmachtText,
	type PowerKey,
	type VollmachtFieldKey,
} from "./content";
import {
	buildVollmacht,
	vollmachtFileName,
	type VollmachtInput,
} from "./vollmacht";

const empty = () =>
	Object.fromEntries(VOLLMACHT_FIELD_KEYS.map((k) => [k, ""])) as Record<
		VollmachtFieldKey,
		string
	>;
const all = (on: boolean) =>
	Object.fromEntries(POWER_KEYS.map((k) => [k, on])) as Record<
		PowerKey,
		boolean
	>;

const input = (over: Partial<VollmachtInput> = {}): VollmachtInput => ({
	fields: empty(),
	powers: all(true),
	today: "27.10.2026",
	...over,
});

describe("buildVollmacht", () => {
	it("writes the design's template with placeholders for empty fields", () => {
		expect(plainText(buildVollmacht(input()))).toBe(
			[
				"Vollmacht zum Wechsel des Messdienstes",
				"Vollmachtgeber:\n[Name der Verwaltung oder des Eigentümers]\n[Straße, Hausnummer]\n[PLZ Ort]",
				"Bevollmächtigte:\nHeidi Systems GmbH\nMonbijouplatz 4, 10178 Berlin",
				"Hiermit bevollmächtigen wir die Heidi Systems GmbH, uns gegenüber unserem bisherigen Messdienstleister [Name des Messdienstleisters] im Zusammenhang mit dem Wechsel des Messdienstes für die folgende Liegenschaft zu vertreten:",
				"• [Adresse der Liegenschaft]",
				"Die Vollmacht umfasst insbesondere, in unserem Namen\n• den bestehenden Vertrag über Messdienstleistungen fristgerecht zum nächstmöglichen Zeitpunkt zu kündigen,\n• Auskünfte über Vertragslaufzeit und Kündigungsfristen einzuholen und das Vertragsende bestätigen zu lassen,\n• Ablese- und Verbrauchswerte sowie die für die Abrechnung notwendigen Daten zum Stichtag anzufordern und entgegenzunehmen,\n• Fragen zu Miete, Kauf und Abbau der installierten Messgeräte zu klären und Termine abzustimmen.",
				"Die Vollmacht gilt bis auf schriftlichen Widerruf. Wir bitten den bisherigen Messdienstleister, Schriftverkehr zum Wechsel direkt mit der Heidi Systems GmbH zu führen.",
				"[Ort], 27.10.2026",
				"[Vor- und Nachname]",
			].join("\n\n"),
		);
	});

	it("fills the fields, the contract number and several properties", () => {
		const fields = {
			...empty(),
			sName: "Muster GmbH",
			sStr: "Beispielstraße 1",
			sOrt: "10115 Berlin",
			sPers: "Erika Muster",
			sFunk: "Geschäftsführung",
			mName: "Messdienst A",
			mNr: " 4711 ",
			lieg: "Lindenallee 12\n\n Gartenweg 3 ",
		};
		const text = plainText(buildVollmacht(input({ fields })));
		expect(text).toContain(
			"Messdienstleister Messdienst A (Vertrags-/Kundennr. 4711) im Zusammenhang mit dem Wechsel des Messdienstes für die folgenden Liegenschaften zu vertreten:\n\n• Lindenallee 12\n• Gartenweg 3",
		);
		expect(text).toContain("\n\nBerlin, 27.10.2026\n\n");
		expect(text.endsWith("Erika Muster\nGeschäftsführung\nMuster GmbH")).toBe(
			true,
		);
	});

	it("marks only empty fields as placeholders", () => {
		const fields = { ...empty(), mName: "Messdienst A" };
		const segments = buildVollmacht(input({ fields })).flatMap((p) =>
			p.lines.flat(),
		);
		expect(segments.find((s) => s.text === "Messdienst A")?.placeholder).toBe(
			undefined,
		);
		expect(
			segments.filter((s) => s.placeholder).map((s) => s.text),
		).not.toContain("[Name des Messdienstleisters]");
	});

	it("ends the last granted power with a full stop and drops the list without one", () => {
		const some = buildVollmacht(
			input({ powers: { ...all(false), ende: true, kuend: true } }),
		);
		expect(plainText(some)).toContain(
			"in unserem Namen\n• den bestehenden Vertrag über Messdienstleistungen fristgerecht zum nächstmöglichen Zeitpunkt zu kündigen,\n• Auskünfte über Vertragslaufzeit und Kündigungsfristen einzuholen und das Vertragsende bestätigen zu lassen.",
		);
		expect(
			plainText(buildVollmacht(input({ powers: all(false) }))),
		).not.toContain(vollmachtText.powersIntro);
	});

	it("names Heidi as ADDRESS does (the design writes the street out)", () => {
		expect(vollmachtText.agent[0]).toBe(ADDRESS.company);
		expect(vollmachtText.agent[1].endsWith(ADDRESS.city)).toBe(true);
	});
});

describe("vollmachtFileName", () => {
	it("names the file after the principal, Heidi without one", () => {
		expect(vollmachtFileName("Muster Hausverwaltung GmbH", "docx")).toBe(
			"Vollmacht-Messdienstwechsel-Muster-Hausverwaltung-GmbH.docx",
		);
		expect(vollmachtFileName("", "pdf")).toBe(
			"Vollmacht-Messdienstwechsel-Heidi.pdf",
		);
		expect(vollmachtFileName("%%%", "pdf")).toBe(
			"Vollmacht-Messdienstwechsel-Heidi.pdf",
		);
	});
});
