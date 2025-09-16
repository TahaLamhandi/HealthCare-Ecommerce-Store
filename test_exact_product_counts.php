<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING EXACT PRODUCT COUNTS FOR CATEGORIES ===\n\n";

try {
    // Get all categories
    $categories = \App\Models\Categorie::all();
    echo "Categories found: " . $categories->count() . "\n\n";
    
    foreach ($categories as $category) {
        echo "Category: {$category->title} (ID: {$category->id})\n";
        
        // Count products by category ID
        $productCount = \App\Models\Product::where('categorie_id', $category->id)->count();
        
        // Format the count exactly like the frontend will show
        if ($productCount === 0) {
            $displayText = '0 produits';
        } elseif ($productCount === 1) {
            $displayText = '1 produit';
        } else {
            $displayText = "{$productCount} produits";
        }
        
        echo "  Product count: {$productCount}\n";
        echo "  Display text: '{$displayText}'\n";
        
        // Get sample products
        $sampleProducts = \App\Models\Product::where('categorie_id', $category->id)->limit(3)->get(['id', 'name']);
        if ($sampleProducts->count() > 0) {
            echo "  Sample products:\n";
            foreach ($sampleProducts as $product) {
                echo "    - {$product->name}\n";
            }
        } else {
            echo "  No products in this category\n";
        }
        
        echo "\n";
    }
    
    echo "=== EXPECTED FRONTEND DISPLAY ===\n";
    echo "In the 'Découvrez nos Trésors Naturels' section, the category cards should show:\n\n";
    
    foreach ($categories as $category) {
        $productCount = \App\Models\Product::where('categorie_id', $category->id)->count();
        if ($productCount === 0) {
            $displayText = '0 produits';
        } elseif ($productCount === 1) {
            $displayText = '1 produit';
        } else {
            $displayText = "{$productCount} produits";
        }
        
        echo "• {$category->title}: {$displayText}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== TEST COMPLETE ===\n";





