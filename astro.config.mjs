import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://www.lce-ludwigshafen.de';
// GitHub Pages project preview is served from a /LCE/ subpath; production (own webserver) is served from the domain root.
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/LCE' : '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  integrations: [sitemap()],
});
