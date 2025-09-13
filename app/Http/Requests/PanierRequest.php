<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PanierRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->id === $this->input('user_id'); // Only the user can modify their cart
    }

    public function rules()
    {
        return [
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function messages()
    {
        return [
            'user_id.exists' => 'The selected user does not exist.',
            'items.required' => 'At least one item is required.',
            'items.*.product_id.exists' => 'One or more products do not exist.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
        ];
    }
}