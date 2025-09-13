<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Product;


class Popup extends Model
{
    use HasFactory;

    protected $fillable = [
        'image', 'alt', 'isActive', 'product_id',
    ];

    protected $casts = [
        'isActive' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}