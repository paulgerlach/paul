import type { ImageAsset } from "$lib/components/Basic/Image/types";

/** SVGs keep their intrinsic size, like next/image static imports did. */
const svg = (src: string, w: number, h: number): ImageAsset => ({
	sources: {},
	img: { src, w, h },
});

import caract_mind from "$lib/assets/caract_mind.png?enhanced";
import checkmark_icon_big from "$lib/assets/checkmark_icon_big.png?enhanced";
import checkmark_shield from "$lib/assets/checkmark_shield.png?enhanced";
import chess_shield from "$lib/assets/chess_shield.png?enhanced";
import chevron from "$lib/assets/chevron.png?enhanced";
import counter from "$lib/assets/counter.png?enhanced";
import eu_elipse from "$lib/assets/eu_elipse.png?enhanced";
import info from "$lib/assets/info.png?enhanced";
import lock from "$lib/assets/lock.png?enhanced";
import no_icon from "$lib/assets/no_icon.png?enhanced";
import private_person_icon from "$lib/assets/private_person.png?enhanced";
import group_icon from "$lib/assets/group.png?enhanced";
import fund_icon from "$lib/assets/fund.png?enhanced";
import small_counter from "$lib/assets/small_counter.png?enhanced";
import trustpilot from "$lib/assets/trustpilot.png?enhanced";
import yes_icon from "$lib/assets/yes_icon.png?enhanced";
import linkUrl from "$lib/assets/link.svg";
const link = svg(linkUrl, 640, 512);

import max_chat_avatar from "$lib/assets/max_chat_avatar.png?enhanced";
import immobilien_1_50 from "$lib/assets/immobilien_1_50.png?enhanced";
import immobilien_51_800 from "$lib/assets/immobilien_51_800.png?enhanced";
import immobilien_over_800 from "$lib/assets/immobilien_over_800.png?enhanced";
import info_circle_grey from "$lib/assets/info_circle_grey.png?enhanced";
import zufrieden_check from "$lib/assets/zufrieden_check.png?enhanced";
import teils_teils_scale from "$lib/assets/teils_teils_scale.png?enhanced";
import unzufrieden_x from "$lib/assets/unzufrieden_x.png?enhanced";

export {
	caract_mind,
	checkmark_icon_big,
	checkmark_shield,
	chess_shield,
	chevron,
	counter,
	eu_elipse,
	info,
	lock,
	no_icon,
	private_person_icon,
	group_icon,
	fund_icon,
	small_counter,
	trustpilot,
	yes_icon,
	link,
	max_chat_avatar,
	immobilien_1_50,
	immobilien_51_800,
	immobilien_over_800,
	info_circle_grey,
	zufrieden_check,
	teils_teils_scale,
	unzufrieden_x,
};
