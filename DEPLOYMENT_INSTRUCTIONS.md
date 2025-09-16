# BioEcleel Deployment Instructions

## 🚀 Complete Deployment Guide

### 1. Upload Files to Server
Upload your entire `BioEcleel` folder to `/home/u227262309/domains/hps-institute.net/public_html/`

### 2. Set Up .htaccess Files

#### Main .htaccess (in public_html directory):
```bash
cd /home/u227262309/domains/hps-institute.net/public_html
cat > .htaccess << 'EOF'
RewriteEngine On
RewriteBase /

# Handle static files first (CSS, JS, images, etc.)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]

# Handle directories
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Route everything else to Laravel
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ bioekleel/public/index.php [L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Cache Control for Static Assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
EOF
```

### 3. Create .env File
```bash
cd /home/u227262309/domains/hps-institute.net/public_html/bioekleel
cat > .env << 'EOF'
APP_NAME="BioEcleel Store"
APP_ENV=production
APP_KEY=base64:YourAppKeyHere123456789012345678901234567890=
APP_DEBUG=false
APP_URL=https://bioekleel.hps-institute.net

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u227262309_bioekleel
DB_USERNAME=u227262309_bioekleel
DB_PASSWORD=your_database_password_here

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
EOF
```

### 4. Run Deployment Commands
```bash
cd /home/u227262309/domains/hps-institute.net/public_html/bioekleel

# Generate application key
php artisan key:generate

# Set permissions
chmod -R 755 .
chmod -R 777 storage/
chmod -R 777 bootstrap/cache/

# Install dependencies
composer install --optimize-autoloader --no-dev
npm install

# Build frontend assets
npm run build

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force
```

### 5. Test Your Deployment
```bash
# Test the main page
curl https://bioekleel.hps-institute.net/

# Test API endpoints
curl https://bioekleel.hps-institute.net/api/test
curl https://bioekleel.hps-institute.net/api/slides
curl https://bioekleel.hps-institute.net/api/categories
curl https://bioekleel.hps-institute.net/api/products
```

## ✅ What This Fixes

1. **Proper .htaccess routing** - Routes all requests to Laravel
2. **Asset optimization** - Proper caching and compression
3. **Security headers** - Basic security improvements
4. **Production optimization** - Cached configs and routes
5. **Proper file permissions** - Laravel can write to storage and cache

## 🎨 Your React App Will Work Because:

1. **Vite build** creates optimized assets in `public/build/`
2. **Laravel Vite plugin** properly links CSS and JS files
3. **React Router** handles client-side navigation
4. **All components and styles** are bundled correctly

## 🔧 Important Notes

- Replace `your_database_password_here` with your actual database password
- Replace `your_email@gmail.com` and `your_app_password` with your email settings
- Make sure your database exists and has the correct tables
- The app will be accessible at `https://bioekleel.hps-institute.net/`

Your BioEcleel store should now work perfectly with all designs and styles! 🎉
