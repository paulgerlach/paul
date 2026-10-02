import {
	createClient as baseCreateClient,
	type Route,
} from "@prismicio/client";
import {
	enableAutoPreviews,
	type CreateClientConfig,
} from "@prismicio/svelte/kit";
import { env } from "$env/dynamic/public";
import sm from "../../slicemachine.config.json";

/** The project's Prismic repository name. */
export const repositoryName =
	env.PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/** Route Resolver objects that define how a document's `url` field is resolved. */
const routes: Route[] = [{ type: "blogpost", path: "/blog/:uid" }];

/**
 * Creates a Prismic client. Pass SvelteKit's `fetch` and `cookies` from a
 * `load` function so previews work and requests are deduplicated.
 */
export const createClient = ({
	cookies,
	...config
}: CreateClientConfig = {}) => {
	const client = baseCreateClient(repositoryName, { routes, ...config });

	enableAutoPreviews({ client, cookies });

	return client;
};
