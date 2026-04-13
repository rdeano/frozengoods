<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class OrderConfirmationController extends Controller
{
    public function __invoke(Order $order): Response
    {
        $order->load('items');

        return Inertia::render('Storefront/OrderConfirmation', [
            'order'           => array_merge($order->toArray(), ['total' => $order->total]),
            'fbPageUsername'  => Setting::get('fb_page_username', ''),
            'fbPageId'        => Setting::get('fb_page_id', ''),
        ]);
    }
}
