# LCE Website

Neue Website der LU-City Entwicklungs-GmbH (LCE), gebaut mit [Astro](https://astro.build) als statische Seite.

## Entwicklung

```bash
npm install
npm run dev       # lokaler Entwicklungsserver
npm run build     # produktions-Build nach dist/
npm run preview   # den Build lokal ansehen
```

## Deployment

- **Produktiv**: `npm run build` erzeugt in `dist/` reines HTML/CSS/JS. Dieser Ordner wird auf den
  eigenen Webserver hochgeladen (das Kontaktformular sendet dort per `POST` an `/formular/kontakt.php`).
- **Kostenlose Vorschau**: Der Workflow unter `.github/workflows/deploy-preview.yml` baut die Seite bei
  jedem Push automatisch und veröffentlicht sie über GitHub Pages. Dafür einmalig unter
  *Settings → Pages* die Quelle auf "GitHub Actions" stellen.

## Offene Punkte

- `/impressum` und `/datenschutz` enthalten Platzhalter (Handelsregisternummer, USt-IdNr., Hosting-Anbieter
  etc.), die vor Veröffentlichung ergänzt und juristisch geprüft werden sollten.
- Der Vorstellungstext auf `/team/carolin-koehler` ist ein Platzhalter und sollte ersetzt werden.
- Bilder liegen unter `src/assets/images/` (werden von Astro automatisch responsive/optimiert ausgeliefert),
  Dokumente unter `public/documents/`.
