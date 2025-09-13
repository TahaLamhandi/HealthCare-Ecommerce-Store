<?php

namespace Database\Seeders;

use App\Models\Command;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommandeSeeder extends Seeder
{
    public function run()
    {
        $user = User::first();
        Command::create([
            'user_id' => $user->id,
            'total' => 500.00,
            'status' => 'completed',
            'address' => 'Meknes , Zitoune',
            'phone' => '0706706551',
            'products' => json_encode([
                ['product_id' => 1, 'quantity' => 2],
                ['product_id' => 2, 'quantity' => 1],
            ]),
        ]);
    }
}