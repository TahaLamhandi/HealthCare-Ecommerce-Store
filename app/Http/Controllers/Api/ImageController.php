<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp', // No size limit
            'type' => 'required|in:main,additional,promotion,banner,slide'
        ]);

        try {
            $file = $request->file('image');
            $type = $request->input('type');
            
            // Generate unique filename
            $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
            
            // Store directly in public/images directory
            $file->move(public_path('images'), $filename);
            
            // Return the simple path
            $path = '/images/' . $filename;
            
            return response()->json([
                'success' => true,
                'url' => $path,
                'path' => $path,
                'filename' => $filename
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement de l\'image: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadMultiple(Request $request)
    {
        $request->validate([
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp' // No size limit
        ]);

        try {
            $uploadedImages = [];
            
            foreach ($request->file('images') as $file) {
                $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('images'), $filename);
                $path = '/images/' . $filename;
                
                $uploadedImages[] = [
                    'url' => $path,
                    'path' => $path,
                    'filename' => $filename
                ];
            }
            
            return response()->json([
                'success' => true,
                'images' => $uploadedImages
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du téléchargement des images: ' . $e->getMessage()
            ], 500);
        }
    }
}
