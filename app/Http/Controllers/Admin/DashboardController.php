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
        $today         = now()->startOfDay();
        $yesterday     = now()->subDay()->startOfDay();
        $yesterdayEnd  = now()->subDay()->endOfDay();
        $weekStart     = now()->startOfWeek();
        $lastWeekStart = now()->subWeek()->startOfWeek();
        $lastWeekEnd   = now()->subWeek()->endOfWeek();

        // --- Order counts ---
        $ordersToday     = Order::where('created_at', '>=', $today)->count();
        $ordersYesterday = Order::whereBetween('created_at', [$yesterday, $yesterdayEnd])->count();
        $ordersWeek      = Order::where('created_at', '>=', $weekStart)->count();
        $ordersLastWeek  = Order::whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])->count();
        $pendingOrders   = Order::where('status', 'pending')->count();

        // --- Revenue (delivered only) ---
        $revenueToday = Order::with('items')
            ->where('status', 'delivered')
            ->where('created_at', '>=', $today)
            ->get()
            ->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee);

        $revenueYesterday = Order::with('items')
            ->where('status', 'delivered')
            ->whereBetween('created_at', [$yesterday, $yesterdayEnd])
            ->get()
            ->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee);

        $revenueWeek = Order::with('items')
            ->where('status', 'delivered')
            ->where('created_at', '>=', $weekStart)
            ->get()
            ->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee);

        $revenueLastWeek = Order::with('items')
            ->where('status', 'delivered')
            ->whereBetween('created_at', [$lastWeekStart, $lastWeekEnd])
            ->get()
            ->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee);

        // --- Recent orders ---
        $recentOrders = Order::with('items')
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn ($o) => array_merge($o->toArray(), ['total' => $o->total]));

        // --- Stock ---
        $lowStockProducts = Product::whereNotNull('stock_qty')
            ->where('stock_qty', '<=', 5)
            ->where('stock_qty', '>', 0)
            ->with('category')
            ->orderBy('stock_qty')
            ->get();

        $outOfStock = Product::where('stock_qty', 0)->count();

        // --- Config check ---
        $fbConfigured = Setting::get('fb_page_id') && Setting::get('fb_page_username');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'ordersToday'      => $ordersToday,
                'ordersYesterday'  => $ordersYesterday,
                'ordersWeek'       => $ordersWeek,
                'ordersLastWeek'   => $ordersLastWeek,
                'pendingOrders'    => $pendingOrders,
                'outOfStock'       => $outOfStock,
                'revenueToday'     => number_format($revenueToday, 2),
                'revenueYesterday' => number_format($revenueYesterday, 2),
                'revenueWeek'      => number_format($revenueWeek, 2),
                'revenueLastWeek'  => number_format($revenueLastWeek, 2),
            ],
            'recentOrders'     => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'fbConfigured'     => $fbConfigured,
        ]);
    }
}
