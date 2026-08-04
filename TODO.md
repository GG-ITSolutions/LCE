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
- **`kontakt.html`** (alte Webflow-Datei in `public_html`) **nicht löschen**:
  `kontakt.php` liest diese Datei synchron als Antwortvorlage
  (`file_get_contents('../kontakt.html')`). Seit dem `fetch()`-Fix wird diese
  Antwort im Browser zwar nicht mehr angezeigt, aber ohne die Datei würde das
  PHP-Skript einen Fehler werfen. Bleibt bis auf Weiteres bestehen (kein
  Blocker, nur nicht aus Versehen mit aufräumen).

## 1. Rechtlich – vor Veröffentlichung zwingend zu klären

**Impressum (`src/pages/impressum.astro`) und Datenschutzerklärung
(`src/pages/datenschutz.astro`)** – inzwischen mit den echten Angaben aus dem
ursprünglichen Webflow-Konzept (`/impressum`, `/datenschutz` auf
lce-8ece05.webflow.io) befüllt: Handelsregister (Amtsgericht Ludwigshafen am
Rhein, HRB 5062), USt-IdNr. (DE423982643), Verantwortlich für den Inhalt
(Sonja Müller-Zaman), Hosting-Anbieter (TWL-KOM) inkl. Server-Logfile-Details,
keine bestellte Datenschutzbeauftragte Person, zuständige Aufsichtsbehörde
(Landesbeauftragter für den Datenschutz und die Informationsfreiheit
Rheinland-Pfalz, Adresse ergänzt). Die Kontaktformular-Beschreibung in der
Datenschutzerklärung wurde an die tatsächlich abgefragten Felder angepasst
(Name, E-Mail, optional Telefon/Unternehmen, Kategorie, Nachricht).
- [ ] Trotzdem vor Go-Live einmal juristisch gegenlesen lassen (steht auch im
  Redaktionshinweis auf beiden Seiten) – insbesondere USt-IdNr. und
  Handelsregisterdaten an offizieller Stelle gegenprüfen.

## 2. Team-Einzelseiten – Inhalte

- [ ] **Individuelle Vorstellungstexte schreiben.** Die Kurzbios von
  Frederik Verst, Dr. Frederik Allstädt, Rainer Stäb und jetzt auch Sonja
  Müller-Zaman sind aktuell **Platzhaltersätze** (Frederik/Allstädt/Stäb
  sogar wortgleich, nur der Name ausgetauscht). Diese sollten durch echte,
  individuelle Texte ersetzt werden, die zur jeweiligen Person und Rolle
  passen.
- [ ] Auch Carolin Köhlers Bio-Text auf `/team/carolin-koehler` ist noch ein
  generischer Platzhalter und sollte durch einen echten, persönlichen
  Kurztext ersetzt werden.
- [x] **Sonja Müller-Zaman** hat jetzt (Telefon + E-Mail geliefert) eine
  eigene Profilseite/vCard wie die anderen vier Teammitglieder.
- [ ] **Zwei persönliche LinkedIn-URLs stehen noch aus** (Dr. Frederik
  Allstädt, Sonja Müller-Zaman): Beide wurden nur als Link-**Titel**
  übermittelt ("Dr. Frederik Allstädt | LinkedIn" bzw. "Sonja Müller-Zaman |
  LinkedIn"), die eigentliche Profil-URL ist beim Kopieren/Einfügen
  verloren gegangen. Bitte die echte Adresse aus der Browser-Adresszeile des
  jeweiligen LinkedIn-Profils schicken (z. B.
  `https://www.linkedin.com/in/...`), dann trage ich sie in
  `src/content/team/frederik-allstaedt.md` bzw. `sonja-mueller-zaman.md` ein.

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
- Bildnachweis ergänzt: dezenter nummerierter Hinweis direkt an Fotos/
  Grafiken, vollständige Zuordnung im neuen Abschnitt "Bildnachweis" im
  Impressum (13 Einträge).
- `kontakt.php`: liest jetzt auch Telefon/Unternehmen/Kategorie aus (vorher
  stillschweigend ignoriert) und verschickt eine formatierte HTML-Mail statt
  einer reinen Textzeile.
