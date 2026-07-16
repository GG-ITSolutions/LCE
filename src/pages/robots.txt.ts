import type { APIRoute } from "astro";

// The free GitHub Pages preview is a separate, non-canonical copy of the site — search
// engines must never crawl or index it instead of (or alongside) the real production domain.
const isPreviewBuild = process.env.DEPLOY_TARGET === "gh-pages";

export const GET: APIRoute = ({ site }) => {
  if (isPreviewBuild) {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const sitemapURL = new URL("sitemap-index.xml", site);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL}\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
