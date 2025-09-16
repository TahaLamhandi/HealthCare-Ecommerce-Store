<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DATABASE CONNECTION INVESTIGATION ===\n\n";

// 1. Check Laravel's database configuration
echo "1. LARAVEL DATABASE CONFIG:\n";
echo "   Default connection: " . config('database.default') . "\n";
$defaultConfig = config('database.connections.' . config('database.default'));
echo "   Host: " . $defaultConfig['host'] . "\n";
echo "   Port: " . $defaultConfig['port'] . "\n";
echo "   Database: " . $defaultConfig['database'] . "\n";
echo "   Username: " . $defaultConfig['username'] . "\n";
echo "   Password: " . (empty($defaultConfig['password']) ? 'EMPTY' : 'SET') . "\n\n";

// 2. Check environment variables
echo "2. ENVIRONMENT VARIABLES:\n";
echo "   DB_CONNECTION: " . env('DB_CONNECTION', 'not set') . "\n";
echo "   DB_HOST: " . env('DB_HOST', 'not set') . "\n";
echo "   DB_PORT: " . env('DB_PORT', 'not set') . "\n";
echo "   DB_DATABASE: " . env('DB_DATABASE', 'not set') . "\n";
echo "   DB_USERNAME: " . env('DB_USERNAME', 'not set') . "\n";
echo "   DB_PASSWORD: " . (env('DB_PASSWORD') ? 'SET' : 'not set') . "\n\n";

// 3. Test direct PDO connection with same credentials
echo "3. DIRECT PDO CONNECTION TEST:\n";
try {
    $pdo = new PDO(
        "mysql:host={$defaultConfig['host']};port={$defaultConfig['port']};dbname={$defaultConfig['database']}", 
        $defaultConfig['username'], 
        $defaultConfig['password']
    );
    echo "   Direct PDO connection: SUCCESS\n";
    
    // Check users table
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "   Users count via PDO: " . $result['count'] . "\n";
    
    if ($result['count'] > 0) {
        $stmt = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 3");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "   Recent users via PDO:\n";
        foreach ($users as $user) {
            echo "     - ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}\n";
        }
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Direct PDO connection: FAILED - " . $e->getMessage() . "\n\n";
}

// 4. Check all available databases
echo "4. ALL AVAILABLE DATABASES:\n";
try {
    $pdo = new PDO(
        "mysql:host={$defaultConfig['host']};port={$defaultConfig['port']}", 
        $defaultConfig['username'], 
        $defaultConfig['password']
    );
    $stmt = $pdo->query("SHOW DATABASES");
    $databases = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($databases as $db) {
        echo "   - $db\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Error listing databases: " . $e->getMessage() . "\n\n";
}

// 5. Check if there are users in other databases
echo "5. CHECKING FOR USERS IN OTHER DATABASES:\n";
$databases_to_check = ['bioecleel', 'laravel', 'test', 'mysql', 'information_schema'];
foreach ($databases_to_check as $db) {
    try {
        $pdo = new PDO(
            "mysql:host={$defaultConfig['host']};port={$defaultConfig['port']};dbname=$db", 
            $defaultConfig['username'], 
            $defaultConfig['password']
        );
        $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        if (!empty($tables)) {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "   Database '$db': {$result['count']} users\n";
            
            if ($result['count'] > 0) {
                $stmt = $pdo->query("SELECT id, name, email FROM users ORDER BY id DESC LIMIT 2");
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($users as $user) {
                    echo "     - ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}\n";
                }
            }
        }
    } catch (Exception $e) {
        // Database doesn't exist or can't connect
    }
}

echo "\n=== INVESTIGATION COMPLETE ===\n";





