#!/bin/bash

# BioEcleel Deployment Script
echo "🚀 Starting BioEcleel deployment..."

# Set proper permissions
echo "📁 Setting permissions..."
chmod -R 755 .
chmod -R 777 storage/
chmod -R 777 bootstrap/cache/

# Install/Update dependencies
echo "📦 Installing dependencies..."
composer install --optimize-autoloader --no-dev
npm install

# Build frontend assets
echo "🎨 Building frontend assets..."
npm run build

# Clear Laravel caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (if needed)
echo "🗄️ Running database migrations..."
php artisan migrate --force

echo "✅ Deployment completed successfully!"
echo "🌐 Your BioEcleel store is now ready!"
