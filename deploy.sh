#!/bin/bash
cd /var/www/fgshop
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
