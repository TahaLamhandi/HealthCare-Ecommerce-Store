<?php

// Test with fresh email
$baseUrl = 'http://localhost:8000/api';

echo "=== FRESH EMAIL REGISTRATION TEST ===\n\n";

$registerData = [
    'name' => 'Fresh User Test',
    'email' => 'freshuser@example.com',
    'phone' => '0653561000',
    'address' => 'Fresh User Address',
    'password' => 'password123'
];

echo "1. Sending registration request...\n";
echo "Data: " . json_encode($registerData, JSON_PRETTY_PRINT) . "\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/register');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($registerData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "2. Response received:\n";
echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
if ($error) {
    echo "cURL Error: $error\n";
}

$responseData = json_decode($response, true);
if ($responseData) {
    echo "\n3. Parsed Response:\n";
    print_r($responseData);
    
    echo "\n4. Success Analysis:\n";
    echo "HTTP OK (200-299): " . ($httpCode >= 200 && $httpCode < 300 ? 'YES' : 'NO') . "\n";
    echo "Data success: " . ($responseData['success'] ?? 'undefined') . "\n";
    echo "Data success type: " . gettype($responseData['success'] ?? null) . "\n";
    echo "Has user data: " . (isset($responseData['user']) ? 'YES' : 'NO') . "\n";
    echo "Has token: " . (isset($responseData['token']) ? 'YES' : 'NO') . "\n";
}

// Check database
echo "\n5. Database verification:\n";
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$userCount = App\Models\User::count();
echo "Total users in database: $userCount\n";

$users = App\Models\User::all(['id', 'name', 'email']);
echo "Users in database:\n";
foreach ($users as $user) {
    echo "- ID: {$user->id}, Name: {$user->name}, Email: {$user->email}\n";
}

echo "\n=== TEST COMPLETE ===\n";





