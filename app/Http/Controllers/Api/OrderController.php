<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Command;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'telephone' => 'required|string|max:20',
                'adresse' => 'required|string|max:500',
                'total' => 'required|numeric|min:0',
                'livraison' => 'required|numeric|min:0',
                'sousTotal' => 'required|numeric|min:0',
                'produits' => 'required|array|min:1',
                'produits.*.nom' => 'required|string',
                'produits.*.prix' => 'required|numeric|min:0',
                'produits.*.quantite' => 'required|integer|min:1',
                'produits.*.total' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Find or create user
            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                // Create a new user for the order
                $user = User::create([
                    'name' => $request->nom,
                    'email' => $request->email,
                    'phone' => $request->telephone,
                    'address' => $request->adresse,
                    'password' => bcrypt('temp_password_' . time()), // Temporary password
                    'is_admin' => 0,
                ]);
            } else {
                // Update user information if needed
                $user->update([
                    'name' => $request->nom,
                    'phone' => $request->telephone,
                    'address' => $request->adresse,
                ]);
            }

            // Create the order
            $order = Command::create([
                'user_id' => $user->id,
                'total' => $request->total,
                'status' => 'pending',
                'address' => $request->adresse,
                'phone' => $request->telephone,
                'products' => $request->produits,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status' => 'required|string|in:pending,completed,cancelled'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $order = Command::findOrFail($id);
            $order->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'updated_at' => $order->updated_at
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
