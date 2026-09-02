# Offene Punkte (intern)

Interne Übersicht über das, was auf der Website noch fehlt oder vor einem
öffentlichen Go-Live geprüft/ergänzt werden sollte. Nicht Teil der
öffentlichen Seite, wird nirgends verlinkt.

## 0. Server-Konflikte (beim Abgleich mit dem echten public_html gefunden)

- [ ] **cPanel-Passwortschutz auf `public_html` ist aktuell aktiv** (sichtbar
  in der echten `.htaccess`: `AuthType Basic … Require valid-user`, von
  cPanel unter "Passwortgeschützte Verzeichnisse"/"Directory Privacy"
  verwaltet). Solange das aktiv ist, verlangt der Server von **jedem**
  Besucher – auch beim Kontaktformular-Aufruf – einen Login. **Muss vor dem
  öffentlichen Go-Live in cPanel deaktiviert werden** (nicht per Hand in der
  `.htaccess`, sondern über die cPanel-Oberfläche, sonst wird die Änderung
  ggf. wieder überschrieben).
- [x] **Kontaktformular-Feldnamen stimmten nicht mit `kontakt.php` überein**
  (`Vor--und-Nachname`/`Datenschutz` statt der von PHP erwarteten
  `Name-des-Anfragenden`/`Datenschutzzustimmung`) – jede Einsendung wäre
  serverseitig abgelehnt worden. Behoben (Feldnamen angeglichen, Absenden
  läuft jetzt per `fetch()`, siehe unten).
- [x] **`kontakt.html`-Abhängigkeit aufgelöst**: `kontakt.php` hat die alte
  Webflow-Datei früher als Antwortvorlage gelesen
  (`file_get_contents('../kontakt.html')`). Die Funktion `injectMessage()`
  setzt inzwischen nur noch den HTTP-Status, daher konnten die alten
  Webflow-Dateien inkl. `kontakt.html` gelöscht werden.

## 1. Rechtlich – vor Veröffentlichung zwingend zu klären

**Impressum (`src/pages/impressum.astro`) und Datenschutzerklärung
(`src/pages/datenschutz.astro`)** – inzwischen mit den echten Angaben aus dem
ursprünglichen Webflow-Konzept (`/impressum`, `/datenschutz` auf
lce-8ece05.webflow.io) befüllt: Handelsregister (Amtsgericht Ludwigshafen am
Rhein, HRB 5062), USt-IdNr. (DE423982643), Verantwortlich für den Inhalt
(Wolfgang van Vliet), Hosting-Anbieter (TWL-KOM) inkl. Server-Logfile-Details,
keine bestellte Datenschutzbeauftragte Person, zuständige Aufsichtsbehörde
(Landesbeauftragter für den Datenschutz und die Informationsfreiheit
Rheinland-Pfalz, Adresse ergänzt). Die Kontaktformular-Beschreibung in der
Datenschutzerklärung wurde an die tatsächlich abgefragten Felder angepasst
(Name, E-Mail, optional Telefon/Unternehmen, Kategorie, Nachricht).
- [ ] Trotzdem vor Go-Live einmal juristisch gegenlesen lassen (steht auch im
  Redaktionshinweis auf beiden Seiten) – insbesondere USt-IdNr. und
  Handelsregisterdaten an offizieller Stelle gegenprüfen.

## 2. Team-Einzelseiten – Inhalte

- [ ] **Individuelle Vorstellungstexte schreiben.** Die Kurzbios **aller**
  Teammitglieder (Wolfgang van Vliet, Constanze Kraus, Rainer Stäb,
  Dr. Frederik Allstädt, Frederik Verst, Carolin Köhler) sind aktuell
  **Platzhaltersätze** – bei Stäb/Allstädt/Verst sogar wortgleich, nur der
  Name ausgetauscht. Diese sollten durch echte, individuelle Texte ersetzt
  werden, die zur jeweiligen Person und Rolle passen.
- [ ] Persönliche LinkedIn-Profile von Wolfgang van Vliet und Constanze Kraus
  liegen nicht vor – falls gewünscht, URLs nachreichen, dann erscheint der
  persönliche LinkedIn-Button auf der jeweiligen Profilseite und in der vCard.
- [x] Geschäftsführung von Sonja Müller-Zaman auf Wolfgang van Vliet
  umgestellt (Über uns, Impressum, Datenschutzerklärung); Sonja Müller-Zaman
  vollständig von der Website entfernt (Team-Karte, Profilseite, vCard,
  Porträts).
- [x] Constanze Kraus (Unternehmenssteuerung und strategische Koordination)
  mit Profilseite, vCard, Durchwahl 224 und Mobilnummer ergänzt.
- [x] Persönliche LinkedIn-Profile für Dr. Frederik Allstädt und Carolin
  Köhler sind hinterlegt.

## 3. Sonstiges / nice-to-have (kein Blocker)

- [ ] Das Social-Media-Vorschaubild (Open Graph, `public/og-image.jpg`) ist
  aktuell für alle Seiten identisch. Optional könnten einzelne Seiten
  (z. B. Zukunftsquartiere) ein eigenes Vorschaubild bekommen.
- Die `@beispiel.de`-Adressen im Kontaktformular (Platzhalter-Text im
  Namensfeld, Fehlermeldung bei der E-Mail-Validierung) sind **beabsichtigt**
  und kein Fehler – nur zur Vollständigkeit hier aufgeführt, damit klar ist,
  dass sie geprüft und bewusst so belassen wurden.

## Bereits erledigt (zur Einordnung, nicht mehr offen)

- Kontaktformular: POST an `/formular/kontakt.php`, Honeypot-Feld – geprüft,
  entspricht der TWL-Vorgabe. Feldnamen inzwischen mit dem echten
  `kontakt.php` abgeglichen (siehe Punkt 0), Absenden per `fetch()` statt
  klassischer Formular-Navigation.
- Carolins persönliches LinkedIn ist hinterlegt (echtes, verifiziertes Profil).
- LCE-Unternehmens-LinkedIn ist eine echte, verifizierte URL (kein Platzhalter
  mehr), zentral gepflegt in `src/lib/team.ts`.
- **Favicon/Apple-Touch-Icon waren noch der alte Webflow-Platzhalter**
  (das "W"-Markenzeichen von Webflow selbst, nicht das LCE-Logo) – aus dem
  echten LCE-Logo neu erzeugt.
- Ungenutzte Bilder (16 Dateien) und CSS-Utility-Klassen entfernt.
- `Seo.astro`: falscher Firmenname im `og:site_name` und doppeltes "| LCE"
  im Seitentitel (auf Seiten, deren Titel "LCE" bereits enthielt) behoben;
  fehlende OG-/Twitter-Bild-Meta ergänzt.
- Neu: `llms.txt` für KI-Crawler ergänzt.
- DSGVO-Audit durchgeführt: Schriftarten sind vollständig selbst gehostet
  (kein Google-Fonts-CDN), keine Cookies, kein externes Tracking, der einzige
  externe Link (Google-Maps-Kartenlink auf `/kontakt`) ist ein normaler
  ausgehender Link (kein eingebettetes iframe) – keine Beanstandungen.
- Bildnachweis ergänzt: dezenter grauer Hinweis unter den Fotos/Grafiken
  (Team-Porträts bewusst ohne Hinweis am Bild), "Bild N" verlinkt direkt auf
  den passenden Eintrag im Abschnitt "Bildnachweis" im Impressum.
- `kontakt.php`: liest jetzt auch Telefon/Unternehmen/Kategorie aus (vorher
  stillschweigend ignoriert) und verschickt eine formatierte HTML-Mail statt
  einer reinen Textzeile.
