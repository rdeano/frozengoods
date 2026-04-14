<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $range = $request->input('range', 'this_month');
        [$from, $to] = $this->dateRange($range, $request);

        // Delivered orders only — used for all revenue figures
        $delivered = Order::with('items')
            ->whereBetween('created_at', [$from, $to])
            ->where('status', 'delivered')
            ->orderBy('created_at')
            ->get();

        // All non-cancelled orders — used for order count and top-products qty
        $active = Order::with('items')
            ->whereBetween('created_at', [$from, $to])
            ->where('status', '!=', 'cancelled')
            ->orderBy('created_at')
            ->get();

        // --- Summary ---
        $totalRevenue   = $delivered->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee);
        $totalOrders    = $active->count();
        $avgOrderValue  = $delivered->count() > 0 ? $totalRevenue / $delivered->count() : 0;
        $totalItemsSold = $delivered->flatMap->items->sum('qty');

        // --- Orders by status (all statuses, including cancelled) ---
        $byStatus = Order::whereBetween('created_at', [$from, $to])
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        // --- Delivery vs pickup (delivered orders only) ---
        $byType = $delivered->groupBy('delivery_type')
            ->map(fn ($grp, $type) => [
                'type'    => $type,
                'count'   => $grp->count(),
                'revenue' => round($grp->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee), 2),
            ])
            ->values();

        // --- Top 10 products by qty sold (non-cancelled) ---
        $topProducts = $active->flatMap->items
            ->groupBy('product_name')
            ->map(fn ($items, $name) => [
                'product_name'  => $name,
                'total_qty'     => (int) $items->sum('qty'),
                'total_revenue' => round($items->sum('subtotal'), 2),
            ])
            ->sortByDesc('total_qty')
            ->values()
            ->take(10);

        // --- Revenue by day (delivered orders only) ---
        $dailyRevenue = $delivered
            ->groupBy(fn ($o) => $o->created_at->toDateString())
            ->map(fn ($grp, $date) => [
                'date'    => $date,
                'orders'  => $grp->count(),
                'revenue' => round($grp->sum(fn ($o) => $o->items->sum('subtotal') + $o->delivery_fee), 2),
            ])
            ->sortKeys()
            ->values();

        return Inertia::render('Admin/Reports', [
            'summary' => [
                'total_revenue'    => number_format($totalRevenue, 2),
                'total_orders'     => $totalOrders,
                'avg_order_value'  => number_format($avgOrderValue, 2),
                'total_items_sold' => $totalItemsSold,
            ],
            'by_status'     => $byStatus,
            'by_type'       => $byType,
            'top_products'  => $topProducts,
            'daily_revenue' => $dailyRevenue,
            'filters' => [
                'range' => $range,
                'from'  => $from->toDateString(),
                'to'    => $to->toDateString(),
            ],
        ]);
    }

    private function dateRange(string $range, Request $request): array
    {
        $now = now();

        return match ($range) {
            'today'      => [$now->copy()->startOfDay(),                  $now->copy()->endOfDay()],
            'this_week'  => [$now->copy()->startOfWeek(),                 $now->copy()->endOfWeek()],
            'last_week'  => [$now->copy()->subWeek()->startOfWeek(),      $now->copy()->subWeek()->endOfWeek()],
            'this_month' => [$now->copy()->startOfMonth(),                $now->copy()->endOfMonth()],
            'last_month' => [$now->copy()->subMonth()->startOfMonth(),    $now->copy()->subMonth()->endOfMonth()],
            'this_year'  => [$now->copy()->startOfYear(),                 $now->copy()->endOfYear()],
            'custom'     => [
                Carbon::parse($request->input('from', $now->copy()->startOfMonth()->toDateString()))->startOfDay(),
                Carbon::parse($request->input('to',   $now->toDateString()))->endOfDay(),
            ],
            default      => [$now->copy()->startOfMonth(),                $now->copy()->endOfMonth()],
        };
    }
}
