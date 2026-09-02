import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'https://www.lce-ludwigshafen.de';
// GitHub Pages project preview is served from a /LCE/ subpath; production (own webserver) is served from the domain root.
const base = process.env.DEPLOY_TARGET === 'gh-pages' ? '/LCE' : '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'never',
  // Ehemalige Profilseite von Sonja Müller-Zaman: die Adresse wurde per vCard
  // verteilt und ist ggf. extern verlinkt. Statt eines 404 leitet sie auf die
  // Team-Übersicht – bewusst nicht auf eine andere Person, sonst landet man
  // unter ihrem Namen auf einem fremden Profil.
  redirects: {
    '/team/sonja-mueller-zaman': '/ueber-uns#team',
  },
  integrations: [sitemap()],
});
