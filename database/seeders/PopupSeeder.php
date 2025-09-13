<?php

namespace Database\Seeders;

use App\Models\Popup;
use App\Models\Product;
use Illuminate\Database\Seeder;

class PopupSeeder extends Seeder
{
    public function run()
    {
        $product = Product::first();
        Popup::create([
            'image' => '/images/popup relaxoil.png',
            'alt' => 'Offre spéciale été',
            'isActive' => true,
            'product_id' => $product->id,
        ]);
    }
}