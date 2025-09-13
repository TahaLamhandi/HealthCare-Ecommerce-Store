<?php

namespace Database\Seeders;

use App\Models\Promotion;
use App\Models\Product;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run()
    {
        // Get products to create promotions for
        $products = Product::all();
        
        if ($products->isEmpty()) {
            return; // No products to create promotions for
        }

        $promotions = [
            [
                'title' => 'Offre Spéciale Zitalgic®',
                'subtitle' => 'Solution naturelle contre les douleurs',
                'description' => 'Profitez de -15% sur toute la gamme Zitalgic® pour une récupération optimale',
                'backgroundImage' => '/images/promo-zitalgic.png',
                'product_id' => $products->where('name', 'like', '%Zitalgic%')->first()?->id ?? $products->first()->id,
                'discount' => 15,
            ],
            [
                'title' => 'Beauté Anti-Âge',
                'subtitle' => 'Retrouvez une peau jeune',
                'description' => 'Sérum anti-âge révolutionnaire à -25% pour des résultats visibles',
                'backgroundImage' => '/images/promo-serum.png',
                'product_id' => $products->where('name', 'like', '%Sérum%')->first()?->id ?? $products->skip(1)->first()?->id ?? $products->first()->id,
                'discount' => 25,
            ],
            [
                'title' => 'Minceur Naturelle',
                'subtitle' => 'Votre allié silhouette',
                'description' => 'Brûleur de graisses naturel à -30% pour atteindre vos objectifs',
                'backgroundImage' => '/images/promo-minceur.png',
                'product_id' => $products->where('name', 'like', '%Brûleur%')->first()?->id ?? $products->skip(2)->first()?->id ?? $products->first()->id,
                'discount' => 30,
            ],
            [
                'title' => 'Magnésium Essentiel',
                'subtitle' => 'Énergie et vitalité',
                'description' => 'Magnésium marin à -20% pour combattre la fatigue naturellement',
                'backgroundImage' => '/images/promo-magnesium.png',
                'product_id' => $products->where('name', 'like', '%Magnésium%')->first()?->id ?? $products->skip(3)->first()?->id ?? $products->first()->id,
                'discount' => 20,
            ]
        ];

        foreach ($promotions as $promotionData) {
            if ($promotionData['product_id']) {
                Promotion::create($promotionData);
            }
        }
    }
}