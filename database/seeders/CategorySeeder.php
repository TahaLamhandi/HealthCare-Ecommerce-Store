<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // Skip seeding if categories already exist (to avoid duplicates)
        if (Categorie::count() > 0) {
            return;
        }
        
        $categories = [
            [
                'title' => 'Compléments alimentaires',
                'subtitle' => 'Solutions naturelles',
                'description' => 'Solutions naturelles pour la santé et le bien-être, formulées par Authentic Laboratory',
                'img' => '/images/category-complements.jpg',
                'icon' => '💊',
                'stats' => '4 produits phares',
                'features' => json_encode(['Formules naturelles', 'Certifiées bio', 'Efficacité prouvée', 'Qualité premium']),
                'popular_products' => json_encode(['Zitalgic®', 'Zitalgic® Sport', 'Detoxoil®', 'Relaxoil®']),
                'target_audience' => 'Personnes soucieuses de leur santé et bien-être naturel',
            ],
            [
                'title' => 'Aromathérapie',
                'subtitle' => 'Bien-être naturel',
                'description' => 'Huiles essentielles pures et mélanges aromatiques pour le bien-être au quotidien',
                'img' => '/images/category-aromatherapie.jpg',
                'icon' => '🌸',
                'stats' => '50+ essences',
                'features' => json_encode(['Huiles essentielles pures', 'Mélanges exclusifs', 'Effets thérapeutiques', 'Odeurs naturelles']),
                'popular_products' => json_encode(['Huile de lavande', 'Mélange relaxant', 'Diffuseur premium', 'Roll-on stress']),
                'target_audience' => 'Amateurs d\'aromathérapie et de bien-être naturel',
            ],
            [
                'title' => 'Nutrition naturelle',
                'subtitle' => 'Alimentation saine',
                'description' => 'Superaliments, compléments nutritionnels et produits bio pour une alimentation saine',
                'img' => '/images/category-nutrition.jpg',
                'icon' => '🥗',
                'stats' => '100+ produits',
                'features' => json_encode(['Superaliments bio', 'Compléments nutritionnels', 'Qualité premium', 'Traçabilité garantie']),
                'popular_products' => json_encode(['Spiruline bio', 'Curcuma premium', 'Oméga-3', 'Vitamines naturelles']),
                'target_audience' => 'Personnes soucieuses d\'une alimentation saine et naturelle',
            ],
            [
                'title' => 'Cosmétique naturelle',
                'subtitle' => 'Beauté naturelle',
                'description' => 'Soins visage et corps 100% naturels, sans ingrédients chimiques nocifs',
                'img' => '/images/category-cosmetique.jpg',
                'icon' => '✨',
                'stats' => '80+ produits',
                'features' => json_encode(['100% naturel', 'Sans parabens', 'Testé dermatologiquement', 'Efficacité prouvée']),
                'popular_products' => json_encode(['Crème hydratante', 'Sérum anti-âge', 'Masque purifiant', 'Lotion corporelle']),
                'target_audience' => 'Personnes privilégiant les soins naturels et respectueux de la peau',
            ]
        ];
        
        foreach ($categories as $categoryData) {
            Categorie::create($categoryData);
        }
    }
}