<?php

// Simple test to simulate frontend registration
$baseUrl = 'http://localhost:8000/api';

$registerData = [
    'name' => 'Simple Test User',
    'email' => 'simpletest@example.com',
    'phone' => '0653561000',
    'address' => 'Simple Test Address',
    'password' => 'password123'
];

echo "Testing registration with data:\n";
print_r($registerData);
echo "\n";

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





