<?php

// Test registration with detailed logging
$baseUrl = 'http://localhost:8000/api';

echo "Testing registration with detailed logging...\n\n";

$registerData = [
    'name' => 'Test User with Logs',
    'email' => 'testwithlogs@example.com',
    'phone' => '0653561000',
    'address' => 'Test Address with Logs',
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
}

// Check database after request
echo "\nChecking database after request...\n";
require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$userCount = App\Models\User::count();
echo "Users in database: $userCount\n";

$users = App\Models\User::all(['id', 'name', 'email']);
echo "Users: " . json_encode($users->toArray(), JSON_PRETTY_PRINT) . "\n";

// Check Laravel logs
echo "\nChecking Laravel logs...\n";
$logFile = 'storage/logs/laravel.log';
if (file_exists($logFile)) {
    $logs = file_get_contents($logFile);
    $recentLogs = array_slice(explode("\n", $logs), -20); // Last 20 lines
    echo "Recent logs:\n";
    foreach ($recentLogs as $log) {
        if (trim($log)) {
            echo $log . "\n";
        }
    }
} else {
    echo "Log file not found\n";
}





