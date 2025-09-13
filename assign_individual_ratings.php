<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== ASSIGNING INDIVIDUAL RATINGS TO PRODUCTS ===\n\n";

try {
    // Get all products
    $products = \App\Models\Product::all();
    
    if ($products->isEmpty()) {
        echo "No products found in database.\n";
        exit;
    }
    
    echo "Found " . $products->count() . " products:\n\n";
    
    // Define individual ratings and review counts for each product
    $productRatings = [
        1 => ['rating' => 4.2, 'reviews' => 89],   // Zitalgic
        2 => ['rating' => 4.6, 'reviews' => 127],  // Zitalgic Sport  
        3 => ['rating' => 4.1, 'reviews' => 73],   // Detoxoil
        4 => ['rating' => 4.4, 'reviews' => 95],   // Relaxoil
        5 => ['rating' => 4.3, 'reviews' => 156],  // Huile Essentielle de Lavande
        6 => ['rating' => 4.0, 'reviews' => 64],   // Huile Essentielle d'Eucalyptus
        7 => ['rating' => 4.5, 'reviews' => 112],  // Huile Essentielle de Menthe
        8 => ['rating' => 4.7, 'reviews' => 203],  // Huile Essentielle de Tea Tree
        9 => ['rating' => 4.2, 'reviews' => 87],   // Huile Essentielle de Romarin
        10 => ['rating' => 4.8, 'reviews' => 178], // Huile Essentielle de Citron
    ];
    
    foreach ($products as $product) {
        $productId = $product->id;
        
        // Get rating data for this product (or use default if not found)
        $ratingData = $productRatings[$productId] ?? ['rating' => 4.3, 'reviews' => 100];
        
        // Update the product
        $product->update([
            'rating' => $ratingData['rating'],
            'reviews' => $ratingData['reviews']
        ]);
        
        echo "✅ Product {$productId}: {$product->name}\n";
        echo "   Rating: {$ratingData['rating']} stars\n";
        echo "   Reviews: {$ratingData['reviews']} avis\n\n";
    }
    
    echo "🎉 All products updated with individual ratings and review counts!\n";
    echo "\nSummary:\n";
    echo "- Each product now has its own unique rating (less than 5.0 with decimals)\n";
    echo "- Each product has its own unique review count\n";
    echo "- Product cards will now show individual ratings and review counts\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}



