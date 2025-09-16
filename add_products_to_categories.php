<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== ADDING PRODUCTS TO ALL CATEGORIES ===\n\n";

try {
    // Add products to Aromathérapie (Category ID: 2)
    echo "Adding products to Aromathérapie...\n";
    $aromatherapieProducts = [
        [
            'categorie_id' => 2,
            'name' => 'Huile Essentielle de Lavande',
            'price' => 24.99,
            'img' => '/images/lavande.jpg',
            'rating' => 4.8,
            'reviews' => 89,
            'isNew' => false,
            'discount' => 0,
            'description' => 'Huile essentielle de lavande pure pour relaxation et bien-être.',
            'long_description' => 'Huile essentielle de lavande 100% pure, distillée à la vapeur d\'eau. Parfaite pour la relaxation, le sommeil et l\'apaisement.',
            'composition' => '["Lavande vraie pure", "100% naturelle", "Distillée à la vapeur"]',
            'usage_instructions' => 'Quelques gouttes dans un diffuseur ou sur les poignets pour profiter de ses bienfaits.',
            'benefits' => '["Relaxation", "Amélioration du sommeil", "Apaisement naturel", "Odeur délicate"]',
            'features' => '["100% pure", "Sans additifs", "Qualité premium", "Origine France"]',
            'quality_guarantees' => '["Testée en laboratoire", "Certifiée bio", "Traçabilité garantie"]',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'categorie_id' => 2,
            'name' => 'Mélange Relaxant Eucalyptus',
            'price' => 29.99,
            'img' => '/images/eucalyptus.jpg',
            'rating' => 4.7,
            'reviews' => 67,
            'isNew' => true,
            'discount' => 10,
            'description' => 'Mélange d\'huiles essentielles d\'eucalyptus pour respiration et détente.',
            'long_description' => 'Synergie d\'huiles essentielles d\'eucalyptus, menthe et romarin pour une respiration libre et une détente profonde.',
            'composition' => '["Eucalyptus globulus", "Menthe poivrée", "Romarin", "Huile de support"]',
            'usage_instructions' => 'Appliquer sur la poitrine et respirer profondément. Utilisable en massage ou diffusion.',
            'benefits' => '["Respiration libre", "Détente musculaire", "Clarté mentale", "Fraîcheur naturelle"]',
            'features' => '["Mélange exclusif", "100% naturel", "Efficacité prouvée"]',
            'quality_guarantees' => '["Formule testée", "Ingrédients certifiés", "Fabriqué en France"]',
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($aromatherapieProducts as $product) {
        \App\Models\Product::create($product);
    }
    echo "✅ Added " . count($aromatherapieProducts) . " products to Aromathérapie\n\n";
    
    // Add products to Nutrition naturelle (Category ID: 3)
    echo "Adding products to Nutrition naturelle...\n";
    $nutritionProducts = [
        [
            'categorie_id' => 3,
            'name' => 'Spiruline Bio Premium',
            'price' => 34.99,
            'img' => '/images/spiruline.jpg',
            'rating' => 4.9,
            'reviews' => 156,
            'isNew' => false,
            'discount' => 15,
            'description' => 'Spiruline bio premium, superaliment riche en protéines et nutriments.',
            'long_description' => 'Spiruline bio de qualité premium, cultivée dans des conditions optimales. Riche en protéines, fer, vitamines et antioxydants naturels.',
            'composition' => '["Spiruline bio pure", "100% naturelle", "Séchée à basse température"]',
            'usage_instructions' => '1 cuillère à café par jour dans un verre d\'eau ou smoothie. À prendre le matin.',
            'benefits' => '["Riche en protéines", "Antioxydants naturels", "Énergie durable", "Système immunitaire"]',
            'features' => '["Bio certifié", "Sans additifs", "Qualité premium", "Origine contrôlée"]',
            'quality_guarantees' => '["Certifiée bio", "Testée en laboratoire", "Traçabilité complète"]',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'categorie_id' => 3,
            'name' => 'Curcuma Bio en Poudre',
            'price' => 19.99,
            'img' => '/images/curcuma.jpg',
            'rating' => 4.6,
            'reviews' => 98,
            'isNew' => false,
            'discount' => 0,
            'description' => 'Curcuma bio en poudre, épice aux multiples bienfaits pour la santé.',
            'long_description' => 'Curcuma bio en poudre, récolté et séché selon des méthodes traditionnelles. Riche en curcumine, un puissant antioxydant naturel.',
            'composition' => '["Curcuma bio pur", "100% naturel", "Sans conservateurs"]',
            'usage_instructions' => '1/2 cuillère à café par jour dans vos plats ou boissons. À consommer avec du poivre noir pour une meilleure absorption.',
            'benefits' => '["Antioxydant puissant", "Anti-inflammatoire naturel", "Digestion", "Bien-être général"]',
            'features' => '["Bio certifié", "Qualité premium", "Sans additifs", "Origine Inde"]',
            'quality_guarantees' => '["Certifiée bio", "Contrôlée en laboratoire", "Traçabilité garantie"]',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'categorie_id' => 3,
            'name' => 'Oméga-3 Végétal',
            'price' => 39.99,
            'img' => '/images/omega3.jpg',
            'rating' => 4.8,
            'reviews' => 124,
            'isNew' => true,
            'discount' => 20,
            'description' => 'Complément d\'oméga-3 d\'origine végétale, essentiel pour la santé cardiovasculaire.',
            'long_description' => 'Oméga-3 d\'origine végétale extrait d\'algues marines. Riche en EPA et DHA, essentiels pour le cœur, le cerveau et les articulations.',
            'composition' => '["Huile d\'algues marines", "EPA et DHA", "Vitamine E", "100% végétal"]',
            'usage_instructions' => '2 capsules par jour avec un verre d\'eau, de préférence pendant un repas.',
            'benefits' => '["Santé cardiovasculaire", "Fonction cérébrale", "Articulations", "Vision"]',
            'features' => '["100% végétal", "Sans métaux lourds", "Capsules gastro-résistantes"]',
            'quality_guarantees' => '["Testé en laboratoire", "Sans contaminants", "Qualité pharmaceutique"]',
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($nutritionProducts as $product) {
        \App\Models\Product::create($product);
    }
    echo "✅ Added " . count($nutritionProducts) . " products to Nutrition naturelle\n\n";
    
    // Add products to Cosmétique naturelle (Category ID: 4)
    echo "Adding products to Cosmétique naturelle...\n";
    $cosmetiqueProducts = [
        [
            'categorie_id' => 4,
            'name' => 'Crème Hydratante Bio',
            'price' => 27.99,
            'img' => '/images/creme-hydratante.jpg',
            'rating' => 4.7,
            'reviews' => 89,
            'isNew' => false,
            'discount' => 0,
            'description' => 'Crème hydratante bio pour tous types de peau, 100% naturelle.',
            'long_description' => 'Crème hydratante bio formulée avec des ingrédients naturels. Hydrate en profondeur sans laisser de film gras.',
            'composition' => '["Aloe vera bio", "Beurre de karité", "Huile d\'argan", "Vitamine E"]',
            'usage_instructions' => 'Appliquer matin et soir sur le visage et le cou en massant délicatement.',
            'benefits' => '["Hydratation profonde", "Peau douce", "100% naturel", "Tous types de peau"]',
            'features' => '["Bio certifié", "Sans parabens", "Testé dermatologiquement"]',
            'quality_guarantees' => '["Certifiée bio", "Sans ingrédients chimiques", "Fabriqué en France"]',
            'created_at' => now(),
            'updated_at' => now()
        ],
        [
            'categorie_id' => 4,
            'name' => 'Sérum Anti-Âge Naturel',
            'price' => 49.99,
            'img' => '/images/serum-anti-age.jpg',
            'rating' => 4.9,
            'reviews' => 112,
            'isNew' => true,
            'discount' => 25,
            'description' => 'Sérum anti-âge naturel aux actifs végétaux, pour une peau plus jeune.',
            'long_description' => 'Sérum anti-âge formulé avec des actifs végétaux puissants. Ralentit les signes de l\'âge et redonne éclat à la peau.',
            'composition' => '["Extrait de grenade", "Acide hyaluronique végétal", "Vitamine C naturelle", "Huile de rose musquée"]',
            'usage_instructions' => 'Quelques gouttes le soir sur le visage et le cou, en évitant le contour des yeux.',
            'benefits' => '["Anti-âge naturel", "Éclat de la peau", "Rides atténuées", "Peau plus ferme"]',
            'features' => '["100% naturel", "Sans parabens", "Concentration élevée"]',
            'quality_guarantees' => '["Testé dermatologiquement", "Sans ingrédients chimiques", "Efficacité prouvée"]',
            'created_at' => now(),
            'updated_at' => now()
        ]
    ];
    
    foreach ($cosmetiqueProducts as $product) {
        \App\Models\Product::create($product);
    }
    echo "✅ Added " . count($cosmetiqueProducts) . " products to Cosmétique naturelle\n\n";
    
    // Verify final counts
    echo "=== FINAL PRODUCT COUNTS ===\n";
    $allCategories = \App\Models\Categorie::all();
    foreach ($allCategories as $category) {
        $count = \App\Models\Product::where('categorie_id', $category->id)->count();
        if ($count === 0) {
            $displayText = '0 produits';
        } elseif ($count === 1) {
            $displayText = '1 produit';
        } else {
            $displayText = "{$count} produits";
        }
        echo "• {$category->title}: {$displayText}\n";
    }
    
    echo "\n✅ All products added successfully!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n=== COMPLETE ===\n";





