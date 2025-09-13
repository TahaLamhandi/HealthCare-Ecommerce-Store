<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmationMail;
use App\Mail\WelcomeMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailController extends Controller
{
    /**
     * Send order confirmation email
     */
    public function sendOrderConfirmation(Request $request)
    {
        try {
            $orderData = $request->all();
            
            // Validate required fields
            if (!isset($orderData['email']) || !isset($orderData['nom'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email and name are required'
                ], 400);
            }

            // Send email
            Mail::to($orderData['email'])->send(new OrderConfirmationMail($orderData));
            
            Log::info('Order confirmation email sent', [
                'email' => $orderData['email'],
                'name' => $orderData['nom']
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order confirmation email sent successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation email: ' . $e->getMessage(), [
                'order_data' => $request->all(),
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send welcome email
     */
    public function sendWelcomeEmail(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Send email
            Mail::to($user->email)->send(new WelcomeMail($user));
            
            Log::info('Welcome email sent', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Welcome email sent successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send welcome email: ' . $e->getMessage(), [
                'user_id' => $user->id ?? null,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }
}
