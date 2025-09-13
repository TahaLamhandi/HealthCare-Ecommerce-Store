<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your auth logic
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:9999.99',
            'img' => 'required|string|max:255',
            'rating' => 'required|integer|min:0|max:5',
            'reviews' => 'required|integer|min:0',
            'isNew' => 'required|boolean',
            'discount' => 'nullable|integer|min:0|max:100',
            'description' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The name field is required.',
            'price.required' => 'The price field is required.',
            'rating.max' => 'The rating must be between 0 and 5.',
            'discount.max' => 'The discount cannot exceed 100%.',
        ];
    }
}