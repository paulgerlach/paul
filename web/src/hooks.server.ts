import type { HandleServerError } from "@sveltejs/kit";

export const handleError: HandleServerError = ({ error, event, status }) => {
	if (status !== 404) {
		console.error(`[${event.request.method} ${event.url.pathname}]`, error);
	}
};
