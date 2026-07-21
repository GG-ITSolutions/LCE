# Deployment auf cPanel (TWL-Hosting)

Diese Anleitung beschreibt, wie die fertige LCE-Website auf dem **echten Produktiv-Webspace bei TWL (cPanel)** veröffentlicht wird. Das ist etwas anderes als die GitHub-Pages-Vorschau (`https://gg-itsolutions.github.io/LCE/`) – diese dient nur der internen Abstimmung und ist über `noindex`/`robots.txt` von Suchmaschinen ausgeschlossen. Die eigentliche, öffentliche Seite läuft über cPanel unter der echten Domain (`www.lce-ludwigshafen.de`).

## 1. Voraussetzungen

- Node.js (Version 18 oder neuer) auf dem Rechner, von dem aus gebaut wird.
- Ein lokaler Checkout dieses Repositories.
- Zugangsdaten zum cPanel bzw. FTP-Zugang von TWL.

Einmalig im Projektordner:

```bash
npm install
```

## 2. Produktions-Build erzeugen

Wichtig: **kein** `DEPLOY_TARGET` setzen. Diese Variable wird ausschließlich von der GitHub-Actions-Vorschau gesetzt (`DEPLOY_TARGET=gh-pages`) und sorgt dort dafür, dass die Seite unter dem Unterpfad `/LCE/` ausgeliefert wird. Für cPanel soll die Seite auf der Domain-Root laufen, also einfach:

```bash
npm run build
```

Das erzeugt den Ordner `dist/` mit `base: '/'` (siehe `astro.config.mjs`) – alle Links, Bilder und die Sitemap sind dann korrekt für die eigene Domain gebaut, nicht für einen Unterordner.

## 3. Was in `dist/` liegt

Nach dem Build enthält `dist/` ausschließlich statische Dateien, die direkt auf einen Webspace passen:

- HTML-Seiten (`index.html`, `ueber-uns/index.html`, usw.)
- CSS/JS/Bilder (gehasht, für Browser-Caching)
- `sitemap-index.xml` und `sitemap-0.xml` (automatisch von `@astrojs/sitemap`)
- `robots.txt`
- `404.html` (aus `src/pages/404.astro`)

Hinweis zu 404-Seiten: Viele Apache-Setups bei cPanel erkennen `404.html` im Zielverzeichnis automatisch. Falls nicht, in einer `.htaccess` im selben Verzeichnis ergänzen:

```apache
ErrorDocument 404 /404.html
```

## 4. Upload per cPanel-Dateimanager (empfohlen)

1. Lokal **den Inhalt** von `dist/` zippen (nicht den Ordner `dist` selbst, sondern die Dateien darin, damit `index.html` direkt auf oberster Ebene im Zip liegt).
2. In cPanel: **Dateimanager** öffnen → in `public_html` wechseln (bzw. das Zielverzeichnis, falls die Domain auf einen Unterordner zeigt).
3. Falls dort schon eine ältere Version liegt: vorher sichern bzw. bei Strukturänderungen alten Inhalt leeren, um verwaiste Dateien zu vermeiden.
4. Zip hochladen, per Rechtsklick „Extract“ entpacken, das Zip anschließend löschen.

### Alternative: FTP

Mit den von TWL bereitgestellten FTP-Zugangsdaten und einem Client wie FileZilla den Inhalt von `dist/` 1:1 nach `public_html` hochladen/synchronisieren.

## 5. Wichtiger Hinweis: `/formular/kontakt.php`

Das Kontaktformular sendet per `POST` an `/formular/kontakt.php`. Dieses PHP-Skript ist **nicht** Teil dieses Repos – es wird separat von TWL bereitgestellt/gepflegt und muss auf dem Server bereits unter genau diesem Pfad liegen. Ohne dieses Skript läuft das Formular ins Leere (404 beim Absenden).

Nach dem Go-Live einmal testweise das Formular ausfüllen und abschicken, um den kompletten Weg (Formular → `kontakt.php` → E-Mail-Zustellung) zu prüfen.

## 6. Erneutes Deployment (bei künftigen Änderungen)

Gleicher Ablauf wie oben: `npm run build` → neuen `dist/`-Inhalt hochladen und den alten Inhalt im Zielverzeichnis ersetzen.

## 7. Unterschied zur GitHub-Pages-Vorschau

| | GitHub Pages (Vorschau) | cPanel (TWL, Produktiv) |
|---|---|---|
| Zweck | interne Abstimmung/Review | öffentliche Live-Seite |
| Pfad | `/LCE/`-Unterpfad | Domain-Root |
| Build-Befehl | automatisch per CI mit `DEPLOY_TARGET=gh-pages` | manuell mit `npm run build` (ohne `DEPLOY_TARGET`) |
| Suchmaschinen | ausgeschlossen (`noindex`, `robots.txt`) | normal indexierbar |
