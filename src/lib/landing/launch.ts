/**
 * False until the cutover: the pages behind a go-live gate render noindex and
 * stay out of the sitemap, and only the `live` cities are indexed. Set it to
 * true as the last cutover step (ongoing-tasks/cutover.md §3), once every gate
 * in ongoing-tasks/go-live-gates.md is done.
 */
export const LAUNCHED: boolean = false;
