<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoritesController extends Controller
{
    /**
     * Get user's favorite products
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $favorites = $user->favorites()->get();

        // Debug logging
        \Log::info('Favorites API called for user: ' . $user->id);
        \Log::info('Favorites count: ' . $favorites->count());
        \Log::info('Favorites data: ' . $favorites->toJson());

        return response()->json([
            'success' => true,
            'favorites' => $favorites
        ]);
    }

    /**
     * Add product to favorites
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        // Check if already in favorites
        if (!$user->favorites()->where('product_id', $productId)->exists()) {
            $user->favorites()->attach($productId);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product added to favorites successfully'
        ]);
    }

    /**
     * Remove product from favorites
     */
    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        $user->favorites()->detach($productId);

        return response()->json([
            'success' => true,
            'message' => 'Product removed from favorites successfully'
        ]);
    }

    /**
     * Check if product is in favorites
     */
    public function check(Request $request, $productId)
    {
        $user = $request->user();
        $isFavorite = $user->favorites()->where('product_id', $productId)->exists();

        return response()->json([
            'success' => true,
            'is_favorite' => $isFavorite
        ]);
    }
}

