<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run()
    {
        $suppliers = [
            [
                'name' => 'BioNature',
                'logo' => '/images/bionature.png',
                'description' => 'Laboratoire français spécialisé en cosmétiques bio depuis 1995',
            ],
            [
                'name' => 'NaturVital',
                'logo' => '/images/naturvital.png',
                'description' => 'Expert en compléments alimentaires naturels et biologiques',
            ],
            [
                'name' => 'EssencesPures',
                'logo' => '/images/essencespures.png',
                'description' => 'Producteur d\'huiles essentielles 100% pures et naturelles',
            ],
            [
                'name' => 'VitaForm',
                'logo' => '/images/vitaform.png',
                'description' => 'Spécialiste des solutions minceur et bien-être naturel',
            ],
            [
                'name' => 'BioCapillaire',
                'logo' => '/images/biocapillaire.png',
                'description' => 'Gamme complète de soins capillaires biologiques et naturels',
            ],
            [
                'name' => 'PhytoLab',
                'logo' => '/images/phylolab.png',
                'description' => 'Recherche et développement en phytothérapie moderne',
            ]
        ];

        foreach ($suppliers as $supplierData) {
            Supplier::create($supplierData);
        }
    }
}