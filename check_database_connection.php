<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== DATABASE CONNECTION CHECK ===\n\n";

// Check database connection
try {
    $connection = DB::connection();
    echo "1. Database Connection: " . $connection->getDatabaseName() . "\n";
    echo "2. Database Driver: " . $connection->getDriverName() . "\n";
    echo "3. Database Host: " . config('database.connections.mysql.host') . "\n";
    echo "4. Database Port: " . config('database.connections.mysql.port') . "\n";
    echo "5. Database Name: " . config('database.connections.mysql.database') . "\n\n";
} catch (Exception $e) {
    echo "Database connection error: " . $e->getMessage() . "\n";
    exit;
}

// Check if users table exists
try {
    $tables = DB::select('SHOW TABLES');
    echo "6. Available tables in database:\n";
    foreach ($tables as $table) {
        $tableName = array_values((array)$table)[0];
        echo "   - $tableName\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "Error listing tables: " . $e->getMessage() . "\n";
}

// Check users table structure
try {
    $columns = DB::select('DESCRIBE users');
    echo "7. Users table structure:\n";
    foreach ($columns as $column) {
        echo "   - {$column->Field} ({$column->Type})\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "Error describing users table: " . $e->getMessage() . "\n";
}

// Check current users
try {
    $userCount = DB::table('users')->count();
    echo "8. Current users count: $userCount\n";
    
    if ($userCount > 0) {
        $users = DB::table('users')->select('id', 'name', 'email', 'created_at')->get();
        echo "9. Users in database:\n";
        foreach ($users as $user) {
            echo "   - ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Created: {$user->created_at}\n";
        }
    }
    echo "\n";
} catch (Exception $e) {
    echo "Error checking users: " . $e->getMessage() . "\n";
}

// Test creating a user directly with DB::table
try {
    echo "10. Testing direct user creation with DB::table...\n";
    $userId = DB::table('users')->insertGetId([
        'name' => 'Direct DB Test User',
        'email' => 'directdb@example.com',
        'phone' => '0653561000',
        'address' => 'Direct DB Test Address',
        'password' => Hash::make('password123'),
        'created_at' => now(),
        'updated_at' => now()
    ]);
    echo "    User created with ID: $userId\n";
    
    // Verify it exists
    $user = DB::table('users')->where('id', $userId)->first();
    if ($user) {
        echo "    User verified in database: {$user->name} ({$user->email})\n";
    } else {
        echo "    ERROR: User not found after creation!\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "Error creating user with DB::table: " . $e->getMessage() . "\n";
}

// Test creating a user with Eloquent
try {
    echo "11. Testing user creation with Eloquent...\n";
    $user = App\Models\User::create([
        'name' => 'Eloquent Test User',
        'email' => 'eloquent@example.com',
        'phone' => '0653561000',
        'address' => 'Eloquent Test Address',
        'password' => 'password123'
    ]);
    echo "    User created with ID: {$user->id}\n";
    
    // Verify it exists
    $savedUser = App\Models\User::find($user->id);
    if ($savedUser) {
        echo "    User verified in database: {$savedUser->name} ({$savedUser->email})\n";
    } else {
        echo "    ERROR: User not found after creation!\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "Error creating user with Eloquent: " . $e->getMessage() . "\n";
}

echo "=== CHECK COMPLETE ===\n";



