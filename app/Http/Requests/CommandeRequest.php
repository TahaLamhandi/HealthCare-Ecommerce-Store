<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommandeRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->id === $this->input('user_id'); // Only the user can create their own orders
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:pending,completed,cancelled',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'user_id.exists' => 'The selected user does not exist.',
            'products.required' => 'At least one product is required.',
            'products.*.product_id.exists' => 'One or more products do not exist.',
            'products.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}