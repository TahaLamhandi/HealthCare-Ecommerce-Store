<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Categorie;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Skip seeding if products already exist (to avoid duplicates)
        if (Product::count() > 0) {
            return;
        }
        
        // Get categories
        $categories = Categorie::all();
        
        if ($categories->isEmpty()) {
            // Create default categories if none exist
            $categories = collect([
                Categorie::create(['title' => 'Compléments alimentaires', 'description' => 'Solutions naturelles pour la santé et le bien-être']),
                Categorie::create(['title' => 'Aromathérapie', 'description' => 'Huiles essentielles pures et mélanges aromatiques']),
                Categorie::create(['title' => 'Nutrition naturelle', 'description' => 'Superaliments et compléments nutritionnels bio']),
                Categorie::create(['title' => 'Cosmétique naturelle', 'description' => 'Soins visage et corps 100% naturels']),
            ]);
        }

        // Get the Compléments alimentaires category
        $complementsCategory = $categories->firstWhere('title', 'Compléments alimentaires');
        
        $products = [
            [
                'categorie_id' => $complementsCategory->id,
                'name' => 'Zitalgic®',
                'price' => 89.99,
                'img' => '/images/zitalgic.jpg',
                'rating' => 4.8,
                'reviews' => 124,
                'isNew' => true,
                'discount' => 15,
                'description' => 'Solution naturelle contre les douleurs articulaires, musculaires et nerveuses.',
                'long_description' => 'Zitalgic® est une formule naturelle innovante développée par Authentic Laboratory pour soulager efficacement les douleurs articulaires, musculaires et nerveuses. Cette solution combine des ingrédients actifs naturels pour offrir un soulagement rapide et durable.',
                'composition' => json_encode(['Menthol naturel', 'Camphre bio', 'Eucalyptus', 'Arnica montana', 'Extrait de curcuma']),
                'benefits' => json_encode(['Soulagement rapide des douleurs', 'Effet chaud-froid apaisant', 'Réduction de l\'inflammation', 'Formule 100% naturelle', 'Absorption cutanée optimale']),
                'usage_instructions' => 'Appliquer une noisette de produit sur la zone douloureuse et masser délicatement jusqu\'à pénétration complète. Renouveler 2-3 fois par jour selon les besoins.',
                'target_conditions' => 'Douleurs articulaires, contractures musculaires, courbatures, raideurs, douleurs nerveuses',
                'medical_effects' => json_encode(['Anti-inflammatoire naturel', 'Analgésique local', 'Relaxant musculaire', 'Stimulant circulatoire']),
                'features' => json_encode(['Texture non grasse', 'Absorption rapide', 'Odeur agréable', 'Certifié bio']),
                'quality_guarantees' => json_encode(['Formule Authentic Laboratory', 'Ingrédients certifiés bio', 'Testé dermatologiquement', 'Fabriqué en France']),
                'packages' => json_encode([
                    ['id' => 1, 'name' => '1 ZITALGIC®', 'price' => 89.99, 'oldPrice' => 99.99, 'save' => 10, 'label' => ''],
                    ['id' => 2, 'name' => '3 ZITALGIC®', 'price' => 249.99, 'oldPrice' => 299.97, 'save' => 49.98, 'label' => 'Meilleur Vente'],
                    ['id' => 3, 'name' => '5 ZITALGIC®', 'price' => 399.99, 'oldPrice' => 499.95, 'save' => 99.96, 'label' => 'Pack économique']
                ]),
                'images' => json_encode(['/images/zitalgic.jpg', '/images/zitalgic-2.jpg', '/images/zitalgic-3.jpg']),
                'testimonials' => json_encode([
                    ['name' => 'Marie L.', 'rating' => 5, 'comment' => 'Excellent produit, soulagement immédiat de mes douleurs articulaires.'],
                    ['name' => 'Ahmed K.', 'rating' => 5, 'comment' => 'Formule naturelle très efficace, je recommande vivement.'],
                    ['name' => 'Sophie M.', 'rating' => 4, 'comment' => 'Très bon rapport qualité-prix, effet durable.']
                ]),
            ],
            [
                'categorie_id' => $complementsCategory->id,
                'name' => 'Zitalgic® Sport',
                'price' => 94.99,
                'img' => '/images/zitalgic-sport.jpg',
                'rating' => 4.9,
                'reviews' => 89,
                'isNew' => false,
                'discount' => 0,
                'description' => 'Formule naturelle de récupération musculaire pour athlètes et personnes actives.',
                'long_description' => 'Zitalgic® Sport est spécialement formulé pour les sportifs et les personnes actives. Cette version enrichie en menthol procure une sensation de fraîcheur intense tout en préparant les muscles à l\'effort et en accélérant la récupération.',
                'composition' => json_encode(['Menthol renforcé', 'Camphre bio', 'Eucalyptus', 'Arnica montana', 'Extrait de curcuma', 'Huile de menthe poivrée']),
                'benefits' => json_encode(['Préparation musculaire optimale', 'Récupération accélérée', 'Sensation de fraîcheur intense', 'Réduction des tensions', 'Formule non grasse']),
                'usage_instructions' => 'Appliquer avant l\'entraînement pour préparer les muscles, et après pour favoriser la récupération. Masser jusqu\'à pénétration complète.',
                'target_conditions' => 'Récupération sportive, préparation musculaire, courbatures post-entraînement, tensions musculaires',
                'medical_effects' => json_encode(['Stimulant circulatoire', 'Relaxant musculaire', 'Anti-inflammatoire', 'Rafraîchissant']),
                'features' => json_encode(['Texture non grasse', 'Absorption ultra-rapide', 'Odeur mentholée', 'Certifié sport']),
                'quality_guarantees' => json_encode(['Formule Authentic Laboratory', 'Testé par des sportifs', 'Conforme aux normes sport', 'Fabriqué en France']),
                'packages' => json_encode([
                    ['id' => 1, 'name' => '1 ZITALGIC® SPORT', 'price' => 94.99, 'oldPrice' => null, 'save' => 0, 'label' => ''],
                    ['id' => 2, 'name' => '3 ZITALGIC® SPORT', 'price' => 269.99, 'oldPrice' => 284.97, 'save' => 14.98, 'label' => 'Pack Sport'],
                    ['id' => 3, 'name' => '5 ZITALGIC® SPORT', 'price' => 429.99, 'oldPrice' => 474.95, 'save' => 44.96, 'label' => 'Pack Champion']
                ]),
                'images' => json_encode(['/images/zitalgic-sport.jpg', '/images/zitalgic-sport-2.jpg', '/images/zitalgic-sport-3.jpg']),
                'testimonials' => json_encode([
                    ['name' => 'Karim B.', 'rating' => 5, 'comment' => 'Parfait pour ma récupération après le foot, sensation de fraîcheur incroyable.'],
                    ['name' => 'Fatima A.', 'rating' => 5, 'comment' => 'Utilisé avant mes cours de yoga, préparation musculaire excellente.'],
                    ['name' => 'Youssef M.', 'rating' => 4, 'comment' => 'Très efficace pour les courbatures, je l\'utilise régulièrement.']
                ]),
            ],
            [
                'categorie_id' => $complementsCategory->id,
                'name' => 'Detoxoil®',
                'price' => 79.99,
                'img' => '/images/detoxoil.jpg',
                'rating' => 4.7,
                'reviews' => 156,
                'isNew' => false,
                'discount' => 10,
                'description' => 'Huile de massage détoxifiante stimulant la circulation lymphatique.',
                'long_description' => 'Detoxoil® est une huile de massage détoxifiante qui stimule naturellement la circulation lymphatique. Cette synergie d\'huiles essentielles purifie, tonifie et revitalise le corps en éliminant les toxines accumulées.',
                'composition' => json_encode(['Huile de pamplemousse', 'Huile de citron', 'Huile de genévrier', 'Huile de romarin', 'Huile de cèdre']),
                'benefits' => json_encode(['Élimination des toxines', 'Drainage lymphatique', 'Sensation de légèreté', 'Stimulation circulatoire', 'Purification naturelle']),
                'usage_instructions' => 'Appliquer sur les zones à traiter et masser en mouvements circulaires de bas en haut. Utiliser de préférence le matin pour un effet drainant optimal.',
                'target_conditions' => 'Rétention d\'eau, jambes lourdes, cellulite, fatigue générale, accumulation de toxines',
                'medical_effects' => json_encode(['Drainant lymphatique', 'Stimulant circulatoire', 'Détoxifiant naturel', 'Tonifiant cutané']),
                'features' => json_encode(['Texture huileuse fluide', 'Odeur agréable', 'Absorption rapide', 'Certifié bio']),
                'quality_guarantees' => json_encode(['Formule Authentic Laboratory', 'Huiles essentielles pures', 'Testé dermatologiquement', 'Fabriqué en France']),
                'packages' => json_encode([
                    ['id' => 1, 'name' => '1 DETOXOIL®', 'price' => 79.99, 'oldPrice' => 89.99, 'save' => 10, 'label' => ''],
                    ['id' => 2, 'name' => '3 DETOXOIL®', 'price' => 219.99, 'oldPrice' => 269.97, 'save' => 49.98, 'label' => 'Pack Détox'],
                    ['id' => 3, 'name' => '5 DETOXOIL®', 'price' => 349.99, 'oldPrice' => 449.95, 'save' => 99.96, 'label' => 'Pack Purification']
                ]),
                'images' => json_encode(['/images/detoxoil.jpg', '/images/detoxoil-2.jpg', '/images/detoxoil-3.jpg']),
                'testimonials' => json_encode([
                    ['name' => 'Aicha R.', 'rating' => 5, 'comment' => 'Excellent pour les jambes lourdes, effet drainant remarquable.'],
                    ['name' => 'Hassan T.', 'rating' => 4, 'comment' => 'Très bon produit, sensation de légèreté après utilisation.'],
                    ['name' => 'Nadia S.', 'rating' => 5, 'comment' => 'Utilisé en cure détox, résultats visibles rapidement.']
                ]),
            ],
            [
                'categorie_id' => $complementsCategory->id,
                'name' => 'Relaxoil®',
                'price' => 69.99,
                'img' => '/images/relaxoil.jpg',
                'rating' => 4.8,
                'reviews' => 203,
                'isNew' => false,
                'discount' => 0,
                'description' => 'Mélange d\'huiles essentielles apaisantes pour relaxation profonde.',
                'long_description' => 'Relaxoil® est un mélange harmonieux d\'huiles essentielles apaisantes qui favorise la relaxation profonde et améliore la qualité du sommeil. Cette formule naturelle soulage les tensions et calme l\'esprit pour une récupération optimale.',
                'composition' => json_encode(['Huile de lavande', 'Huile de camomille', 'Huile d\'ylang-ylang', 'Huile de bergamote', 'Huile de marjolaine']),
                'benefits' => json_encode(['Relaxation profonde', 'Amélioration du sommeil', 'Soulagement des tensions', 'Calme l\'esprit', 'Récupération naturelle']),
                'usage_instructions' => 'Appliquer quelques gouttes sur les tempes, le cou et les poignets. Masser délicatement en respirant profondément. Utiliser de préférence le soir.',
                'target_conditions' => 'Stress, anxiété, troubles du sommeil, tensions musculaires, fatigue nerveuse',
                'medical_effects' => json_encode(['Relaxant naturel', 'Sédatif doux', 'Anti-stress', 'Apaisant nerveux']),
                'features' => json_encode(['Odeur apaisante', 'Texture légère', 'Absorption rapide', 'Certifié bio']),
                'quality_guarantees' => json_encode(['Formule Authentic Laboratory', 'Huiles essentielles pures', 'Testé dermatologiquement', 'Fabriqué en France']),
                'packages' => json_encode([
                    ['id' => 1, 'name' => '1 RELAXOIL®', 'price' => 69.99, 'oldPrice' => null, 'save' => 0, 'label' => ''],
                    ['id' => 2, 'name' => '3 RELAXOIL®', 'price' => 189.99, 'oldPrice' => 209.97, 'save' => 19.98, 'label' => 'Pack Relaxation'],
                    ['id' => 3, 'name' => '5 RELAXOIL®', 'price' => 299.99, 'oldPrice' => 349.95, 'save' => 49.96, 'label' => 'Pack Zen']
                ]),
                'images' => json_encode(['/images/relaxoil.jpg', '/images/relaxoil-2.jpg', '/images/relaxoil-3.jpg']),
                'testimonials' => json_encode([
                    ['name' => 'Leila M.', 'rating' => 5, 'comment' => 'Parfait pour se détendre le soir, odeur très apaisante.'],
                    ['name' => 'Omar F.', 'rating' => 5, 'comment' => 'Excellent pour le stress, m\'aide beaucoup à dormir.'],
                    ['name' => 'Khadija L.', 'rating' => 4, 'comment' => 'Très bon produit relaxant, qualité premium.']
                ]),
            ]
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}







