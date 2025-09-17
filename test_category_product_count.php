<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING CATEGORY PRODUCT COUNT ===\n\n";

try {
    // Get all categories
    $categories = \App\Models\Categorie::all();
    echo "Categories found: " . $categories->count() . "\n\n";
    
    foreach ($categories as $category) {
        echo "Category: {$category->title} (ID: {$category->id})\n";
        
        // Count products by category ID
        $productCountById = \App\Models\Product::where('categorie_id', $category->id)->count();
        echo "  Products by categorie_id: {$productCountById}\n";
        
        // Count products by category relationship
        $productCountByRelation = \App\Models\Product::whereHas('category', function($query) use ($category) {
            $query->where('id', $category->id);
        })->count();
        echo "  Products by relationship: {$productCountByRelation}\n";
        
        // Get sample products
        $sampleProducts = \App\Models\Product::where('categorie_id', $category->id)->limit(3)->get(['id', 'name', 'categorie_id']);
        echo "  Sample products:\n";
        foreach ($sampleProducts as $product) {
            echo "    - ID: {$product->id}, Name: {$product->name}, Category ID: {$product->categorie_id}\n";
        }
        
        echo "\n";
    }
    
    // Test the API response format
    echo "=== API RESPONSE FORMAT ===\n";
    $products = \App\Models\Product::with('category')->get();
    echo "Products with category relationship:\n";
    foreach ($products as $product) {
        echo "Product: {$product->name}\n";
        echo "  Category ID: {$product->categorie_id}\n";
        echo "  Category Object: " . ($product->category ? $product->category->title : 'NULL') . "\n";
        echo "\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "=== TEST COMPLETE ===\n";








