// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { LandingChrome } from "$lib/landing/chrome";
import type { SeoData } from "$lib/seo/site";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			seo?: SeoData;
			/** Header texts of a landing page, read by the landing layout. */
			landing?: LandingChrome;
		}
		// interface PageState {}
		// interface Platform {}
	}

	namespace Superforms {
		type Message = { type: "success" | "error"; text: string };
	}
}

export {};
