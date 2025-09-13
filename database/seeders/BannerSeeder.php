<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Product;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run()
    {
        // Get products to create banners for
        $products = Product::all();
        
        if ($products->isEmpty()) {
            return; // No products to create banners for
        }

        $banners = [
            [
                'backgroundImage' => '/images/banner-zitalgic.png',
                'product_id' => $products->where('name', 'like', '%Zitalgic%')->first()?->id ?? $products->first()->id,
                'discount' => 15,
            ],
            [
                'backgroundImage' => '/images/banner-serum.png',
                'product_id' => $products->where('name', 'like', '%Sérum%')->first()?->id ?? $products->skip(1)->first()?->id ?? $products->first()->id,
                'discount' => 25,
            ],
            [
                'backgroundImage' => '/images/banner-bruleur.png',
                'product_id' => $products->where('name', 'like', '%Brûleur%')->first()?->id ?? $products->skip(2)->first()?->id ?? $products->first()->id,
                'discount' => 30,
            ]
        ];

        foreach ($banners as $bannerData) {
            if ($bannerData['product_id']) {
                Banner::create($bannerData);
            }
        }
    }
}