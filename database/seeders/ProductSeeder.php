<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id', 'slug');

        $products = [
            // Processed & cured meats
            ['category' => 'processed-cured-meats', 'name' => 'Pork Tocino',         'price' => 185, 'description' => 'Sweet-cured pork slices. Ready to pan-fry. 500g pack.'],
            ['category' => 'processed-cured-meats', 'name' => 'Longganisa (Sweet)',   'price' => 160, 'description' => 'Sweet Filipino sausage links. 500g pack, approximately 10–12 pieces.'],
            ['category' => 'processed-cured-meats', 'name' => 'Hungarian Hotdog',     'price' => 140, 'description' => 'Classic smoked hotdog sausages. Great for snacks and viands. 500g pack.'],

            // Fresh meats
            ['category' => 'fresh-meats', 'name' => 'Pork Liempo (Belly)',   'price' => 280, 'description' => 'Thick-cut pork belly slices. Perfect for grilling or lechon kawali. 1kg pack.'],
            ['category' => 'fresh-meats', 'name' => 'Chicken Whole Leg',     'price' => 220, 'description' => 'Whole chicken legs, bone-in. Cleaned and ready to cook. 1kg pack (approx. 3–4 pcs).'],
            ['category' => 'fresh-meats', 'name' => 'Beef Kenchi (Shank)',   'price' => 380, 'description' => 'Bone-in beef shank, ideal for bulalo and nilaga. 1kg pack.'],

            // Seafood
            ['category' => 'seafood', 'name' => 'Boneless Bangus',         'price' => 260, 'description' => 'Deboned milkfish, cleaned and marinated. Ready for frying or grilling. 1 piece (~500g).'],
            ['category' => 'seafood', 'name' => 'Whole Squid (Pusit)',     'price' => 240, 'description' => 'Fresh whole squid, cleaned. 500g pack. Good for adobo or inihaw.'],
            ['category' => 'seafood', 'name' => 'Peeled Shrimp',           'price' => 320, 'description' => 'Pre-cleaned, deveined shrimp. 500g pack. Ready to cook straight from the freezer.'],

            // Ready-to-cook
            ['category' => 'ready-to-cook', 'name' => 'Pork Siomai (50pcs)',   'price' => 220, 'description' => 'Steamer-ready pork siomai dumplings. Comes with sauce. 50 pieces per pack.'],
            ['category' => 'ready-to-cook', 'name' => 'Chicken Nuggets',        'price' => 185, 'description' => 'Breaded chicken nuggets. Deep fry from frozen, ready in 8 minutes. 500g pack.'],
            ['category' => 'ready-to-cook', 'name' => 'Lumpiang Shanghai',      'price' => 195, 'description' => 'Classic crispy spring rolls with pork and vegetable filling. 30 pieces per pack.'],

            // Vegetables
            ['category' => 'vegetables', 'name' => 'Mixed Vegetables',     'price' => 95,  'description' => 'Blend of carrots, green beans, corn, and peas. 500g resealable bag.'],
            ['category' => 'vegetables', 'name' => 'Sweet Corn Kernels',   'price' => 85,  'description' => 'Cut sweet corn off the cob. Great for soups, salads, and side dishes. 500g pack.'],

            // Dairy & others
            ['category' => 'dairy-others', 'name' => 'All-Purpose Cream',  'price' => 75,  'description' => 'Chilled all-purpose cream, 250ml. Perfect for pasta, soups, and desserts.'],
            ['category' => 'dairy-others', 'name' => 'Cheddar Cheese Block','price' => 195, 'description' => 'Sharp cheddar cheese block, 250g. Ideal for sandwiches, pasta, and baking.'],
        ];

        foreach ($products as $data) {
            $categoryId = $categories[$data['category']] ?? null;
            if (!$categoryId) continue;

            Product::create([
                'category_id'  => $categoryId,
                'name'         => $data['name'],
                'slug'         => Str::slug($data['name']),
                'description'  => $data['description'],
                'price'        => $data['price'],
                'stock_qty'    => null, // unlimited
                'is_available' => true,
            ]);
        }
    }
}
