<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        $products = Product::with('category')
            ->when(request('category'), fn ($q) => $q->whereHas(
                'category', fn ($q) => $q->where('slug', request('category'))
            ))
            ->when(request('search'), fn ($q) => $q->where('name', 'like', '%' . request('search') . '%'))
            ->where('is_available', true)
            ->orderBy('name')
            ->get()
            ->append('image_url');

        return Inertia::render('Storefront/Products', [
            'products'       => $products,
            'categories'     => $categories,
            'filters'        => request()->only('category', 'search'),
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->firstOrFail()
            ->append('image_url');

        return Inertia::render('Storefront/ProductDetail', [
            'product' => $product,
        ]);
    }
}
