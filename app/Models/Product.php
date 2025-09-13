<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Promotion;
use App\Models\Panier;
use App\Models\Favorite;
use App\Models\Popup;
use App\Models\Categorie;
use App\Models\User;




class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'price', 'img', 'rating', 'reviews', 'isNew', 'discount', 'description', 'categorie_id',
        'long_description', 'images', 'brand', 'sku', 'stock_quantity', 'in_stock',
        'composition', 'usage_instructions', 'benefits', 'precautions',
        'packages', 'old_price', 'savings_amount',
        'medical_effects', 'target_conditions', 'clinical_study',
        'testimonials', 'total_sold', 'average_rating',
        'features', 'quality_guarantees',
        'meta_title', 'meta_description', 'tags'
    ];

    protected $casts = [
        'images' => 'array',
        'composition' => 'array',
        'packages' => 'array',
        'medical_effects' => 'array',
        'testimonials' => 'array',
        'features' => 'array',
        'quality_guarantees' => 'array',
        'tags' => 'array',
        'benefits' => 'array',
        'target_conditions' => 'array',
        'in_stock' => 'boolean',
        'isNew' => 'boolean',
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'average_rating' => 'decimal:2'
    ];

    public function promotions(): HasMany
    {
        return $this->hasMany(Promotion::class);
    }

    public function panier(): HasMany
    {
        return $this->hasMany(Panier::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(User::class, 'favorites', 'product_id', 'user_id')
                    ->withTimestamps();
    }
    public function popups(): HasMany
    {
        return $this->hasMany(Popup::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }
}