<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Storefront/Checkout', [
            'deliveryFee'    => (float) Setting::get('delivery_fee', 50),
            'allowDelivery'  => Setting::get('allow_delivery', 'true') === 'true',
            'allowPickup'    => Setting::get('allow_pickup', 'true') === 'true',
            'deliveryAreas'  => Setting::get('delivery_areas', ''),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Honeypot
        if ($request->filled('website')) {
            abort(422);
        }

        $data = $request->validate([
            'customer_name'    => ['required', 'string', 'max:255'],
            'customer_phone'   => ['required', 'string', 'max:50'],
            'customer_address' => ['required', 'string', 'max:1000'],
            'delivery_type'    => ['required', 'in:delivery,pickup'],
            'notes'            => ['nullable', 'string', 'max:1000'],
            'items'            => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.qty'        => ['required', 'integer', 'min:1'],
        ]);

        $deliveryFee = $data['delivery_type'] === 'delivery'
            ? (float) Setting::get('delivery_fee', 50)
            : 0;

        $order = Order::create([
            'customer_name'    => $data['customer_name'],
            'customer_phone'   => $data['customer_phone'],
            'customer_address' => $data['customer_address'],
            'delivery_type'    => $data['delivery_type'],
            'delivery_fee'     => $deliveryFee,
            'notes'            => $data['notes'] ?? null,
            'status'           => 'pending',
        ]);

        foreach ($data['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $subtotal = $product->price * $item['qty'];

            OrderItem::create([
                'order_id'     => $order->id,
                'product_id'   => $product->id,
                'product_name' => $product->name,
                'unit_price'   => $product->price,
                'qty'          => $item['qty'],
                'subtotal'     => $subtotal,
            ]);

            // Decrement stock if tracked
            if ($product->stock_qty !== null) {
                $product->decrement('stock_qty', $item['qty']);
                if ($product->stock_qty <= 0) {
                    $product->update(['is_available' => false]);
                }
            }
        }

        return redirect()->route('order.confirmation', $order);
    }
}
