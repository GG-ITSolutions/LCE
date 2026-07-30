# kontakt.php – Spiegel des Server-Skripts

Dieser Ordner enthält **nur eine Kopie** von `formular/kontakt.php`, wie es
auf dem TWL-Server unter `public_html/formular/kontakt.php` liegt – rein zur
Versionierung/Nachvollziehbarkeit. Diese Datei ist **nicht** Teil des
Astro-Builds (`npm run build` fasst sie nicht an, sie landet nicht in
`dist/`) und muss weiterhin **separat per FTP/Dateimanager direkt auf dem
Server** gepflegt werden.

**Wichtig:** `mail_config.php` (enthält die echten SMTP-Zugangsdaten) ist
bewusst **nicht** hier abgelegt und darf es auch nie werden – das Original
auf dem Server trägt selbst den Kommentar "Diese Datei wird NICHT
versioniert, da sie Credentials enthält."

Laut Kommentar in `kontakt.php` ist das eigentliche `formular`-Verzeichnis
zusätzlich über ein separates TWL-GitLab-Repository versioniert
(`gitlab.twl-kom.de/kunden/lce-webhosting`) – Änderungen dort sollten
idealerweise auch dorthin gemeldet/committed werden. Diese Kopie hier dient
nur uns zur lokalen Nachvollziehbarkeit im LCE-Website-Repo.
