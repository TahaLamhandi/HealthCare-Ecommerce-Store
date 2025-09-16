<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== FIXING ALL RATINGS TO BE LESS THAN 5 ===\n\n";

try {
    // Update all products to have ratings less than 5 with decimals
    $products = \App\Models\Product::all();
    
    $newRatings = [
        1 => 4.2,  // Zitalgic
        2 => 4.6,  // Zitalgic Sport  
        3 => 4.1,  // Detoxoil
        4 => 4.4,  // Relaxoil
    ];
    
    foreach ($products as $product) {
        $newRating = $newRatings[$product->id] ?? 4.3;
        $oldRating = $product->rating;
        
        $product->rating = $newRating;
        $product->save();
        
        echo "✅ Product {$product->id}: {$product->name}\n";
        echo "   Old Rating: {$oldRating} → New Rating: {$newRating}\n";
        echo "   Reviews: {$product->reviews} avis\n\n";
    }
    
    echo "🎉 All ratings updated successfully!\n";
    echo "All ratings are now less than 5.0 with decimal parts.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}





