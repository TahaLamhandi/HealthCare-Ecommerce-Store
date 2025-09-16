<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== COMPREHENSIVE DATABASE INVESTIGATION ===\n\n";

// 1. Check all database connections
echo "1. ALL DATABASE CONNECTIONS:\n";
$connections = config('database.connections');
foreach ($connections as $name => $config) {
    echo "   - $name: {$config['driver']}://{$config['host']}:{$config['port']}/{$config['database']}\n";
}
echo "\n";

// 2. Check which connection is default
echo "2. DEFAULT CONNECTION: " . config('database.default') . "\n\n";

// 3. Check environment variables
echo "3. ENVIRONMENT VARIABLES:\n";
echo "   - DB_CONNECTION: " . env('DB_CONNECTION', 'not set') . "\n";
echo "   - DB_HOST: " . env('DB_HOST', 'not set') . "\n";
echo "   - DB_PORT: " . env('DB_PORT', 'not set') . "\n";
echo "   - DB_DATABASE: " . env('DB_DATABASE', 'not set') . "\n";
echo "   - DB_USERNAME: " . env('DB_USERNAME', 'not set') . "\n\n";

// 4. Check all databases that might exist
echo "4. CHECKING ALL POSSIBLE DATABASES:\n";
try {
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306", 'root', '');
    $databases = $pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    echo "   Available databases:\n";
    foreach ($databases as $db) {
        echo "   - $db\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Error connecting to MySQL: " . $e->getMessage() . "\n\n";
}

// 5. Check each database for users tables
echo "5. CHECKING EACH DATABASE FOR USERS TABLES:\n";
$databases_to_check = ['bioecleel', 'laravel', 'test', 'mysql', 'information_schema', 'performance_schema'];
foreach ($databases_to_check as $db) {
    try {
        $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=$db", 'root', '');
        $tables = $pdo->query("SHOW TABLES LIKE 'users'")->fetchAll(PDO::FETCH_COLUMN);
        if (!empty($tables)) {
            echo "   - Database '$db' has users table\n";
            
            // Count users in this database
            $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            echo "     Users count: $count\n";
            
            if ($count > 0) {
                $users = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
                echo "     Recent users:\n";
                foreach ($users as $user) {
                    echo "       - ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}, Created: {$user['created_at']}\n";
                }
            }
            echo "\n";
        }
    } catch (Exception $e) {
        // Database doesn't exist or can't connect
    }
}

// 6. Check Laravel's actual connection
echo "6. LARAVEL'S ACTUAL CONNECTION:\n";
try {
    $connection = DB::connection();
    $databaseName = $connection->getDatabaseName();
    echo "   Connected to: $databaseName\n";
    
    // Check if users table exists
    $tables = $connection->select("SHOW TABLES LIKE 'users'");
    if (!empty($tables)) {
        echo "   Users table exists: YES\n";
        $userCount = $connection->table('users')->count();
        echo "   Users count: $userCount\n";
        
        if ($userCount > 0) {
            $users = $connection->table('users')->select('id', 'name', 'email', 'created_at')->orderBy('id', 'desc')->limit(5)->get();
            echo "   Recent users:\n";
            foreach ($users as $user) {
                echo "     - ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Created: {$user->created_at}\n";
            }
        }
    } else {
        echo "   Users table exists: NO\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Error with Laravel connection: " . $e->getMessage() . "\n\n";
}

// 7. Check User model configuration
echo "7. USER MODEL CONFIGURATION:\n";
$user = new App\Models\User();
echo "   Table name: " . $user->getTable() . "\n";
echo "   Connection: " . $user->getConnectionName() . "\n";
echo "   Database: " . $user->getConnection()->getDatabaseName() . "\n\n";

// 8. Test creating a user and see where it goes
echo "8. TESTING USER CREATION:\n";
try {
    $testUser = App\Models\User::create([
        'name' => 'Investigation Test User',
        'email' => 'investigation@example.com',
        'phone' => '0653561000',
        'address' => 'Investigation Test Address',
        'password' => 'password123'
    ]);
    echo "   User created with ID: {$testUser->id}\n";
    echo "   User table: " . $testUser->getTable() . "\n";
    echo "   User connection: " . $testUser->getConnectionName() . "\n";
    echo "   User database: " . $testUser->getConnection()->getDatabaseName() . "\n";
    
    // Verify it exists
    $savedUser = App\Models\User::find($testUser->id);
    if ($savedUser) {
        echo "   User verified in database: {$savedUser->name} ({$savedUser->email})\n";
    } else {
        echo "   ERROR: User not found after creation!\n";
    }
} catch (Exception $e) {
    echo "   Error creating user: " . $e->getMessage() . "\n";
}

echo "\n=== INVESTIGATION COMPLETE ===\n";





