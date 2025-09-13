<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PromotionRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your auth logic (e.g., only admins can create promotions)
    }

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'backgroundImage' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'discount' => 'required|integer|min:1|max:100',
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'The title field is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'discount.min' => 'The discount must be at least 1%.',
            'discount.max' => 'The discount cannot exceed 100%.',
        ];
    }
}