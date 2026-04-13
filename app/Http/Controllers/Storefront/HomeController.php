<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->withCount(['products' => fn ($q) => $q->where('is_available', true)])
            ->get();

        return Inertia::render('Storefront/Home', [
            'categories'   => $categories,
            'businessName' => Setting::get('business_name', 'Frozen Goods Store'),
        ]);
    }
}
