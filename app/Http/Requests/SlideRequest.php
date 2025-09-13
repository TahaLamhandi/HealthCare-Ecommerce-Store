<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SlideRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust based on your auth logic
    }

    public function rules()
    {
        return [
            'image' => 'required|string|max:255',
            'alt' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'image.required' => 'The image field is required.',
            'alt.required' => 'The alt text field is required.',
        ];
    }
}