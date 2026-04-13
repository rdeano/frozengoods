<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = now()->startOfDay();
        $weekStart = now()->startOfWeek();

        $ordersToday = Order::where('created_at', '>=', $today)->count();
        $ordersWeek  = Order::where('created_at', '>=', $weekStart)->count();
        $pendingOrders = Order::where('status', 'pending')->count();

        $lowStockProducts = Product::whereNotNull('stock_qty')
            ->where('stock_qty', '<=', 5)
            ->where('stock_qty', '>', 0)
            ->with('category')
            ->get();

        $outOfStock = Product::where('stock_qty', 0)->count();

        $fbConfigured = Setting::get('fb_page_id') && Setting::get('fb_page_username');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'ordersToday'  => $ordersToday,
                'ordersWeek'   => $ordersWeek,
                'pendingOrders' => $pendingOrders,
                'outOfStock'   => $outOfStock,
            ],
            'lowStockProducts' => $lowStockProducts,
            'fbConfigured'     => $fbConfigured,
        ]);
    }
}
