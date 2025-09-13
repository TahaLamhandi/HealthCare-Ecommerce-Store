<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Categorie;
use App\Models\Product;

class CategoryController extends Controller
{
    public function show($identifier)
    {
        // Support matching by slug, name, or title
        $category = Categorie::where('slug', $identifier)
            ->orWhere('name', $identifier)
            ->orWhere('title', $identifier)
            ->first();

        if (!$category) {
            abort(404, 'Category not found');
        }

        // Fetch products for this category regardless of fk column name
        $products = Product::where(function($q) use ($category) {
                $q->where('categorie_id', $category->id)
                  ->orWhere('category_id', $category->id);
            })
            ->get();

        return view('category', compact('category', 'products'));
    }
}
