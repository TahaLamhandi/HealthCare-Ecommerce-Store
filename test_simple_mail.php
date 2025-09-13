<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING SIMPLE MAIL SERVICE ===\n\n";

// Create a test user
$testUser = new stdClass();
$testUser->name = 'Test User';
$testUser->email = 'tahalamhandi11@gmail.com'; // Send to your own email for testing

echo "Testing email to: {$testUser->email}\n\n";

try {
    $emailService = new App\Services\SimpleMailService();
    $result = $emailService->sendWelcomeEmail($testUser);
    
    if ($result) {
        echo "✅ Email sent successfully!\n";
        echo "Check your inbox at {$testUser->email}\n";
    } else {
        echo "❌ Email sending failed!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== IMPORTANT ===\n";
echo "To make this work, you need to:\n";
echo "1. Go to your Google Account settings\n";
echo "2. Enable 2-Factor Authentication\n";
echo "3. Generate an App Password for 'tahalamhandi11@gmail.com'\n";
echo "4. Replace 'your_app_password_here' in SimpleMailService.php with the actual app password\n";
echo "\n=== TEST COMPLETE ===\n";



