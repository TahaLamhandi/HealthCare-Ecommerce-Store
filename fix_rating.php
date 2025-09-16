<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== FIXING ZITALGIC SPORT RATING ===\n\n";

try {
    // Update Zitalgic Sport rating to be less than 5
    $product = \App\Models\Product::find(2);
    
    if ($product) {
        $product->update(['rating' => 4.6]);
        echo "✅ Updated Zitalgic® Sport rating from 5.0 to 4.6\n";
        echo "   Product: {$product->name}\n";
        echo "   New Rating: {$product->rating} stars\n";
        echo "   Reviews: {$product->reviews} avis\n";
    } else {
        echo "❌ Product not found\n";
    }
    
    echo "\n🎉 All ratings are now less than 5.0!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}





