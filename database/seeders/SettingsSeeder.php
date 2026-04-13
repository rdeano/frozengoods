<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'business_name'    => 'Frozen Goods Store',
            'fb_page_username' => '',
            'fb_page_id'       => '',
            'delivery_fee'     => '50',
            'delivery_areas'   => 'Please contact us for delivery coverage.',
            'allow_delivery'   => 'true',
            'allow_pickup'     => 'true',
        ];

        foreach ($defaults as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
