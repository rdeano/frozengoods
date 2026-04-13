<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Processed & cured meats', 'sort_order' => 1],
            ['name' => 'Fresh meats',             'sort_order' => 2],
            ['name' => 'Seafood',                 'sort_order' => 3],
            ['name' => 'Ready-to-cook',           'sort_order' => 4],
            ['name' => 'Vegetables',              'sort_order' => 5],
            ['name' => 'Dairy & others',          'sort_order' => 6],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name'       => $cat['name'],
                'slug'       => Str::slug($cat['name']),
                'sort_order' => $cat['sort_order'],
                'is_active'  => true,
            ]);
        }
    }
}
