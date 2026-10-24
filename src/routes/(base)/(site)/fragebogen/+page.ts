import type { PageLoad } from "./$types";

// noindex rather than a robots.txt Disallow, which would keep Google from
// seeing it and could still list the bare URL (KI-38).
export const load: PageLoad = () => ({ seo: { noindex: true } });
