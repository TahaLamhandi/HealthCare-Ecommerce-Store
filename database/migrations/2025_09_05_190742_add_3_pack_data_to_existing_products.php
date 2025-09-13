<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing products to have 3-pack data
        $products = Product::all();
        
        foreach ($products as $product) {
            $basePrice = floatval($product->price);
            $oldPrice = $product->old_price ? floatval($product->old_price) : null;
            
            // Create 3-pack structure
            $packages = [
                [
                    'id' => 1,
                    'name' => "1 {$product->name}",
                    'price' => $basePrice,
                    'oldPrice' => $oldPrice,
                    'save' => $oldPrice ? intval($oldPrice - $basePrice) : 0,
                    'label' => $product->isNew ? 'Nouveau' : ''
                ],
                [
                    'id' => 2,
                    'name' => "3 {$product->name}",
                    'price' => round($basePrice * 2.7, 2), // 10% discount for 3-pack
                    'oldPrice' => round($basePrice * 3, 2),
                    'save' => round($basePrice * 0.3, 2),
                    'label' => 'Meilleur Vente'
                ],
                [
                    'id' => 3,
                    'name' => "5 {$product->name}",
                    'price' => round($basePrice * 4.1, 2), // 18% discount for 5-pack
                    'oldPrice' => round($basePrice * 5, 2),
                    'save' => round($basePrice * 0.9, 2),
                    'label' => 'Pack économique'
                ]
            ];
            
            $product->packages = $packages;
            $product->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reset packages to null for all products
        Product::query()->update(['packages' => null]);
    }
};