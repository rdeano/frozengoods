# CLAUDE.md — Frozen Goods Online Storefront

## Related files

- See `DESIGN.md` for the full UI design system, color palette, typography scale,
  MUI v6 theme config, and component patterns. Always read it before writing any
  frontend code.

---

## Project Overview

A two-part web application for a frozen goods business to establish an online presence.
Customers browse products, build a cart, and submit an order. After checkout they are
shown a confirmation page where they contact the business via Facebook Messenger to
confirm payment and delivery — on mobile via an m.me deep link, on desktop via the
embedded FB Page chat widget. No payment gateway, no email, no API keys.

Built and deployed by Setoria (freelance dev agency). Hosted on DigitalOcean VPS (Ubuntu 24,
2vCPU, 4GB RAM) under Cloudflare DNS/SSL, same setup as other Setoria projects.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Backend | Laravel 13, PHP 8.3 |
| Frontend | React 18, Inertia.js v2 |
| UI Library | MUI v6 (Material UI) |
| Build tool | Vite 8 (use `--legacy-peer-deps` for npm installs) |
| Node | Node 20 |
| Auth | Laravel Breeze (admin only) |
| Database | MySQL 8 |
| Permissions | Spatie Laravel Permission |
| Activity log | Spatie Activity Log |
| Image storage | Local disk (v1), S3-ready |
| Hosting | DigitalOcean VPS (2vCPU, 4GB RAM), Ubuntu 24, Nginx, PHP 8.3-FPM |
| DNS / SSL | Cloudflare (DNS, SSL, DDoS protection — always apply `trustProxies` + `forceScheme('https')`) |
| Dev workflow | Git + GitHub, `deploy.sh` per project |
| Customer contact | m.me deep link (mobile) + FB Page chat widget (desktop) |

---

## Project Structure (two parts, one codebase)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/          # Admin-side controllers (guarded by auth)
│   │   └── Storefront/     # Public-side controllers (no auth)
│   └── Middleware/
├── Models/
resources/
├── js/
│   ├── Pages/
│   │   ├── Admin/          # Admin React pages
│   │   └── Storefront/     # Public React pages
│   └── Layouts/
│       ├── AdminLayout.jsx
│       └── StorefrontLayout.jsx
routes/
├── web.php                 # Storefront routes (public)
└── admin.php               # Admin routes (auth guarded)
```

---

## Database Schema

### Tables

```
categories
  - id, name, slug, sort_order, is_active, timestamps

products
  - id, category_id (FK), name, slug, description
  - price (decimal 10,2)
  - stock_qty (int, nullable — null = unlimited)
  - is_available (bool, default true)
  - image_path, timestamps, deleted_at (soft delete)

orders
  - id, customer_name, customer_phone, customer_address
  - delivery_type (enum: delivery, pickup)
  - delivery_fee (decimal 10,2, default 0)
  - notes
  - status (enum: pending, confirmed, out_for_delivery, delivered, cancelled)
  - timestamps

order_items
  - id, order_id (FK), product_id (FK)
  - product_name (string — snapshot at order time)
  - unit_price (decimal 10,2 — snapshot at order time, NOT linked live to products.price)
  - qty, subtotal, timestamps

settings
  - id, key (unique), value, timestamps
  - Keys: fb_page_username, fb_page_id, business_name,
          delivery_fee, delivery_areas, allow_delivery, allow_pickup
```

> **Important:** `order_items.unit_price` and `order_items.product_name` must always
> be copied from the product at the time of order creation. Never reference
> `products.price` for historical order display.

### Default Seed Data

Run via `DatabaseSeeder.php`. Categories are just DB rows — the owner can rename,
add, or remove them anytime from the admin panel. These are the defaults for a typical
Filipino frozen goods store.

```php
// database/seeders/CategorySeeder.php

$categories = [
    ['name' => 'Processed & cured meats', 'sort_order' => 1],
    // Tocino, longganisa, chorizo, corned beef, ham, bacon, hotdog, embutido

    ['name' => 'Fresh meats',             'sort_order' => 2],
    // Pork (liempo, kasim, pigue), chicken (whole/cuts/wings), beef (kenchi)

    ['name' => 'Seafood',                 'sort_order' => 3],
    // Bangus (boneless/marinated), tilapia, squid, shrimp, tahong, galunggong, tuna

    ['name' => 'Ready-to-cook',           'sort_order' => 4],
    // Marinated items, breaded products, nuggets, fish fillet, siomai, lumpia

    ['name' => 'Vegetables',              'sort_order' => 5],
    // Mixed veggies, corn, green peas, sitaw, kalabasa — pre-cut and frozen

    ['name' => 'Dairy & others',          'sort_order' => 6],
    // Butter, cheese, all-purpose cream
];

foreach ($categories as $cat) {
    Category::create([
        'name'       => $cat['name'],
        'slug'       => Str::slug($cat['name']),
        'sort_order' => $cat['sort_order'],
        'is_active'  => true,
    ]);
}
```

Also seed default settings:

```php
// database/seeders/SettingsSeeder.php

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
```

---

## Part 1 — Public Storefront

### Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero banner, featured categories |
| `/products` | Catalog | Grid, filter by category, search |
| `/products/{slug}` | Product detail | Photo, price, add to cart |
| `/cart` | Cart | Review items, adjust qty, running total |
| `/checkout` | Checkout form | Name, phone, address, delivery/pickup toggle, notes |
| `/order-confirmation/{order}` | Confirmation | Summary + hybrid Messenger contact |

### Cart

- Managed in React state + `localStorage` (no DB, no login needed)
- Cart is cleared after successful order submission

### Checkout Flow

1. Customer fills form and submits
2. Laravel validates, creates `order` + `order_items` rows
3. Redirect to `/order-confirmation/{order}`

No jobs, no email, no external API calls on checkout.

### Post-Checkout UX — Hybrid Messenger Contact

The confirmation page shows the order summary and detects the device to show the
right contact method:

**Mobile** — m.me deep link button that opens the Messenger app directly:

```jsx
const messengerUrl = `https://m.me/${fbPageUsername}?text=${encodeURIComponent(
  `Hi! I just placed Order #${order.id} on your website.`
)}`;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

return isMobile ? (
  <Button
    href={messengerUrl}
    variant="contained"
    sx={{ backgroundColor: '#1877F2' }}
    startIcon={<MessengerIcon />}
  >
    Message us on Messenger
  </Button>
) : (
  <Alert severity="info">
    Use the chat bubble at the bottom-right corner to message us on Messenger!
  </Alert>
);
```

**Desktop** — the FB Page chat widget is embedded in `StorefrontLayout.jsx` as a
floating bubble (bottom-right). On the confirmation page, show a prompt pointing to it.

### FB Page Chat Widget (Desktop)

Embed in `StorefrontLayout.jsx` so it appears on all public pages. Requires only the
numeric **FB Page ID** — no developer account, no token, no API approval needed.

```jsx
useEffect(() => {
  window.fbAsyncInit = function () {
    FB.init({ xfbml: true, version: 'v19.0' });
  };
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
  script.async = true;
  document.body.appendChild(script);
}, []);

// In JSX:
<>
  <div id="fb-root" />
  <div
    className="fb-customerchat"
    attribution="biz_inbox"
    page_id={fbPageId}
    theme_color="#1877F2"
    logged_out_greeting="Hi! How can we help you?"
    logged_in_greeting="Hi! Any questions about your order?"
  />
</>
```

> `fb_page_id` is the **numeric ID** (e.g. `123456789012345`), not the username.
> Find it in the FB Page's About section. No developer account needed.
> `fb_page_username` is the plain username (e.g. `frozengoodsph`) used only for the m.me link.
> These are two separate settings — both required.

### Abuse Protection

- Throttle checkout endpoint: `throttle:10,1` (10 requests per minute per IP)
- Honeypot field on checkout form (hidden input, reject if filled)

---

## Part 2 — Admin Panel

All routes under `/admin`, guarded by `auth` middleware + `role:admin` (Spatie).

### Pages

| Route | Page | Notes |
|---|---|---|
| `/admin` | Dashboard | Orders today/week, low stock alerts |
| `/admin/products` | Product list | Table with edit/archive actions |
| `/admin/products/create` | Add product | Form with image upload |
| `/admin/products/{id}/edit` | Edit product | Same form, prefilled |
| `/admin/categories` | Category list | Sortable, add/edit/delete |
| `/admin/orders` | Order log | List with status dropdown per row |
| `/admin/orders/{id}` | Order detail | Full breakdown, status update |
| `/admin/settings` | Settings | Business info, FB details, delivery options |
| `/admin/activity` | Activity log | Read-only, newest first |

### Order Statuses

`pending` → `confirmed` → `out_for_delivery` → `delivered`
Can also be set to `cancelled` from any state.

### Activity Log (Spatie)

Log key admin actions automatically using `spatie/laravel-activitylog`:
- Product created / updated / archived
- Order status changed
- Settings updated

```php
activity()->on($product)->log('archived');
activity()->on($order)->withProperties(['status' => $order->status])->log('status_changed');
```

### Low Stock Alerts

- Show warning badge on dashboard if any product has `stock_qty <= 5`
- Products with `stock_qty = 0` are auto-set to `is_available = false`

### Settings Page (configure before going live)

| Setting key | Description |
|---|---|
| `fb_page_username` | FB Page username — used for the m.me link (e.g. `frozengoodsph`) |
| `fb_page_id` | Numeric FB Page ID — used for the desktop chat widget |
| `business_name` | Shown in storefront header and page title |
| `delivery_fee` | Default delivery fee applied at checkout |
| `delivery_areas` | Text description of areas served |
| `allow_delivery` | Toggle delivery option on/off |
| `allow_pickup` | Toggle pickup option on/off |

Show a dashboard warning if `fb_page_username` or `fb_page_id` is not yet configured.

---

## Deployment

Follows Setoria standard VPS deployment pattern.

### Nginx config (subdomain pattern)

```nginx
server {
    listen 80;
    server_name frozenshop.clientdomain.com;
    root /var/www/frozenshop/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### .env notes

```dotenv
APP_ENV=production
APP_URL=https://frozenshop.clientdomain.com

DB_PASSWORD="use_quotes_if_special_chars"

# No background jobs in this project
QUEUE_CONNECTION=sync
```

### Cloudflare / HTTPS fix (apply to every new project)

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    if (config('app.env') === 'production') {
        \Illuminate\Support\Facades\URL::forceScheme('https');
        app('request')->server->set('HTTPS', 'on');
    }
}
```

Also set `TRUSTED_PROXIES=*` in `.env` and configure `TrustProxies` middleware.

### deploy.sh

```bash
#!/bin/bash
cd /var/www/frozenshop
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
npm ci --legacy-peer-deps
npm run build
sudo systemctl reload php8.3-fpm
sudo systemctl reload nginx
echo "Deploy done."
```

---

## Key Business Rules

- `unit_price` on order items is always the price at checkout — never live product price
- Products with `stock_qty = 0` are automatically marked unavailable
- Orders cannot be deleted — only cancelled (soft status change)
- Delivery fee from `settings` is applied per order, stored on `orders.delivery_fee`
- The chat widget requires the numeric `fb_page_id` — not the username
- The m.me link uses `fb_page_username` — not the numeric ID
- No queued jobs, no email, no external API calls — keep it simple

---

## v2 Ideas (out of scope for now)

- Customer-facing order tracking via link (no login)
- SMS notification to owner via Semaphore (PH-based, affordable)
- Telegram Bot as an owner notification channel
- Product variants (e.g. 500g vs 1kg pack)
- Scheduled delivery time slots
- Promo codes / discounts
- Export orders to CSV
- PWA / mobile install prompt
