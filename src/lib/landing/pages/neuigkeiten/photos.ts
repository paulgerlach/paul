/**
 * The story photos by key (`PhotoKey` in content.ts). Every one but the
 * Portfolio-Checker screenshot is another page's photo, byte-identical to the
 * design's (plan README).
 */
import buildingWide from "$lib/assets/landing/vorgehen/building-wide.webp?enhanced";
import consultation from "$lib/assets/landing/vorgehen/consultation.webp?enhanced";
import installer from "$lib/assets/landing/vorgehen/installer.webp?enhanced";
import kitchenMeters from "$lib/assets/landing/vorgehen/kitchen-meters.webp?enhanced";
import office from "$lib/assets/landing/vorgehen/office.webp?enhanced";
import portalTenant from "$lib/assets/landing/mieterportal/tenant.jpg?enhanced";
import uviTenant from "$lib/assets/landing/verbrauchsinformation/tenant.jpg?enhanced";
import portfolioChecker from "$lib/assets/landing/neuigkeiten/portfolio-checker.webp?enhanced";
import beratung from "$lib/assets/landing/selbstabrechnung/beratung.webp?enhanced";
import manager from "$lib/assets/landing/weg-verwaltung/manager.webp?enhanced";
import type { ImageAsset } from "$lib/components/Basic/Image/types";
import type { PhotoKey } from "./content";

export const photos: Record<PhotoKey, ImageAsset> = {
	office,
	kitchenMeters,
	installer,
	consultation,
	buildingWide,
	portalTenant,
	uviTenant,
	portfolioChecker,
	beratung,
	manager,
};
