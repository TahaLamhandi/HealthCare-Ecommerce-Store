<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Categorie;
use App\Models\Promotion;
use App\Models\Banner;
use App\Models\Slide;
use App\Models\Command;
use App\Models\Panier;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('admin');
    }

    public function dashboard()
    {
        // Get current month and previous month for comparison
        $currentMonth = now()->format('Y-m');
        $previousMonth = now()->subMonth()->format('Y-m');
        
        // Get total orders and revenue for current month
        $currentMonthOrders = Command::whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->get();
        
        $previousMonthOrders = Command::whereYear('created_at', now()->subMonth()->year)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->get();
        
        // Calculate current month stats
        $currentMonthSales = $currentMonthOrders->count();
        $currentMonthRevenue = $currentMonthOrders->sum('total');
        
        // Calculate previous month stats
        $previousMonthSales = $previousMonthOrders->count();
        $previousMonthRevenue = $previousMonthOrders->sum('total');
        
        // Calculate growth percentage
        $salesGrowth = $previousMonthSales > 0 
            ? round((($currentMonthSales - $previousMonthSales) / $previousMonthSales) * 100, 1)
            : ($currentMonthSales > 0 ? 100 : 0);
        
        $revenueGrowth = $previousMonthRevenue > 0 
            ? round((($currentMonthRevenue - $previousMonthRevenue) / $previousMonthRevenue) * 100, 1)
            : ($currentMonthRevenue > 0 ? 100 : 0);
        
        // Calculate progress towards monthly goal (dynamic goal based on total orders)
        $totalOrders = Command::count();
        $monthlyGoal = max(50, min(200, $totalOrders + 20)); // Dynamic goal between 50-200
        $progressPercentage = min(round(($currentMonthSales / $monthlyGoal) * 100, 1), 100);
        
        // Get additional stats for better insights
        $totalRevenue = Command::sum('total');
        $averageOrderValue = $currentMonthSales > 0 ? round($currentMonthRevenue / $currentMonthSales, 2) : 0;
        
        // Get recent orders for the last 7 days
        $recentOrders = Command::where('created_at', '>=', now()->subDays(7))->count();
        
        // Get dashboard statistics
        $stats = [
            'total_products' => Product::count(),
            'total_categories' => Categorie::count(),
            'total_orders' => $totalOrders,
            'total_promotions' => Promotion::count(),
            'total_banners' => Banner::count(),
            'total_slides' => Slide::count(),
            'recent_orders' => Command::with('user')->latest()->take(5)->get(),
            'top_products' => Product::orderBy('sales_count', 'desc')->take(5)->get(),
            'sales_data' => [
                'current_month_sales' => $currentMonthSales,
                'current_month_revenue' => round($currentMonthRevenue, 2),
                'sales_growth' => $salesGrowth,
                'revenue_growth' => $revenueGrowth,
                'progress_percentage' => $progressPercentage,
                'monthly_goal' => $monthlyGoal,
                'total_revenue' => round($totalRevenue, 2),
                'average_order_value' => $averageOrderValue,
                'recent_orders_7days' => $recentOrders,
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    public function getOrders(Request $request)
    {
        $query = Command::with('user');

        // Apply filters
        if ($request->has('phone')) {
            $query->where('phone', 'like', '%' . $request->phone . '%');
        }

        if ($request->has('min_price')) {
            $query->where('total', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('total', '<=', $request->max_price);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('category')) {
            $query->whereHas('products', function($q) use ($request) {
                $q->whereHas('category', function($cat) use ($request) {
                    $cat->where('title', 'like', '%' . $request->category . '%');
                });
            });
        }

        $orders = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    public function getProducts()
    {
        $products = Product::with('category')->get();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function createProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'img' => 'required|string',
        ]);

        $product = Product::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ]);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'img' => 'required|string',
        ]);

        $product->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function getCategories()
    {
        $categories = Categorie::all();
        
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $category = Categorie::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ]);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Categorie::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    public function deleteCategory($id)
    {
        $category = Categorie::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }

    public function getPromotions()
    {
        $promotions = Promotion::with('product')->get();
        
        return response()->json([
            'success' => true,
            'data' => $promotions
        ]);
    }

    public function createPromotion(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'backgroundImage' => 'required|string',
            'product_id' => 'required|exists:products,id',
            'discount' => 'required|numeric|min:0|max:100',
        ]);

        $promotion = Promotion::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Promotion created successfully',
            'data' => $promotion
        ]);
    }

    public function updatePromotion(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:255',
            'description' => 'required|string',
            'backgroundImage' => 'required|string',
            'product_id' => 'required|exists:products,id',
            'discount' => 'required|numeric|min:0|max:100',
        ]);

        $promotion->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Promotion updated successfully',
            'data' => $promotion
        ]);
    }

    public function deletePromotion($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();

        return response()->json([
            'success' => true,
            'message' => 'Promotion deleted successfully'
        ]);
    }

    public function getBanners()
    {
        $banners = Banner::with('product')->get();
        
        return response()->json([
            'success' => true,
            'data' => $banners
        ]);
    }

    public function createBanner(Request $request)
    {
        $request->validate([
            'backgroundImage' => 'required|string',
            'product_id' => 'required|exists:products,id',
            'discount' => 'required|numeric|min:0|max:100',
        ]);

        $banner = Banner::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Banner created successfully',
            'data' => $banner
        ]);
    }

    public function updateBanner(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'backgroundImage' => 'required|string',
            'product_id' => 'required|exists:products,id',
            'discount' => 'required|numeric|min:0|max:100',
        ]);

        $banner->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Banner updated successfully',
            'data' => $banner
        ]);
    }

    public function deleteBanner($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return response()->json([
            'success' => true,
            'message' => 'Banner deleted successfully'
        ]);
    }

    public function getSlides()
    {
        $slides = Slide::all();
        
        return response()->json([
            'success' => true,
            'data' => $slides
        ]);
    }

    public function createSlide(Request $request)
    {
        $request->validate([
            'image' => 'required|string',
            'alt' => 'required|string|max:255',
        ]);

        $slide = Slide::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Slide created successfully',
            'data' => $slide
        ]);
    }

    public function updateSlide(Request $request, $id)
    {
        $slide = Slide::findOrFail($id);

        $request->validate([
            'image' => 'required|string',
            'alt' => 'required|string|max:255',
        ]);

        $slide->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Slide updated successfully',
            'data' => $slide
        ]);
    }

    public function deleteSlide($id)
    {
        $slide = Slide::findOrFail($id);
        $slide->delete();

        return response()->json([
            'success' => true,
            'message' => 'Slide deleted successfully'
        ]);
    }

    public function getUsers()
    {
        // Get all users except admin (assuming admin has email 'admin@bioecleel.com')
        $users = User::where('email', '!=', 'admin@bioecleel.com')->get();
        
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting admin user
        if ($user->email === 'admin@bioecleel.com') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete admin user'
            ], 403);
        }
        
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}