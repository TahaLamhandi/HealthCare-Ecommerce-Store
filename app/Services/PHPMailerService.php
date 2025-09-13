<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class PHPMailerService
{
    protected $mailer;
    protected $config;

    public function __construct()
    {
        $this->config = config('phpmailer.smtp');
        $this->mailer = new PHPMailer(true);
        $this->setup();
    }

    protected function setup()
    {
        try {
            // Server settings
            $this->mailer->isSMTP();
            $this->mailer->Host = $this->config['host'];
            $this->mailer->SMTPAuth = true;
            $this->mailer->Username = $this->config['username'];
            $this->mailer->Password = $this->config['password'];
            $this->mailer->SMTPSecure = $this->config['encryption'];
            $this->mailer->Port = $this->config['port'];
            $this->mailer->CharSet = 'UTF-8';

            // Recipients
            $this->mailer->setFrom($this->config['from']['address'], $this->config['from']['name']);
        } catch (Exception $e) {
            \Log::error('PHPMailer setup failed: ' . $e->getMessage());
        }
    }

    public function sendWelcomeEmail($user)
    {
        try {
            $this->mailer->addAddress($user->email, $user->name);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Bienvenue chez BioEkleel - Votre compte a été créé avec succès';
            
            $htmlContent = $this->getWelcomeEmailContent($user);
            $this->mailer->Body = $htmlContent;
            $this->mailer->AltBody = $this->getWelcomeEmailTextContent($user);

            $this->mailer->send();
            \Log::info('Welcome email sent successfully to: ' . $user->email);
            return true;
        } catch (Exception $e) {
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
            return false;
        }
    }

    protected function getWelcomeEmailContent($user)
    {
        return view('emails.welcome', compact('user'))->render();
    }

    protected function getWelcomeEmailTextContent($user)
    {
        return "Bonjour {$user->name},\n\n" .
               "Bienvenue chez BioEkleel! Votre compte a été créé avec succès.\n\n" .
               "Vous pouvez maintenant profiter de tous nos services et produits naturels.\n\n" .
               "Merci de nous faire confiance!\n\n" .
               "L'équipe BioEkleel";
    }

    public function sendOrderConfirmationEmail($user, $order)
    {
        try {
            $this->mailer->addAddress($user->email, $user->name);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Confirmation de commande - BioEkleel';
            
            $htmlContent = $this->getOrderConfirmationEmailContent($user, $order);
            $this->mailer->Body = $htmlContent;
            $this->mailer->AltBody = $this->getOrderConfirmationEmailTextContent($user, $order);

            $this->mailer->send();
            \Log::info('Order confirmation email sent successfully to: ' . $user->email);
            return true;
        } catch (Exception $e) {
            \Log::error('Failed to send order confirmation email: ' . $e->getMessage());
            return false;
        }
    }

    protected function getOrderConfirmationEmailContent($user, $order)
    {
        return view('emails.order-confirmation', compact('user', 'order'))->render();
    }

    protected function getOrderConfirmationEmailTextContent($user, $order)
    {
        return "Bonjour {$user->name},\n\n" .
               "Votre commande #{$order->id} a été confirmée.\n\n" .
               "Merci pour votre achat!\n\n" .
               "L'équipe BioEkleel";
    }
}



