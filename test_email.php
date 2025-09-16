<?php

require_once 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'tahalamhandi11@gmail.com';
    $mail->Password = 'your-app-password-here'; // Replace with your actual app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    // Recipients
    $mail->setFrom('tahalamhandi11@gmail.com', 'BioEcleel');
    $mail->addAddress('tahalamhandi11@gmail.com', 'Test User');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email from BioEcleel';
    $mail->Body = '
    <html>
    <body>
        <h2>Test Email</h2>
        <p>This is a test email from BioEcleel to verify email configuration.</p>
        <p>If you receive this email, the configuration is working correctly!</p>
        <br>
        <p>Best regards,<br>BioEcleel Team</p>
    </body>
    </html>
    ';

    $mail->send();
    echo 'Test email sent successfully!';
} catch (Exception $e) {
    echo "Email sending failed. Error: {$mail->ErrorInfo}";
}





