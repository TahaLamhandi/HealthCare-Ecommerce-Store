<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class SimpleEmailService
{
    public function sendWelcomeEmail($user)
    {
        try {
            $mail = new PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'tahalamhandi11@gmail.com';
            $mail->Password = 'your_app_password_here'; // You need to set this
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            
            // Recipients
            $mail->setFrom('tahalamhandi11@gmail.com', 'BioEcleel');
            $mail->addAddress($user->email, $user->name);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Bienvenue chez BioEcleel!';
            
            $mail->Body = $this->getWelcomeEmailBody($user);
            
            $mail->send();
            return true;
            
        } catch (Exception $e) {
            \Log::error('Email sending failed: ' . $e->getMessage());
            return false;
        }
    }
    
    private function getWelcomeEmailBody($user)
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <title>Bienvenue chez BioEcleel</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2c5530; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
                .button { display: inline-block; background: #2c5530; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Bienvenue chez BioEcleel!</h1>
                </div>
                <div class='content'>
                    <p>Bonjour {$user->name},</p>
                    <p>Nous sommes ravis de vous accueillir dans notre communauté BioEcleel!</p>
                    <p>Votre compte a été créé avec succès. Vous pouvez maintenant profiter de tous nos produits naturels et biologiques.</p>
                    <p>Merci de nous faire confiance pour votre bien-être.</p>
                    <p style='text-align: center; margin: 30px 0;'>
                        <a href='http://localhost:8000' class='button'>Visiter notre site</a>
                    </p>
                </div>
                <div class='footer'>
                    <p>BioEcleel - Votre partenaire naturel pour une vie saine</p>
                    <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }
}



