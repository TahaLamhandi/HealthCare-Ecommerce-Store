<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING NEWSLETTER SUBSCRIPTION ===\n\n";

try {
    // Test the newsletter subscription endpoint
    $testEmails = [
        'test@example.com',
        'invalid-email',
        'user@bioecleel.ma',
        'newsletter@test.fr'
    ];
    
    foreach ($testEmails as $email) {
        echo "Testing email: {$email}\n";
        
        // Create a mock request
        $request = new \Illuminate\Http\Request();
        $request->merge(['email' => $email]);
        
        // Create controller instance
        $controller = new \App\Http\Controllers\Api\NewsletterController();
        
        // Call the subscribe method
        $response = $controller->subscribe($request);
        $data = $response->getData(true);
        
        echo "  Status: " . ($data['success'] ? 'SUCCESS' : 'FAILED') . "\n";
        echo "  Message: " . $data['message'] . "\n";
        
        if (isset($data['errors'])) {
            echo "  Errors: " . json_encode($data['errors']) . "\n";
        }
        
        echo "\n";
    }
    
    echo "🎉 Newsletter subscription testing completed!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}








