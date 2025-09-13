<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Increment sales count for a product
     */
    public function incrementSales(Request $request, $id)
    {
        try {
            Log::info("Increment sales API called", [
                'product_id' => $id,
                'request_data' => $request->all(),
                'quantity' => $request->input('quantity', 1)
            ]);
            
            $product = Product::find($id);
            
            if (!$product) {
                Log::error("Product not found", ['product_id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            // Get quantity from request, default to 1
            $quantity = $request->input('quantity', 1);
            
            Log::info("Before increment", [
                'product_id' => $id,
                'current_sales_count' => $product->sales_count,
                'increment_by' => $quantity
            ]);
            
            // Increment sales count by the specified quantity
            $product->increment('sales_count', $quantity);
            
            // Refresh the model to get updated sales_count
            $product->refresh();
            
            Log::info("After increment", [
                'product_id' => $id,
                'new_sales_count' => $product->sales_count
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Sales count updated successfully',
                'sales_count' => $product->sales_count,
                'incremented_by' => $quantity
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error incrementing sales count: ' . $e->getMessage(), [
                'product_id' => $id,
                'request_data' => $request->all(),
                'error' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating sales count: ' . $e->getMessage()
            ], 500);
        }
    }
}