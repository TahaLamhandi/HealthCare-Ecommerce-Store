<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin user
        User::create([
            'name' => 'BioEcleel Admin',
            'email' => 'contact.bioekleel@gmail.com',
            'phone' => '0706706551',
            'address' => 'Admin Address',
            'password' => Hash::make('bioekleel203015'),
            'is_admin' => true,
        ]);

        // Regular user
        User::create([
            'name' => 'Taha Lamhandi',
            'email' => 'tahalamhandi11@gmail.com',
            'phone' => '0706706551',
            'address' => 'Zitoune , Meknes',
            'password' => Hash::make('Taha2004'),
        ]);
    }
}