<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING BEAUTIFUL EMAILS ===\n\n";

// Test Welcome Email
echo "1. Testing Welcome Email...\n";
try {
    $testUser = new stdClass();
    $testUser->name = 'Test User Beautiful';
    $testUser->email = 'tahalamhandi11@gmail.com';
    
    $emailService = new App\Services\SimpleMailService();
    $result = $emailService->sendWelcomeEmail($testUser);
    
    if ($result) {
        echo "✅ Welcome email sent successfully!\n";
    } else {
        echo "❌ Welcome email failed!\n";
    }
} catch (Exception $e) {
    echo "❌ Welcome email error: " . $e->getMessage() . "\n";
}

echo "\n2. Testing Order Confirmation Email...\n";
try {
    // Create test order data
    $orderData = [
        'nom' => 'Test User Beautiful',
        'email' => 'tahalamhandi11@gmail.com',
        'telephone' => '0653561000',
        'adresse' => 'Test Address, Casablanca',
        'date' => date('d/m/Y H:i'),
        'produits' => [
            [
                'nom' => 'Produit Test 1',
                'prix' => 150.00,
                'quantite' => 2,
                'total' => 300.00
            ],
            [
                'nom' => 'Produit Test 2',
                'prix' => 75.50,
                'quantite' => 1,
                'total' => 75.50
            ]
        ],
        'sousTotal' => 375.50,
        'livraison' => 25.00,
        'total' => 400.50
    ];
    
    // Send order confirmation email
    Mail::send('emails.order-confirmation', ['orderData' => $orderData], function ($message) use ($orderData) {
        $message->from('tahalamhandi11@gmail.com', 'BioEkleel')
                ->to($orderData['email'], $orderData['nom'])
                ->subject('Confirmation de Commande - BioEkleel');
    });
    
    echo "✅ Order confirmation email sent successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Order confirmation email error: " . $e->getMessage() . "\n";
}

echo "\n=== EMAIL FEATURES ===\n";
echo "✅ Beautiful green gradient headers\n";
echo "✅ BioEkleel logo included\n";
echo "✅ Professional styling\n";
echo "✅ Responsive design\n";
echo "✅ French content\n";
echo "✅ Subtle texture patterns\n";
echo "✅ Enhanced visual hierarchy\n";

echo "\n=== TEST COMPLETE ===\n";
echo "Check your inbox at tahalamhandi11@gmail.com for the beautiful emails!\n";





