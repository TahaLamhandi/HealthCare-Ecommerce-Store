<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Banner;
use App\Models\Promotion;
use App\Models\Product;

class BannerPromotionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some products to relate to
        $products = Product::take(6)->get();
        
        if ($products->count() < 2) {
            $this->command->error('Not enough products found. Please seed products first.');
            return;
        }

        // Clear existing data
        Banner::truncate();
        Promotion::truncate();

        // Create Banners (only backgroundImage, product_id, discount columns)
        $banners = [
            [
                'backgroundImage' => '/images/banner1.jpg',
                'product_id' => $products[0]->id,
                'discount' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'backgroundImage' => '/images/banner2.jpg',
                'product_id' => $products[1]->id,
                'discount' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($banners as $bannerData) {
            Banner::create($bannerData);
        }

        // Create Promotions
        $promotions = [
            [
                'title' => 'Offre Spéciale Zitalgic®',
                'subtitle' => 'Solution naturelle contre les douleurs',
                'description' => 'Profitez de -15% sur toute la gamme Zitalgic® pour une récupération optimale',
                'backgroundImage' => '/images/promZital.png',
                'product_id' => $products[0]->id,
                'discount' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Pack Détox Complet',
                'subtitle' => 'Purifiez votre Corps',
                'description' => 'Detoxoil® + Jus Naturel à prix réduit pour une détox complète',
                'backgroundImage' => '/images/promoDetox.png',
                'product_id' => $products[1]->id,
                'discount' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Collection Premium',
                'subtitle' => 'Votre bien-être mérite le meilleur',
                'description' => 'Découvrez notre sélection premium de produits naturels à prix exceptionnel',
                'backgroundImage' => '/images/promoPremium.png',
                'product_id' => $products[2]->id ?? $products[0]->id,
                'discount' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Offre Flash',
                'subtitle' => 'Limité dans le temps',
                'description' => 'Profitez de cette offre exceptionnelle qui ne dure pas longtemps',
                'backgroundImage' => '/images/promoFlash.png',
                'product_id' => $products[3]->id ?? $products[1]->id,
                'discount' => 40,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($promotions as $promotionData) {
            Promotion::create($promotionData);
        }

        $this->command->info('Banners and Promotions seeded successfully!');
        $this->command->info('Created ' . count($banners) . ' banners and ' . count($promotions) . ' promotions');
    }
}