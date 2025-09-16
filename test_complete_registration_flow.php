<?php

// Complete registration flow test
$baseUrl = 'http://localhost:8000/api';

echo "=== COMPLETE REGISTRATION FLOW TEST ===\n\n";

$registerData = [
    'name' => 'Complete Test User',
    'email' => 'completetest@example.com',
    'phone' => '0653561000',
    'address' => 'Complete Test Address',
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

// Check database immediately after request
echo "\n5. Database verification (immediate):\n";
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$userCount = DB::table('users')->count();
echo "Total users in database: $userCount\n";

$users = DB::table('users')->select('id', 'name', 'email', 'created_at')->get();
echo "Users in database:\n";
foreach ($users as $user) {
    echo "- ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Created: {$user->created_at}\n";
}

// Test login with the created user
echo "\n6. Testing login with created user...\n";
$loginData = [
    'email' => 'completetest@example.com',
    'password' => 'password123'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$loginResponse = curl_exec($ch);
$loginHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Login HTTP Code: $loginHttpCode\n";
echo "Login Response: $loginResponse\n";

$loginData = json_decode($loginResponse, true);
if ($loginData) {
    echo "Login Success: " . ($loginData['success'] ?? 'undefined') . "\n";
    echo "Login Message: " . ($loginData['message'] ?? 'undefined') . "\n";
}

echo "\n=== TEST COMPLETE ===\n";





