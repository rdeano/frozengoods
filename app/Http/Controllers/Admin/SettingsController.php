<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $keys = [
            'business_name', 'fb_page_username', 'fb_page_id',
            'delivery_fee', 'delivery_areas', 'allow_delivery', 'allow_pickup',
        ];

        $settings = [];
        foreach ($keys as $key) {
            $settings[$key] = Setting::get($key, '');
        }

        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'business_name'    => ['required', 'string', 'max:255'],
            'fb_page_username' => ['nullable', 'string', 'max:255'],
            'fb_page_id'       => ['nullable', 'string', 'max:50'],
            'delivery_fee'     => ['required', 'numeric', 'min:0'],
            'delivery_areas'   => ['nullable', 'string'],
            'allow_delivery'   => ['boolean'],
            'allow_pickup'     => ['boolean'],
        ]);

        foreach ($data as $key => $value) {
            if (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            }
            Setting::set($key, $value);
        }

        activity()->log('settings_updated');

        return back()->with('success', 'Settings saved.');
    }
}
