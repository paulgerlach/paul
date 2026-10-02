import {
	blog_group_link,
	modal_bell,
	modal_building,
	modal_chart,
	modal_cooler,
	modal_gear,
	modal_grid,
	modal_heater,
	modal_list,
	modal_shower,
	modal_water,
	modal_wifi,
} from "$lib/assets/icons";
import {
	ROUTE_BLOG,
	ROUTE_FUNKTIONEN,
	ROUTE_GERAETE,
	ROUTE_PREISE,
} from "$lib/routes";
import type { PostSummary } from "$lib/server/blog";
import type { NavGroupType } from "$lib/types";

/**
 * Nav data shared by the site `Header` and the landing page `LandingHeader`,
 * so both show the same links. Each header has only its own markup.
 */

export const LOGIN_URL = "https://platform.heidisystems.com/";
export const PHONE = "+49 30 52001352";
export const PHONE_HREF = "tel:+493052001352";

/** Plain links after the dropdown groups. */
export const navLinks = [
	{ title: "Kunden", href: "/#kunden" },
	{ title: "Preise", href: ROUTE_PREISE },
];

export function buildNavGroups(posts: PostSummary[]): NavGroupType[] {
	return [
		{
			groupLinks: [
				{ icon: modal_heater, title: "Heizungszähler" },
				{ title: "Warmwasserzähler", icon: modal_water },
				{ title: "Kaltwasserzähler", icon: modal_shower },
				{ icon: modal_wifi, title: "Rauchmelder" },
				{ title: "Feuerlöscher", icon: modal_cooler },
				{ icon: modal_heater, title: "Sonstiges" },
			],
			route: ROUTE_GERAETE,
			title: "Geräte",
			groupTitle: "Unsere Produkte",
			highlight: "geraete",
		},
		{
			route: ROUTE_FUNKTIONEN,
			title: "Funktionen",
			groupTitle: "Funktionen",
			highlight: "funktionen",
			groupLinks: [
				{ title: "Betriebskosten", icon: modal_gear },
				{ title: "Heizkostenabrechnung", icon: modal_list },
				{ title: "Echtzeit Verbrauch", icon: modal_chart },
				{ title: "Dashboard", icon: modal_grid },
				{ title: "Immobilienmanagement", icon: modal_building },
				{ title: "Benachrichtigungen", icon: modal_bell },
			],
		},
		...(posts[0]
			? [
					{
						route: ROUTE_BLOG,
						title: "Blog",
						groupTitle: "Unsere Blog Artikel",
						highlight: "blog" as const,
						groupLinks: posts
							.filter((post) => post.title)
							.map((post) => ({
								title: post.title,
								icon: blog_group_link,
								link: `${ROUTE_BLOG}/${post.uid}`,
							})),
					},
				]
			: []),
	];
}
