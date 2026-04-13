<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityController extends Controller
{
    public function __invoke(): Response
    {
        $activities = Activity::with('causer')
            ->orderByDesc('created_at')
            ->paginate(50);

        return Inertia::render('Admin/Activity', [
            'activities' => $activities,
        ]);
    }
}
