/**
 * While false, the pages behind a go-live gate render noindex and stay out of
 * the sitemap, and only the `live` cities are indexed. True since 2026-10-23,
 * after the business signed off the gates, so the SEO review sees the preview
 * as it goes live; the items still open are at the top of
 * ongoing-tasks/go-live-gates.md.
 */
export const LAUNCHED: boolean = true;
