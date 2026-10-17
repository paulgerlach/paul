/**
 * Customer logos of the landing pages' logo strip. Every landing page uses
 * them, each in its own order (the city designs shuffle them).
 */
import type { ImageAsset } from "$lib/components/Basic/Image/types";
import berlin from "$lib/assets/landing/logos/berlin.png?enhanced";
import dumax from "$lib/assets/landing/logos/dumax.png?enhanced";
import lhm from "$lib/assets/landing/logos/lhm.png?enhanced";
import harte from "$lib/assets/landing/logos/harte.png?enhanced";
import hsp from "$lib/assets/landing/logos/hsp.png?enhanced";
import neckar from "$lib/assets/landing/logos/neckar.png?enhanced";
import niesen from "$lib/assets/landing/logos/niesen.png?enhanced";
import progera from "$lib/assets/landing/logos/progera.png?enhanced";
import raumgold from "$lib/assets/landing/logos/raumgold.png?enhanced";
import schleicher from "$lib/assets/landing/logos/schleicher.png?enhanced";
import vitec from "$lib/assets/landing/logos/vitec.png?enhanced";
import wagner from "$lib/assets/landing/logos/wagner.png?enhanced";
import werne from "$lib/assets/landing/logos/werne.png?enhanced";

export type CustomerLogo = {
	src: ImageAsset;
	alt: string;
	/** Display height in px, chosen in the design to balance the logos optically. */
	h: number;
};

export const customerLogos = {
	berlin: { src: berlin, alt: "Berlin", h: 43.7 },
	dumax: { src: dumax, alt: "Dumax", h: 42.0 },
	harte: { src: harte, alt: "Harte Hausverwaltung", h: 42.4 },
	hsp: { src: hsp, alt: "HSP", h: 37.7 },
	raumgold: { src: raumgold, alt: "raumgold", h: 36.2 },
	schleicher: { src: schleicher, alt: "Schleicher", h: 52.0 },
	vitec: { src: vitec, alt: "Vitec", h: 44.2 },
	wagner: { src: wagner, alt: "Wagner", h: 32.2 },
	werne: { src: werne, alt: "Werne Immobilien", h: 45.6 },
	neckar: { src: neckar, alt: "Neckar Immobilienverwaltung", h: 30.7 },
	niesen: { src: niesen, alt: "Niesen", h: 52.0 },
	progera: { src: progera, alt: "Pro Gera Immobilien", h: 36.7 },
	/** Only on the München page, in place of "Berlin". */
	lhm: { src: lhm, alt: "Landeshauptstadt München", h: 40 },
} satisfies Record<string, CustomerLogo>;

export type LogoKey = keyof typeof customerLogos;

/** The order of the /messdienstwechsel design, also Berlin's. */
export const DEFAULT_LOGO_ORDER: LogoKey[] = [
	"berlin",
	"dumax",
	"harte",
	"hsp",
	"raumgold",
	"schleicher",
	"vitec",
	"wagner",
	"werne",
	"neckar",
	"niesen",
	"progera",
];
