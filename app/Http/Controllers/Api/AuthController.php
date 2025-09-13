<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\WelcomeMail;
use App\Services\SimpleMailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        try {
            \Log::info('=== REGISTRATION START ===');
            \Log::info('Request data:', $request->all());
            
            // Validate input
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:500',
                'password' => 'required|string|min:8',
            ], [
                'name.required' => 'Le nom complet est obligatoire.',
                'name.string' => 'Le nom doit être une chaîne de caractères.',
                'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
                'email.required' => 'L\'adresse email est obligatoire.',
                'email.email' => 'Veuillez fournir une adresse email valide.',
                'email.unique' => 'Cette adresse email est déjà utilisée.',
                'email.max' => 'L\'adresse email ne peut pas dépasser 255 caractères.',
                'phone.required' => 'Le numéro de téléphone est obligatoire.',
                'phone.string' => 'Le numéro de téléphone doit être une chaîne de caractères.',
                'phone.max' => 'Le numéro de téléphone ne peut pas dépasser 20 caractères.',
                'address.required' => 'L\'adresse est obligatoire.',
                'address.string' => 'L\'adresse doit être une chaîne de caractères.',
                'address.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
                'password.required' => 'Le mot de passe est obligatoire.',
                'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
                'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], 422);
            }

            \Log::info('Validation passed, creating user...');
            
            // Create user directly without transaction for simplicity
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'password' => $request->password,
            ]);

            \Log::info('User created with ID:', ['user_id' => $user->id]);
            \Log::info('User data:', $user->toArray());

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;
            \Log::info('Token created for user:', ['user_id' => $user->id]);

            // Verify user exists in database
            $userCount = User::count();
            \Log::info('Total users in database:', ['user_count' => $userCount]);
            
            $savedUser = User::find($user->id);
            if (!$savedUser) {
                \Log::error('CRITICAL: User not found in database after creation!');
                throw new \Exception('User creation failed - user not found in database');
            }
            \Log::info('User verified in database:', $savedUser->toArray());

            // Send welcome email
            try {
                \Log::info('Attempting to send welcome email...');
                $emailService = new SimpleMailService();
                $emailSent = $emailService->sendWelcomeEmail($user);
                if ($emailSent) {
                    \Log::info('Welcome email sent successfully to:', ['email' => $user->email]);
                } else {
                    \Log::error('Failed to send welcome email via SimpleMailService');
                }
            } catch (\Exception $e) {
                \Log::error('Failed to send welcome email:', ['error' => $e->getMessage()]);
                // Don't fail registration if email fails
            }

            $response = [
                'success' => true,
                'message' => 'Inscription réussie! Bienvenue chez BioEcleel.',
                'user' => $user,
                'token' => $token,
            ];
            
            \Log::info('=== REGISTRATION SUCCESS ===');
            \Log::info('Final response:', $response);
            
            return response()->json($response, 201);
            
        } catch (\Exception $e) {
            \Log::error('=== REGISTRATION ERROR ===');
            \Log::error('Error message:', $e->getMessage());
            \Log::error('Error trace:', $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription. Veuillez réessayer plus tard.'
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'Veuillez fournir une adresse email valide.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie! Bienvenue chez BioEcleel.',
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user()
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:8',
        ], [
            'name.required' => 'Le nom complet est obligatoire.',
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'Veuillez fournir une adresse email valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'newPassword.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();

        // Check current password if provided
        if ($request->currentPassword && !Hash::check($request->currentPassword, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 400);
        }

        // Update user information
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->address = $request->address;

        // Update password if provided
        if ($request->newPassword) {
            $user->password = Hash::make($request->newPassword);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }
}
