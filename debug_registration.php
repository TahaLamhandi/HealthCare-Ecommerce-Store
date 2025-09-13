<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Validator;
use App\Models\User;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing registration validation...\n\n";

$userData = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'phone' => '0653561000',
    'address' => 'Test Address',
    'password' => 'password123'
];

echo "User data: " . json_encode($userData, JSON_PRETTY_PRINT) . "\n\n";

$validator = Validator::make($userData, [
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
    echo "Validation failed:\n";
    print_r($validator->errors()->toArray());
} else {
    echo "Validation passed!\n";
    
    // Try to create user
    try {
        $user = User::create($userData);
        echo "User created successfully with ID: " . $user->id . "\n";
        
        // Check if user exists
        $userCount = User::count();
        echo "Total users in database: " . $userCount . "\n";
        
    } catch (Exception $e) {
        echo "Error creating user: " . $e->getMessage() . "\n";
    }
}



