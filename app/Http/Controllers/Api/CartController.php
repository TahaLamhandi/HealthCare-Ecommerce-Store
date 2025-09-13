<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Panier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get user's cart items
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $cartItems = Panier::where('user_id', $user->id)
            ->with('product')
            ->get();

        return response()->json([
            'success' => true,
            'items' => $cartItems
        ]);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();
        $productId = $request->product_id;
        $quantity = $request->quantity;

        // Get package information from request
        $package = $request->input('package', 'Standard');
        $packageId = $request->input('package_id');
        $packageQuantity = $request->input('package_quantity', $quantity);
        $packageOldPrice = $request->input('package_old_price');
        $packageSave = $request->input('package_save', 0);
        $packageLabel = $request->input('package_label');
        $price = $request->input('price');

        // Check if item already exists in cart
        $existingItem = Panier::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingItem) {
            $existingItem->quantity += $quantity;
            // Update package information if provided
            $existingItem->package = $package;
            $existingItem->package_id = $packageId;
            $existingItem->package_quantity = $packageQuantity;
            $existingItem->package_old_price = $packageOldPrice;
            $existingItem->package_save = $packageSave;
            $existingItem->package_label = $packageLabel;
            $existingItem->price = $price;
            $existingItem->save();
        } else {
            Panier::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'package' => $package,
                'package_id' => $packageId,
                'package_quantity' => $packageQuantity,
                'package_old_price' => $packageOldPrice,
                'package_save' => $packageSave,
                'package_label' => $packageLabel,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart successfully'
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:0',
        ]);

        $user = $request->user();
        $productId = $request->product_id;
        $quantity = $request->quantity;

        $cartItem = Panier::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found'
            ], 404);
        }

        if ($quantity <= 0) {
            $cartItem->delete();
        } else {
            $cartItem->quantity = $quantity;
            $cartItem->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully'
        ]);
    }

    /**
     * Remove item from cart
     */
    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = $request->user();
        $productId = $request->product_id;

        Panier::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully'
        ]);
    }

    /**
     * Clear entire cart
     */
    public function clear(Request $request)
    {
        $user = $request->user();
        
        Panier::where('user_id', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully'
        ]);
    }
}

