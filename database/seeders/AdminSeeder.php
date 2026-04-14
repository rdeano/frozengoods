<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@frozen.com'],
            [
                'name'     => 'Admin',
                'password' => bcrypt('password'),
            ]
        );

        $admin->assignRole($role);
    }
}
