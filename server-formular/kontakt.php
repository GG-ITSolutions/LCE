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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST['Name-des-Anfragenden'] ?? '');
    $email = trim($_POST['E-Mail'] ?? '');
    $message = trim($_POST['Nachricht'] ?? '');
    $privacyAccepted = isset($_POST['Datenschutzzustimmung']);
    $honeypot = trim($_POST['Details'] ?? ''); // Honeypot field

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

    // Send email content
    $emailSubject = "Neue Kontaktanfrage";
    $emailBody = "Name: $name\nE-Mail: $email\n\nNachricht:\n$message\n";

    // Send the email via PHPMailer
    if (sendSMTPMail($mailConfig, $emailSubject, $emailBody, $email)) {
        echo injectMessage(200);
    } else {
        echo injectMessage(500);
    }
} else {
    echo injectMessage(405);
}

/**
 * Injects a message into the HTML source just before the closing </form> tag.
 */
function injectMessage($httpResponseCode) {
    http_response_code($httpResponseCode);

    $htmlContent = file_get_contents('../kontakt.html');

    // Replace all relative URLs with absolute URLs
    $htmlContent = preg_replace_callback(
        '/(href|src)=(["\'])((?!mailto:|tel:|https?:\/\/)[^"\'>]+)\2/i',
        function ($matches) {
            // Ensure the URL is relative and update it with the root URL
            return $matches[1] . '=' . $matches[2] . '/' . ltrim($matches[3], '/') . $matches[2];
        },
        $htmlContent
    );

    if ($httpResponseCode == 200)
    {
        // show kontakt.html with success message
        $htmlContent = preg_replace_callback(
            '/<div class="success-message-2 w-form-done"([^>]*)>/i',
            function ($matches) {
                return '<div class="success-message-2 w-form-done" ' . $matches[1] . ' style="display:block; border-radius:.5rem;">';
            },
            $htmlContent
        );
        // hide form if successful
        $htmlContent = preg_replace_callback(
            '/<form id="wf-form-Kontaktformular-LCE" ([^>]*)>/i',
            function ($matches) {
                return '<form id="wf-form-Kontaktformular-LCE" ' . $matches[1] . ' style="display:none;">';
            },
            $htmlContent
        );
    } else {
        // show kontakt.html with error message
        $htmlContent = preg_replace_callback(
            '/<div class="error-message-2 w-form-fail"([^>]*)>/i',
            function ($matches) {
                return '<div class="error-message-2 w-form-fail" ' . $matches[1] . ' style="display:block; border-radius:.5rem; margin-top:1em;">';
            },
            $htmlContent
        );
    }

    return $htmlContent;
}

/**
 * Sends an email using PHPMailer's SMTP functionality
 */
function sendSMTPMail($config, $subject, $body, $replyTo)
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
        $mail->addAddress(mb_convert_encoding($config['recipientEmail'], 'UTF-8', 'auto')); // Add a recipient
        $mail->addReplyTo($replyTo, 'Information');

        // Content
        $mail->isHTML(false); // Plain text format to prevent HTML injection
        $mail->Subject = mb_convert_encoding($subject, 'UTF-8', 'auto');
        $mail->Body = mb_convert_encoding($body, 'UTF-8', 'auto');

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        return false;
    }
}
?>
