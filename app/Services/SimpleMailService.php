<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SimpleMailService
{
    public function sendWelcomeEmail($user)
    {
        try {
            // Load email configuration
            $emailConfig = require base_path('email_config.php');
            
            // Configure mail settings directly
            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp.host' => $emailConfig['smtp_host'],
                'mail.mailers.smtp.port' => $emailConfig['smtp_port'],
                'mail.mailers.smtp.encryption' => $emailConfig['smtp_encryption'],
                'mail.mailers.smtp.username' => $emailConfig['gmail_username'],
                'mail.mailers.smtp.password' => $emailConfig['gmail_app_password'],
                'mail.from.address' => $emailConfig['gmail_username'],
                'mail.from.name' => $emailConfig['from_name'],
            ]);
            
            // Send email using Laravel's Mail facade
            Mail::send('emails.simple_welcome', ['user' => $user], function ($message) use ($user) {
                $message->from('tahalamhandi11@gmail.com', 'BioEcleel')
                        ->to($user->email, $user->name)
                        ->subject('Bienvenue chez BioEcleel!');
            });
            
            Log::info('Welcome email sent successfully to: ' . $user->email);
            return true;
            
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return false;
        }
    }
}
