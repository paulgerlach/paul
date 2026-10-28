import { expect } from "@playwright/test";
import { LAUNCHED } from "../src/lib/landing/launch.ts";

export { LAUNCHED };

/** The robots tag of a page behind a go-live gate: `noindex` until `LAUNCHED`. */
export const GATED_ROBOTS = LAUNCHED ? "index, follow" : "noindex";

/** Expects a gated page in the sitemap once `LAUNCHED`, and out of it until then. */
export const expectGated = (sitemap: string) =>
	LAUNCHED ? expect(sitemap) : expect(sitemap).not;
