import type { ParamMatcher } from "@sveltejs/kit";
import {
	isCitySlug,
	type CitySlug,
} from "$lib/landing/pages/messdienstanbieter-city/cities";

/** Only the cities in `CITIES` have a page; anything else 404s. */
export const match = ((param: string): param is CitySlug =>
	isCitySlug(param)) satisfies ParamMatcher;
