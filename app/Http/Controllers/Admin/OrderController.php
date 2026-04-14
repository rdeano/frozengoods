<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $status = $request->input('status', '');

        $orders = Order::with('items:id,order_id,product_name,qty')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('customer_name', 'like', "%{$search}%")
                       ->orWhere('id', is_numeric($search) ? $search : null);
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(fn ($o) => array_merge($o->toArray(), ['total' => $o->total]))
            ->withQueryString();

        $statusCounts = Order::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return Inertia::render('Admin/Orders/Index', [
            'orders'       => $orders,
            'filters'      => ['search' => $search, 'status' => $status],
            'statusCounts' => $statusCounts,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items', 'items.product' => fn ($q) => $q->withTrashed()->select('id', 'description')]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => array_merge($order->toArray(), ['total' => $order->total]),
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,out_for_delivery,delivered,cancelled'],
        ]);

        $order->update($data);

        activity()->on($order)->withProperties(['status' => $order->status])->log('status_changed');

        return back()->with('success', 'Order status updated.');
    }
}
