# Offene Punkte (intern)

Interne Übersicht über das, was auf der Website noch fehlt oder vor einem
öffentlichen Go-Live geprüft/ergänzt werden sollte. Nicht Teil der
öffentlichen Seite, wird nirgends verlinkt.

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
  Frederik Verst, Dr. Frederik Allstädt und Rainer Stäb sind aktuell
  **wortgleiche Platzhaltersätze** (copy-paste desselben Satzbausteins,
  nur der Name ausgetauscht). Diese sollten durch echte, individuelle
  Texte ersetzt werden, die zur jeweiligen Person und Rolle passen – nicht
  drei identische Sätze.
- [ ] Auch Carolin Köhlers Bio-Text auf `/team/carolin-koehler` ist noch ein
  generischer Platzhalter und sollte durch einen echten, persönlichen
  Kurztext ersetzt werden.
- [ ] **Sonja Müller-Zaman** hat aktuell (bewusste Entscheidung) keine eigene
  Profilseite/vCard, im Gegensatz zu den anderen vier Teammitgliedern.
  Falls gewünscht, kann für sie ebenfalls eine Profilseite + vCard angelegt
  werden (Telefon/LinkedIn müssten dafür noch geliefert werden).

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
  entspricht der TWL-Vorgabe.
- Carolins persönliches LinkedIn ist hinterlegt (echtes, verifiziertes Profil).
- LCE-Unternehmens-LinkedIn ist eine echte, verifizierte URL (kein Platzhalter
  mehr), zentral gepflegt in `src/lib/team.ts`.
