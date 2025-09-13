<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== ADDING MISSING DATA TO DATABASE ===\n\n";

try {
    // Add banners (banners table only has backgroundImage, product_id, discount)
    echo "Adding banners...\n";
    $banners = [
        [
            'backgroundImage' => '/images/banner-zitalgic.png',
            'product_id' => 1, // Zitalgic
            'discount' => 15,
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'backgroundImage' => '/images/banner-detoxoil&relaxoil.png',
            'product_id' => 3, // Detoxoil
            'discount' => 10,
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'backgroundImage' => '/images/banner-zitalgic.png',
            'product_id' => 2, // Zitalgic Sport
            'discount' => 20,
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($banners as $banner) {
        \App\Models\Banner::create($banner);
    }
    echo "✅ Added " . count($banners) . " banners\n\n";
    
    // Add slides (slides table only has image and alt)
    echo "Adding slides...\n";
    $slides = [
        [
            'image' => '/images/slide1.png',
            'alt' => 'BioEcleel - Votre bien-être naturel',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'image' => '/images/slide2.png',
            'alt' => 'Découvrez nos compléments alimentaires bio',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'image' => '/images/authentic-lab.png',
            'alt' => 'Qualité Authentic Laboratory',
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($slides as $slide) {
        \App\Models\Slide::create($slide);
    }
    echo "✅ Added " . count($slides) . " slides\n\n";
    
    // Add more promotions (promotions table has title, subtitle, description, backgroundImage, product_id, discount)
    echo "Adding more promotions...\n";
    $promotions = [
        [
            'title' => 'Pack Détox Complet',
            'subtitle' => 'Purifiez votre Corps',
            'description' => 'Detoxoil® + Jus Naturel à prix réduit pour une détox complète',
            'backgroundImage' => '/images/promoDetox.png',
            'product_id' => 3, // Detoxoil
            'discount' => 35,
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'title' => 'Relaxation Premium',
            'subtitle' => 'Détendez-vous avec Relaxoil®',
            'description' => 'Profitez de -20% sur Relaxoil® pour une relaxation profonde',
            'backgroundImage' => '/images/promoRelax.png',
            'product_id' => 4, // Relaxoil
            'discount' => 20,
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'title' => 'Sport & Performance',
            'subtitle' => 'Zitalgic® Sport pour Athlètes',
            'description' => 'Récupération optimale avec Zitalgic® Sport - Offre spéciale sportifs',
            'backgroundImage' => '/images/promoZitaSport.png',
            'product_id' => 2, // Zitalgic Sport
            'discount' => 25,
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($promotions as $promotion) {
        \App\Models\Promotion::create($promotion);
    }
    echo "✅ Added " . count($promotions) . " promotions\n\n";
    
    // Verify data counts
    echo "=== VERIFICATION ===\n";
    echo "Banners: " . \App\Models\Banner::count() . "\n";
    echo "Slides: " . \App\Models\Slide::count() . "\n";
    echo "Promotions: " . \App\Models\Promotion::count() . "\n";
    echo "Products: " . \App\Models\Product::count() . "\n";
    echo "Categories: " . \App\Models\Categorie::count() . "\n";
    echo "Suppliers: " . \App\Models\Supplier::count() . "\n";
    
    echo "\n✅ All data added successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== COMPLETE ===\n";
