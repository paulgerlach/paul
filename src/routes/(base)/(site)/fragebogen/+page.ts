import type { PageLoad } from "./$types";

export const load: PageLoad = () => ({ seo: { noindex: true } });
