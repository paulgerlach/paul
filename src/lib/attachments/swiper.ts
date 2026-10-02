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

		let instance: Swiper | undefined;
		const init = () => {
			instance = new Swiper(el, params);
			onInit?.(instance);
		};

		// A loop swiper that mounts hidden (the mobile-only ones on desktop) has
		// no size, so Swiper sees no slides, warns, and sets the loop up empty
		// (KI-29). Wait until it first gets a size.
		let observer: ResizeObserver | undefined;
		if (params.loop && el.offsetWidth === 0) {
			observer = new ResizeObserver(() => {
				if (el.offsetWidth === 0) return;
				observer?.disconnect();
				init();
			});
			observer.observe(el);
		} else {
			init();
		}

		return () => {
			observer?.disconnect();
			instance?.destroy(true, true);
		};
	};
}
