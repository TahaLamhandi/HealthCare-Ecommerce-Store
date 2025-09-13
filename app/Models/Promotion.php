<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Product;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'subtitle', 'description', 'backgroundImage', 'product_id', 'discount',
        'price', 'oldPrice', 'category', 'image', 'img', 'is_active', 'start_date', 'end_date'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
