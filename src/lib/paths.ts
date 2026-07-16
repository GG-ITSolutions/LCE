/**
 * Prefixes a root-relative path with Astro's configured `base` (e.g. "/LCE/" on the
 * GitHub Pages preview, "/" in production). Plain string hrefs don't get this treatment
 * automatically — only imported assets do — so every internal link/icon href must go
 * through this helper.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}` || "/";
}
