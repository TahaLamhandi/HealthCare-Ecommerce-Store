<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SlideController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\PromotionsController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\FavoritesController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/user/update', [AuthController::class, 'updateProfile']);
    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update', [CartController::class, 'update']);
    Route::delete('/cart/remove', [CartController::class, 'remove']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    
    // Favorites routes
    Route::get('/favorites', [FavoritesController::class, 'index']);
    Route::post('/favorites/add', [FavoritesController::class, 'add']);
    Route::delete('/favorites/remove', [FavoritesController::class, 'remove']);
    Route::get('/favorites/check/{productId}', [FavoritesController::class, 'check']);
    
});

// Public API routes for homepage data
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Product sales increment (public route)
Route::post('/products/{id}/increment-sales', [ProductController::class, 'incrementSales']);

// Email routes (public routes)
Route::post('/email/order-confirmation', [App\Http\Controllers\Api\EmailController::class, 'sendOrderConfirmation']);
Route::post('/email/welcome', [App\Http\Controllers\Api\EmailController::class, 'sendWelcomeEmail']);

// Test email route (for development)
Route::get('/test-email', function() {
    try {
        $testOrderData = [
            'nom' => 'Test User',
            'email' => 'test@example.com',
            'telephone' => '0653561000',
            'adresse' => 'Test Address',
            'total' => 100.00,
            'livraison' => 25.00,
            'sousTotal' => 75.00,
            'produits' => [
                [
                    'nom' => 'Test Product',
                    'prix' => 50.00,
                    'quantite' => 1,
                    'total' => 50.00
                ]
            ],
            'date' => now()->format('d/m/Y H:i')
        ];
        
        \Mail::to('test@example.com')->send(new \App\Mail\OrderConfirmationMail($testOrderData));
        
        return response()->json(['message' => 'Test email sent successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Test individual endpoints
Route::get('/slides', function() {
    return response()->json(\App\Models\Slide::all());
});

Route::get('/categories', function() {
    return response()->json(\App\Models\Categorie::all());
});

Route::get('/products', function() {
    return response()->json(\App\Models\Product::with('category')->get());
});

Route::get('/banners', function() {
    return response()->json(\App\Models\Banner::with('product')->get());
});

Route::get('/promotions', [PromotionsController::class, 'index']);

Route::get('/suppliers', function() {
    return response()->json(\App\Models\Supplier::all());
});

// Newsletter subscription (public route)
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

// Image upload routes (temporarily public for testing)
Route::post('/upload/image', [ImageController::class, 'upload']);
Route::post('/upload/images', [ImageController::class, 'uploadMultiple']);

// Order creation (public route)
Route::post('/orders', [App\Http\Controllers\Api\OrderController::class, 'store']);

// Order status update (admin route)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::put('/orders/{id}/status', [App\Http\Controllers\Api\OrderController::class, 'updateStatus']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/orders', [AdminController::class, 'getOrders']);
    
    // Products management
    Route::get('/products', [AdminController::class, 'getProducts']);
    Route::post('/products', [AdminController::class, 'createProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);
    
    // Categories management
    Route::get('/categories', [AdminController::class, 'getCategories']);
    Route::post('/categories', [AdminController::class, 'createCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);
    
    // Promotions management
    Route::get('/promotions', [AdminController::class, 'getPromotions']);
    Route::post('/promotions', [AdminController::class, 'createPromotion']);
    Route::put('/promotions/{id}', [AdminController::class, 'updatePromotion']);
    Route::delete('/promotions/{id}', [AdminController::class, 'deletePromotion']);
    
    // Banners management
    Route::get('/banners', [AdminController::class, 'getBanners']);
    Route::post('/banners', [AdminController::class, 'createBanner']);
    Route::put('/banners/{id}', [AdminController::class, 'updateBanner']);
    Route::delete('/banners/{id}', [AdminController::class, 'deleteBanner']);
    
    // Slides management
    Route::get('/slides', [AdminController::class, 'getSlides']);
    Route::post('/slides', [AdminController::class, 'createSlide']);
    Route::put('/slides/{id}', [AdminController::class, 'updateSlide']);
    Route::delete('/slides/{id}', [AdminController::class, 'deleteSlide']);
    
    // Users management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
});

// Cart API endpoints - REMOVED: This was conflicting with the protected route

// REMOVED: These were conflicting with the protected routes in the middleware group
