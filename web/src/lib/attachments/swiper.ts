import Swiper from "swiper";
import type { SwiperOptions } from "swiper/types";
import type { Attachment } from "svelte/attachments";

/**
 * Mounts Swiper core on a `.swiper` element (replaces `swiper/react`).
 *
 * Like `swiper/react`, `navigation: true` / `pagination: true` (or an object
 * without `prevEl`/`nextEl`/`el`) use the `.swiper-button-prev`,
 * `.swiper-button-next` and `.swiper-pagination` elements that are direct
 * children of the container. The markup must render those itself.
 */
export function swiper(
	options: SwiperOptions,
	onInit?: (instance: Swiper) => void,
): Attachment<HTMLElement> {
	return (el) => {
		const child = (cls: string) =>
			el.querySelector<HTMLElement>(`:scope > .${cls}`);
		const params: SwiperOptions = { ...options };

		if (params.navigation) {
			const nav = params.navigation === true ? {} : params.navigation;
			if (nav.prevEl === undefined || nav.nextEl === undefined) {
				params.navigation = {
					...nav,
					prevEl: child("swiper-button-prev"),
					nextEl: child("swiper-button-next"),
				};
			}
		}
		if (params.pagination) {
			const pag = params.pagination === true ? {} : params.pagination;
			if (pag.el === undefined) {
				params.pagination = { ...pag, el: child("swiper-pagination") };
			}
		}

		const instance = new Swiper(el, params);
		onInit?.(instance);
		return () => instance.destroy(true, true);
	};
}
