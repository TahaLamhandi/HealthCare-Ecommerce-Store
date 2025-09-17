<?php

// Test the API endpoint directly
$baseUrl = 'http://localhost:8000/api';

echo "Testing API registration endpoint...\n\n";

$registerData = [
    'name' => 'API Test User',
    'email' => 'apitest@example.com',
    'phone' => '0653561000',
    'address' => 'API Test Address',
    'password' => 'password123'
];

echo "Sending registration request...\n";
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

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
if ($error) {
    echo "cURL Error: $error\n";
}

$responseData = json_decode($response, true);
if ($responseData) {
    echo "\nParsed Response:\n";
    print_r($responseData);
    
    echo "\nSuccess check:\n";
    echo "response.ok (httpCode 200-299): " . ($httpCode >= 200 && $httpCode < 300 ? 'true' : 'false') . "\n";
    echo "data.success: " . ($responseData['success'] ?? 'undefined') . "\n";
    echo "Combined check: " . (($httpCode >= 200 && $httpCode < 300) && ($responseData['success'] ?? false) ? 'true' : 'false') . "\n";
}

// Check if user was actually created in database
echo "\nChecking database...\n";
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$userCount = App\Models\User::count();
echo "Users in database: $userCount\n";

$users = App\Models\User::all(['id', 'name', 'email']);
echo "Users: " . json_encode($users->toArray(), JSON_PRETTY_PRINT) . "\n";








