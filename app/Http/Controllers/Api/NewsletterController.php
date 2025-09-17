<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Services\SimpleMailService;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        try {
            // Validate email
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255'
            ], [
                'email.required' => 'L\'adresse email est requise.',
                'email.email' => 'Veuillez entrer une adresse email valide.',
                'email.max' => 'L\'adresse email ne peut pas dépasser 255 caractères.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            $email = $request->email;
            
            Log::info('Newsletter subscription attempt', ['email' => $email]);

            // Create a mock user object for the welcome email
            $user = (object) [
                'name' => 'Abonné Newsletter',
                'email' => $email
            ];

            // Send welcome email using SimpleMailService
            $mailService = new SimpleMailService();
            $emailSent = $mailService->sendWelcomeEmail($user);

            if ($emailSent) {
                Log::info('Newsletter subscription successful', ['email' => $email]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Merci ! Vous êtes maintenant abonné à notre newsletter. Vérifiez votre boîte mail pour confirmer votre abonnement.'
                ], 200);
            } else {
                Log::error('Failed to send welcome email for newsletter subscription', ['email' => $email]);
                
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur lors de l\'envoi de l\'email de confirmation. Veuillez réessayer.'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Newsletter subscription error', [
                'email' => $request->email ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue. Veuillez réessayer plus tard.'
            ], 500);
        }
    }
}








