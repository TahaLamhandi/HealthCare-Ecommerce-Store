<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BannerRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your auth logic
    }

    public function rules()
    {
        return [
            'backgroundImage' => 'required|string|max:255',
            'product_id' => 'required|exists:products,id',
            'discount' => 'required|integer|min:1|max:100',
        ];
    }

    public function messages()
    {
        return [
            'product_id.exists' => 'The selected product does not exist.',
            'discount.min' => 'The discount must be at least 1%.',
            'backgroundImage.required' => 'The background image field is required.',
        ];
    }
}