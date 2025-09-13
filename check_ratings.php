<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CURRENT PRODUCT RATINGS ===\n\n";

try {
    $products = \App\Models\Product::all(['id', 'name', 'rating', 'reviews']);
    
    foreach($products as $p) {
        echo $p->id . ' - ' . $p->name . ' - Rating: ' . $p->rating . ' - Reviews: ' . $p->reviews . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}



