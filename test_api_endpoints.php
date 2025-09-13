<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TESTING API ENDPOINTS ===\n\n";

// Test each endpoint
$endpoints = [
    'banners' => '/api/banners',
    'products' => '/api/products', 
    'categories' => '/api/categories',
    'promotions' => '/api/promotions',
    'slides' => '/api/slides',
    'suppliers' => '/api/suppliers'
];

foreach ($endpoints as $name => $endpoint) {
    echo "Testing $name ($endpoint):\n";
    
    try {
        // Test the route directly
        $response = app('Illuminate\Http\Request')->create($endpoint, 'GET');
        $response = app('Illuminate\Routing\Router')->dispatch($response);
        
        if ($response->getStatusCode() === 200) {
            $data = json_decode($response->getContent(), true);
            echo "  ✅ Status: 200\n";
            echo "  📊 Data count: " . (is_array($data) ? count($data) : 'not array') . "\n";
            
            if (is_array($data) && count($data) > 0) {
                echo "  📝 Sample data: " . json_encode($data[0], JSON_PRETTY_PRINT) . "\n";
            }
        } else {
            echo "  ❌ Status: " . $response->getStatusCode() . "\n";
        }
    } catch (Exception $e) {
        echo "  ❌ Error: " . $e->getMessage() . "\n";
    }
    
    echo "\n";
}

// Test database models directly
echo "=== TESTING DATABASE MODELS DIRECTLY ===\n\n";

try {
    echo "Banners:\n";
    $banners = \App\Models\Banner::all();
    echo "  Count: " . $banners->count() . "\n";
    if ($banners->count() > 0) {
        echo "  Sample: " . json_encode($banners->first()->toArray(), JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
    
    echo "Products:\n";
    $products = \App\Models\Product::with('category')->get();
    echo "  Count: " . $products->count() . "\n";
    if ($products->count() > 0) {
        echo "  Sample: " . json_encode($products->first()->toArray(), JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
    
    echo "Categories:\n";
    $categories = \App\Models\Categorie::all();
    echo "  Count: " . $categories->count() . "\n";
    if ($categories->count() > 0) {
        echo "  Sample: " . json_encode($categories->first()->toArray(), JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
    
    echo "Promotions:\n";
    $promotions = \App\Models\Promotion::all();
    echo "  Count: " . $promotions->count() . "\n";
    if ($promotions->count() > 0) {
        echo "  Sample: " . json_encode($promotions->first()->toArray(), JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
    
    echo "Slides:\n";
    $slides = \App\Models\Slide::all();
    echo "  Count: " . $slides->count() . "\n";
    if ($slides->count() > 0) {
        echo "  Sample: " . json_encode($slides->first()->toArray(), JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
    
    echo "Suppliers:\n";
    $suppliers = \App\Models\Supplier::all();
    echo "  Count: " . $suppliers->count() . "\n";
    if ($suppliers->count() > 0) {
        echo "  Sample: " . json_encode($suppliers->first()->toArray(), JSON_PRETTY_PRINT) . "\n";
    }
    echo "\n";
    
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

echo "=== TEST COMPLETE ===\n";