import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import { error } from "@sveltejs/kit";

// Dev-only showcase of the shared components (migration phase 3). Delete
// before cutover. KITCHEN_SINK=1 enables it in production builds for e2e.
export const load = () => {
	if (!dev && !env.KITCHEN_SINK) error(404);
	return { seo: { noindex: true } };
};
