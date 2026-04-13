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
    public function index(): Response
    {
        $orders = Order::with('items')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($o) => array_merge($o->toArray(), ['total' => $o->total]));

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('items');

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
