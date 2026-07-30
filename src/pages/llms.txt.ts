import type { APIRoute } from "astro";

// llms.txt (siehe llmstxt.org): kurze, strukturierte Zusammenfassung der Seite
// für KI-Assistenten/LLM-Crawler – ergänzt robots.txt/sitemap, ersetzt sie nicht.
// Auf der GitHub-Pages-Vorschau (nicht-kanonische Kopie) bewusst nur ein Minimalhinweis,
// aus demselben Grund wie bei robots.txt (kein Index-/Referenz-Ziel für Crawler).
const isPreviewBuild = process.env.DEPLOY_TARGET === "gh-pages";

export const GET: APIRoute = ({ site }) => {
  if (isPreviewBuild) {
    return new Response("# Vorschau-Build – nicht die produktive LCE-Website.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const url = (path: string) => new URL(path, site).toString();

  const body = `# LU-City Entwicklungs-GmbH (LCE)

> Die LCE ist die kommunale Entwicklungsgesellschaft der Stadt Ludwigshafen am Rhein und der GAG Ludwigshafen. Sie entwickelt und vermarktet die Zukunftsquartiere entlang der geplanten Helmut-Kohl-Allee.

Die LCE bereitet städtebauliche Planungen vor und steuert sie: Beauftragung und Koordination von Untersuchungen, Planungs- und Machbarkeitsstudien, Werkstattverfahren und Rahmenplanung sowie die anschließende Bauleitplanung. Sie ist Schnittstelle zwischen Stadtverwaltung, Politik, Investor:innen und weiteren Beteiligten.

## Seiten

- [Startseite](${url("/")}): Überblick über die LCE und Kennzahlen zu den Zukunftsquartieren.
- [Über uns](${url("/ueber-uns")}): Auftrag, Historie (seit 2003) und Team der LCE.
- [Zukunftsquartiere](${url("/zukunftsquartiere")}): Städtebauliches Projekt an der Helmut-Kohl-Allee – Bausteine, Standortvorteile, Planungsstand, Downloads.
- [Kontakt](${url("/kontakt")}): Kontaktformular, Ansprechpartner:innen, FAQ.

## Unternehmen

- Name: LU-City Entwicklungs-GmbH (LCE)
- Gesellschafter: Stadt Ludwigshafen am Rhein, GAG Ludwigshafen
- Sitz: Mundenheimer Str. 182, 67061 Ludwigshafen am Rhein
- Handelsregister: Amtsgericht Ludwigshafen am Rhein, HRB 5062

## Optional

- [Impressum](${url("/impressum")})
- [Datenschutzerklärung](${url("/datenschutz")})
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
