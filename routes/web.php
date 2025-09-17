<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/products', function () {
    return Inertia::render('Products/Index');
});

Route::get('/produits', function () {
    return Inertia::render('Products/IndexFr');
});

Route::get('/categories', function () {
    return view('categories');
});

Route::get('/category/{name}', [CategoryController::class, 'show']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
