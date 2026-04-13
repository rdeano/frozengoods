<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Order extends Model
{
    use LogsActivity;

    protected $fillable = [
        'customer_name', 'customer_phone', 'customer_address',
        'delivery_type', 'delivery_fee', 'notes', 'status',
    ];

    protected $casts = [
        'delivery_fee' => 'decimal:2',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnly(['status']);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getTotalAttribute(): string
    {
        return number_format(
            $this->items->sum('subtotal') + $this->delivery_fee,
            2
        );
    }
}
