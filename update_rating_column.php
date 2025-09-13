<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== UPDATING RATING COLUMN TO DECIMAL ===\n\n";

try {
    // Update the column type directly using raw SQL
    \DB::statement('ALTER TABLE products MODIFY COLUMN rating DECIMAL(3,1) DEFAULT 0');
    
    echo "✅ Updated rating column to DECIMAL(3,1)\n\n";
    
    // Now update the ratings with decimal values
    \App\Models\Product::where('id', 1)->update(['rating' => 4.2]);
    \App\Models\Product::where('id', 2)->update(['rating' => 4.6]);
    \App\Models\Product::where('id', 3)->update(['rating' => 4.1]);
    \App\Models\Product::where('id', 4)->update(['rating' => 4.4]);
    
    echo "✅ Updated all ratings to decimal values\n\n";
    
    // Verify the updates
    $products = \App\Models\Product::all(['id', 'name', 'rating', 'reviews']);
    
    echo "Final ratings:\n";
    foreach($products as $p) {
        echo "Product {$p->id}: {$p->name} - Rating: {$p->rating} - Reviews: {$p->reviews}\n";
    }
    
    echo "\n🎉 All products now have individual decimal ratings less than 5.0!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}



