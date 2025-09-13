<?php

namespace Database\Seeders;

use App\Models\Panier;
use App\Models\User;
use Illuminate\Database\Seeder;

class PanierSeeder extends Seeder
{
    public function run()
    {
        $user = User::first(); // Ensure at least one user exists

        // Create individual panier entries for each product
        Panier::create([
            'user_id' => $user->id,
            'product_id' => 1,
            'quantity' => 2,
        ]);

        Panier::create([
            'user_id' => $user->id,
            'product_id' => 3,
            'quantity' => 1,
        ]);
    }
}