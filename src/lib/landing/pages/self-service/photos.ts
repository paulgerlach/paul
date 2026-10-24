/**
 * The page's photos. The six devices are /geraete's and the dashboard is
 * /vorgehen's, byte-identical to the design's; the capsules, the other
 * meter, the heat meter's site, the statement and the signature are new.
 */
import gateway from "$lib/assets/landing/funkzaehler/gateway.webp?enhanced";
import hkv from "$lib/assets/landing/funkzaehler/heizkostenverteiler.webp?enhanced";
import kwz from "$lib/assets/landing/funkzaehler/kaltwasserzaehler.webp?enhanced";
import rwm from "$lib/assets/landing/funkzaehler/rauchwarnmelder.webp?enhanced";
import wmz from "$lib/assets/landing/funkzaehler/waermemengenzaehler.webp?enhanced";
import wwz from "$lib/assets/landing/funkzaehler/warmwasserzaehler.webp?enhanced";
import capsuleCold from "$lib/assets/landing/self-service/capsule-cold.webp?enhanced";
import capsuleWarm from "$lib/assets/landing/self-service/capsule-warm.webp?enhanced";
import heatMeterSite from "$lib/assets/landing/self-service/heat-meter-site.webp?enhanced";
import otherMeter from "$lib/assets/landing/self-service/other-meter.webp?enhanced";
import signature from "$lib/assets/landing/self-service/signature.png?enhanced";
import statement from "$lib/assets/landing/self-service/statement.webp?enhanced";
import dashboard from "$lib/assets/landing/vorgehen/dashboard.webp?enhanced";
import type { ImageAsset } from "$lib/components/Basic/Image/types";
import type { DevKey } from "./wizard/data";

export const DEVICE_PHOTOS: Record<DevKey, ImageAsset> = {
	kwz,
	wwz,
	wmz,
	hkv,
	rwm,
	weitere: otherMeter,
};

/** A water meter under plaster is shown as its capsule (`gimg`). */
export const CAPSULES: Partial<Record<DevKey, ImageAsset>> = {
	kwz: capsuleCold,
	wwz: capsuleWarm,
};

/** "So sollte es aussehen": the example of an installation site. */
export const SITE_PHOTOS: Partial<Record<DevKey, ImageAsset>> = {
	wmz: heatMeterSite,
};

export const PHOTOS = { gateway, statement, dashboard, signature };

/** The offer's feature tiles. */
export const FEATURE_PHOTOS = { statement, dashboard, meter: kwz };
