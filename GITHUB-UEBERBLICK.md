# Was ist GitHub – und wo kommt es hier ins Spiel?

Diese Anleitung erklärt in einfachen Worten, was GitHub ist, warum wir es für
dieses Projekt nutzen, und warum vor dem Hochladen auf den TWL-Server ein
"Build"-Schritt nötig ist. Für den eigentlichen Upload auf den Server siehe
`CPANEL-DEPLOYMENT.md` – hier geht es nur um das Verständnis drumherum.

## Kurzfassung

- **GitHub** ist der Ort, an dem der komplette **Quellcode** dieser Website
  liegt und seine komplette **Historie** (jede einzelne Änderung, wer sie
  gemacht hat und warum).
- GitHub ist **nicht** eure Live-Website. Eure echte, öffentliche Website
  läuft bei **TWL per cPanel** (siehe `CPANEL-DEPLOYMENT.md`).
- Damit aus dem Quellcode eine fertige Website wird, die ein normaler
  Webserver ausliefern kann, braucht es einen **Build-Schritt** – dazu unten
  mehr.
- Ihr müsst mit GitHub selbst **nichts** tun, um live zu gehen. Ich baue die
  Website und liefere euch die fertigen Dateien, wie bisher.

## 1. Was ist ein "Repository" (Repo)?

Ein Repository ist im Grunde ein Projektordner mit **Zeitmaschine**: Jede
Änderung an jeder Datei wird als eigener Datensatz gespeichert – ein
sogenannter **Commit**. Ein Commit hat immer:

- eine kurze Beschreibung, *was* sich geändert hat und *warum*
  (z. B. "Kontaktformular: Feldnamen an kontakt.php angleichen")
- ein Datum
- den genauen Vorher/Nachher-Unterschied jeder betroffenen Datei

Das Repo für die LCE-Website liegt unter `GG-ITSolutions/LCE` auf GitHub.

## 2. Welche Vorteile bringt das konkret?

- **Versionierung / Nachvollziehbarkeit**: Jede Änderung ist dokumentiert.
  Wer wissen will, warum eine bestimmte Zeile Code oder ein Text so aussieht,
  wie er aussieht, kann die Commit-Historie durchsehen – inklusive
  Begründung. Nichts geht "einfach so" verloren.
- **Zurückspulen möglich**: Sollte sich irgendwann herausstellen, dass eine
  Änderung doch nicht gewollt war, lässt sich exakt zu jedem früheren Stand
  zurückkehren – die alte Version ist nie wirklich weg.
- **Backup**: Der Code liegt nicht nur auf einem einzelnen Rechner. Selbst
  wenn ein Laptop verloren geht oder kaputtgeht, ist nichts verloren.
- **Parallel arbeiten ohne Kollision (Branches)**: Ein "Branch" ist eine
  eigene, isolierte Kopie des Projekts für eine bestimmte Änderung – z. B.
  arbeitet diese ganze Website-Überarbeitung auf dem Branch
  `claude/lce-website-redesign-eyz2jj`, während der `main`-Branch unberührt
  bleibt. Mehrere Leute (oder ich als KI-Assistent) können so gleichzeitig an
  verschiedenen Dingen arbeiten, ohne sich gegenseitig etwas kaputt zu
  machen. Erst wenn ein Stand fertig und geprüft ist, wird er in `main`
  zusammengeführt ("Merge").
- **Transparenz für euch**: Ihr könnt jederzeit im Browser
  `github.com/GG-ITSolutions/LCE` öffnen und den kompletten aktuellen Stand
  sowie die komplette Historie einsehen – ganz ohne Technik-Vorwissen, wie
  ein Dokumentenarchiv.

## 3. Warum reicht es nicht, die GitHub-Dateien direkt hochzuladen?

Der Code auf GitHub besteht aus **Astro-Komponenten** (`.astro`-Dateien),
TypeScript, Bilddateien in Rohformat usw. Das ist für Menschen (und mich)
gut lesbar und bearbeitbar – ein normaler Webserver wie der von TWL kann
damit aber nichts anfangen. Er braucht fertiges, einfaches HTML/CSS/JS.

Der **Build-Schritt** (`npm run build`) übersetzt den gesamten Quellcode in
genau solche fertigen, statischen Dateien – inklusive:
- automatisch optimierter Bilder (mehrere Größen, moderne Formate wie WebP)
- zusammengefasstem, komprimiertem CSS/JavaScript
- automatisch erzeugter Sitemap, `robots.txt` usw.

Das Ergebnis landet im Ordner `dist/` – **das** ist es, was am Ende auf den
TWL-Server hochgeladen wird (siehe `CPANEL-DEPLOYMENT.md`). Diesen
Build-Schritt übernehme ich für euch; ihr bekommt direkt die fertigen
Dateien als ZIP, ohne dass ihr selbst irgendetwas installieren oder
ausführen müsst.

## 4. Die GitHub-Vorschau (GitHub Pages) – nicht mit der echten Seite verwechseln

Bei jeder Änderung, die auf GitHub landet, läuft automatisch ein Skript
("GitHub Actions", eine Art Roboter-Assistent), das den Build-Schritt selbst
durchführt und das Ergebnis auf eine **Vorschau-Adresse** hochlädt:

`https://gg-itsolutions.github.io/LCE/`

Das ist praktisch, um zwischendurch schnell zu sehen, wie der aktuelle Stand
aussieht – **aber das ist nicht eure echte Website**. Diese Vorschau:
- läuft unter einer GitHub-eigenen Adresse, nicht unter
  `lce-ludwigshafen.de`
- ist absichtlich für Suchmaschinen gesperrt (`noindex`, siehe
  `robots.txt`), damit sie nicht versehentlich statt der echten Seite in
  Google auftaucht
- wird bei jeder Änderung automatisch neu gebaut – ihr müsst dafür nichts
  tun

Eure **echte, öffentliche** Website läuft ausschließlich über den TWL-Server
(cPanel), wie in `CPANEL-DEPLOYMENT.md` beschrieben. Die GitHub-Vorschau ist
nur ein Hilfsmittel für die Zusammenarbeit während der Entwicklung.

## 5. Kurzes Glossar

| Begriff | Bedeutung |
|---|---|
| Repository (Repo) | Der komplette Projektordner samt Historie |
| Commit | Eine gespeicherte, beschriftete Änderung |
| Branch | Eine isolierte Arbeitskopie für eine bestimmte Aufgabe |
| Push | Änderungen vom eigenen Rechner nach GitHub hochladen |
| Merge | Eine fertige Änderung in den Haupt-Stand übernehmen |
| Build | Quellcode in fertige, servierbare Dateien übersetzen |
| GitHub Actions | Automatisiertes Skript, das z. B. bei jeder Änderung baut/veröffentlicht |
| GitHub Pages | Kostenloses Hosting von GitHub für die Vorschau-Adresse |

## 6. Was heißt das praktisch für euch?

Nichts, was ihr aktiv tun müsst. Ich arbeite direkt im Repository, jede
Änderung ist dort dokumentiert und nachvollziehbar, und wenn ein Stand
bereit für den echten Server ist, baue ich ihn und ihr bekommt die fertigen
Dateien zum Hochladen – wie bisher.
