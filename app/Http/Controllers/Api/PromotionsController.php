<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;

class PromotionsController extends Controller
{
    /**
     * Get all promotions
     */
    public function index()
    {
        try {
            \Log::info('Fetching promotions...');
            $promotions = Promotion::with('product')
                ->orderBy('created_at', 'desc')
                ->get();
            
            \Log::info('Found ' . $promotions->count() . ' promotions');
            return response()->json($promotions);
        } catch (\Exception $e) {
            \Log::error('Error fetching promotions: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching promotions: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific promotion
     */
    public function show($id)
    {
        try {
            $promotion = Promotion::with('product')->find($id);

            if (!$promotion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Promotion not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'promotion' => $promotion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching promotion: ' . $e->getMessage()
            ], 500);
        }
    }
}