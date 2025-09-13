<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing database connection and user creation...\n\n";

try {
    echo "Users count before: " . App\Models\User::count() . "\n";
    
    $user = App\Models\User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '0653561000',
        'address' => 'Test Address',
        'password' => 'password123'
    ]);
    
    echo "User created successfully with ID: " . $user->id . "\n";
    echo "Users count after: " . App\Models\User::count() . "\n";
    echo "User data: " . json_encode($user->toArray(), JSON_PRETTY_PRINT) . "\n";
    
    // Test token creation
    $token = $user->createToken('test_token');
    echo "Token created: " . $token->plainTextToken . "\n";
    
} catch (Exception $e) {
    echo "Error creating user: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}



