<?php

namespace Database\Seeders;

use App\Models\Slide;
use Illuminate\Database\Seeder;

class SlideSeeder extends Seeder
{
    public function run()
    {
        $slides = [
            ['image' => '/images/slide1.png', 'alt' => 'BioEcleel - Votre bien-être naturel'],
            ['image' => '/images/slide2.png', 'alt' => 'Découvrez nos compléments alimentaires bio'],
            ['image' => '/images/slide3.png', 'alt' => 'Cosmétiques naturels pour votre beauté'],
            ['image' => '/images/slide4.png', 'alt' => 'Huiles essentielles pures et authentiques'],
            ['image' => '/images/slide5.png', 'alt' => 'Solutions minceur 100% naturelles']
        ];

        foreach ($slides as $slideData) {
            Slide::create($slideData);
        }
    }
}