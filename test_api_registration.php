<?php

// Test the actual API endpoint
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
curl_setopt($ch, CURLOPT_VERBOSE, true);

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





