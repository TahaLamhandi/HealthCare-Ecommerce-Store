<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Product;


class Categorie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'subtitle', 'description', 'stats', 'features',
    ];

    protected $casts = [
        'features' => 'array',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'categorie_id');
    }
}