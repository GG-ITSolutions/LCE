<?php

/**
 * Dieses Verzeichnis ist über https://gitlab.twl-kom.de/kunden/lce-webhosting versioniert.
 * Änderungen unbedingt committen bzw. an Development melden.
 */


header('Content-Type: text/html; charset=UTF-8'); // We will return HTML, not JSON

// Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Autoload PHPMailer (make sure you have Composer's autoloader)
require_once 'vendor/autoload.php';

// Load the SMTP configuration (consolidated into an associative array)
// from a separate file that is not version controlled, because it
// contains credentials.
// File content template:
// <?php
// $return [
//     'host' => 'localhost',       // Your SMTP server
//     'port' => 587,                      // Port (465 for SSL, 587 for TLS)
//     'username' => 'your-email@example.com',  // Your SMTP username
//     'password' => 'your-email-password',     // Your SMTP password
//     'secure' => 'tls',                   // 'ssl' or 'tls'
//     'recipientEmail' => 'recipient@example.com', // Recipient email address
//     'senderEmail' => 'your-email@example.com'   // Sender email address
// ];
$mailConfig = require_once './mail_config.php';

// Zeitstempel in der Mail soll deutsche Ortszeit zeigen, unabhaengig von der
// Server-Voreinstellung.
date_default_timezone_set('Europe/Berlin');

// Erlaubte Werte des Kategorie-Auswahlfeldes im Formular. Alles andere wird
// verworfen bzw. auf den Standard zurueckgesetzt - der Wert landet in der
// Betreffzeile, deshalb hier bewusst eine feste Liste statt Freitext.
const KONTAKT_KATEGORIEN = [
    'Allgemeine Anfrage',
    'Investorenanfrage',
    'Kooperation',
    'Presseanfrage',
];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Serverseitige Laengenbegrenzung passend zu den maxlength-Angaben im
    // Formular (Client-Angaben sind manipulierbar).
    $name     = mb_substr(trim($_POST['Name-des-Anfragenden'] ?? ''), 0, 256);
    $email    = mb_substr(trim($_POST['E-Mail'] ?? ''), 0, 256);
    $phone    = mb_substr(trim($_POST['Telefonnummer'] ?? ''), 0, 256);
    $company  = mb_substr(trim($_POST['Unternehmen'] ?? ''), 0, 256);
    $category = trim($_POST['Kategorie'] ?? '');
    $message  = mb_substr(trim($_POST['Nachricht'] ?? ''), 0, 5000);
    $privacyAccepted = isset($_POST['Datenschutzzustimmung']);
    $honeypot = trim($_POST['Details'] ?? ''); // Honeypot field

    if (!in_array($category, KONTAKT_KATEGORIEN, true)) {
        $category = KONTAKT_KATEGORIEN[0];
    }

    // If honeypot field is filled, log and return success message
    if (!empty($honeypot)) {
        error_log("Honeypot triggered from IP: " . $_SERVER['REMOTE_ADDR']);
        echo injectMessage(200);
        exit;
    }

    // Validate required fields
    if (empty($name) || empty($email) || empty($message) || !$privacyAccepted) {
        echo injectMessage(400);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo injectMessage(400);
        exit;
    }

    $anfrage = [
        'Kategorie'   => $category,
        'Name'        => $name,
        'E-Mail'      => $email,
        'Telefon'     => $phone,
        'Unternehmen' => $company,
        'Eingegangen' => date('d.m.Y \u\m H:i \U\h\r'),
    ];

    $emailSubject = 'Neue Kontaktanfrage: ' . $category;
    $emailHtml    = buildHtmlBody($anfrage, $message);
    $emailText    = buildTextBody($anfrage, $message);

    // Send the email via PHPMailer
    if (sendSMTPMail($mailConfig, $emailSubject, $emailHtml, $emailText, $email, $name)) {
        echo injectMessage(200);
    } else {
        echo injectMessage(500);
    }
} else {
    echo injectMessage(405);
}

/**
 * Setzt den HTTP-Status. Der Response-Body wird von der neuen Website nicht
 * mehr ausgewertet (das Kontaktformular sendet per fetch() und prueft nur
 * den Status-Code) - fruehere Versionen haben hier die alte kontakt.html
 * als Antwortvorlage zurueckgegeben; das entfaellt damit.
 */
function injectMessage($httpResponseCode) {
    http_response_code($httpResponseCode);
    return '';
}

/**
 * Baut die HTML-Fassung der Benachrichtigungsmail.
 *
 * Layout absichtlich tabellenbasiert mit Inline-Styles (Outlook rendert
 * moderne CSS-Layouts unzuverlaessig) und ohne externe Bilder/Fonts, damit
 * die Mail ohne Nachladen aus dem Netz vollstaendig dargestellt wird.
 * ALLE Werte werden escaped - die Mail ist HTML, Eingaben sind Fremddaten.
 */
function buildHtmlBody(array $felder, string $nachricht): string
{
    $esc = fn($v) => htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');

    $zeilen = '';
    foreach ($felder as $label => $wert) {
        if ($wert === '') {
            continue; // leere optionale Angaben nicht als leere Zeile zeigen
        }
        $wertHtml = $esc($wert);
        if ($label === 'E-Mail') {
            $wertHtml = '<a href="mailto:' . $esc($wert) . '" style="color:#003761;">' . $wertHtml . '</a>';
        } elseif ($label === 'Telefon') {
            $telHref = preg_replace('/[^0-9+]/', '', $wert);
            $wertHtml = '<a href="tel:' . $esc($telHref) . '" style="color:#003761;">' . $wertHtml . '</a>';
        }

        $zeilen .= '<tr>'
            . '<td style="padding:10px 16px;border-bottom:1px solid #ece9e7;'
            . 'font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b625e;'
            . 'white-space:nowrap;vertical-align:top;">' . $esc($label) . '</td>'
            . '<td style="padding:10px 16px;border-bottom:1px solid #ece9e7;'
            . 'font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;'
            . 'font-weight:bold;vertical-align:top;">' . $wertHtml . '</td>'
            . '</tr>';
    }

    $nachrichtHtml = nl2br($esc($nachricht));

    return '<!DOCTYPE html>'
        . '<html lang="de"><head><meta charset="UTF-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1"></head>'
        . '<body style="margin:0;padding:24px 12px;background-color:#f4f2f1;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
        . '<tr><td align="center">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"'
        . ' style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">'

        // Kopfbereich
        . '<tr><td style="background-color:#003761;padding:22px 24px;border-top:4px solid #a1ad46;">'
        . '<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;'
        . 'text-transform:uppercase;color:#a1ad46;">LCE &ndash; LU-City Entwicklungs-GmbH</div>'
        . '<div style="font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;'
        . 'color:#ffffff;padding-top:4px;">Neue Kontaktanfrage</div>'
        . '</td></tr>'

        // Datenfelder
        . '<tr><td style="padding:8px 8px 0 8px;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
        . $zeilen
        . '</table></td></tr>'

        // Nachricht
        . '<tr><td style="padding:20px 24px 24px 24px;">'
        . '<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;'
        . 'text-transform:uppercase;color:#6b625e;padding-bottom:8px;">Nachricht</div>'
        . '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;'
        . 'color:#1c1c1c;background-color:#f7f6f5;border-left:4px solid #a1ad46;'
        . 'border-radius:4px;padding:14px 16px;">' . $nachrichtHtml . '</div>'
        . '</td></tr>'

        // Fussbereich
        . '<tr><td style="background-color:#f7f6f5;padding:16px 24px;'
        . 'font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#6b625e;">'
        . 'Automatisch erzeugt vom Kontaktformular auf '
        . '<a href="https://www.lce-ludwigshafen.de" style="color:#003761;">www.LCE-Ludwigshafen.de</a>.<br>'
        . 'Eine Antwort auf diese E-Mail geht direkt an die anfragende Person.'
        . '</td></tr>'

        . '</table></td></tr></table></body></html>';
}

/**
 * Baut die Nur-Text-Fassung (AltBody) - fuer Mailprogramme ohne HTML-Ansicht
 * und als Spam-Filter-freundliche Alternative.
 */
function buildTextBody(array $felder, string $nachricht): string
{
    $zeilen = [];
    $breite = 0;
    foreach ($felder as $label => $wert) {
        if ($wert !== '') {
            $breite = max($breite, mb_strlen($label));
        }
    }
    foreach ($felder as $label => $wert) {
        if ($wert === '') {
            continue;
        }
        $zeilen[] = str_pad($label . ':', $breite + 2) . $wert;
    }

    return "NEUE KONTAKTANFRAGE\n"
        . str_repeat('=', 40) . "\n\n"
        . implode("\n", $zeilen) . "\n\n"
        . "NACHRICHT\n"
        . str_repeat('-', 40) . "\n"
        . $nachricht . "\n\n"
        . str_repeat('-', 40) . "\n"
        . "Automatisch erzeugt vom Kontaktformular auf www.LCE-Ludwigshafen.de.\n"
        . "Eine Antwort auf diese E-Mail geht direkt an die anfragende Person.\n";
}

/**
 * Sends an email using PHPMailer's SMTP functionality
 */
function sendSMTPMail($config, $subject, $htmlBody, $textBody, $replyTo, $replyToName = '')
{
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['username'];
        $mail->Password = $config['password'];
        $mail->SMTPSecure = $config['secure'];
        $mail->Port = $config['port'];
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom($config['senderEmail'], 'Kontaktformular');
        $mail->addAddress($config['recipientEmail']); // Add a recipient
        $mail->addReplyTo($replyTo, $replyToName !== '' ? $replyToName : 'Anfrage');

        // Content: HTML mit Nur-Text-Alternative (multipart/alternative).
        // Eingaben sind in buildHtmlBody() durchgaengig escaped.
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $textBody;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        return false;
    }
}
?>
