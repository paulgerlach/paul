/**
 * The device photos by key (the design's .ipim-* backgrounds): `/geraete`'s
 * four and the design's three water meters.
 */
import heizkostenverteiler from "$lib/assets/landing/funkzaehler/heizkostenverteiler.webp?enhanced";
import kaltwasserzaehler from "$lib/assets/landing/funkzaehler/kaltwasserzaehler.webp?enhanced";
import waermemengenzaehler from "$lib/assets/landing/funkzaehler/waermemengenzaehler.webp?enhanced";
import warmwasserzaehler from "$lib/assets/landing/funkzaehler/warmwasserzaehler.webp?enhanced";
import aufputz from "$lib/assets/landing/interoperabilitaet/aufputz-wasserzaehler.webp?enhanced";
import messkapsel from "$lib/assets/landing/interoperabilitaet/messkapselzaehler.webp?enhanced";
import wasser from "$lib/assets/landing/interoperabilitaet/wasserzaehler.webp?enhanced";
import type { Picture } from "vite-imagetools";
import type { DeviceImage } from "./content";

export const DEVICE_PHOTOS: Record<DeviceImage, Picture> = {
	hkv: heizkostenverteiler,
	kwz: kaltwasserzaehler,
	wwz: warmwasserzaehler,
	wmz: waermemengenzaehler,
	wasser,
	messkapsel,
	aufputz,
};
