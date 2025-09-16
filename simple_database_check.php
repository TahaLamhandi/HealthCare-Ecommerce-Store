<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== SIMPLE DATABASE CHECK ===\n\n";

// 1. Check Laravel's connection
echo "1. LARAVEL CONNECTION:\n";
try {
    $connection = DB::connection();
    echo "   Database: " . $connection->getDatabaseName() . "\n";
    echo "   Driver: " . $connection->getDriverName() . "\n";
    echo "   Host: " . $connection->getConfig('host') . "\n";
    echo "   Port: " . $connection->getConfig('port') . "\n\n";
} catch (Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n\n";
}

// 2. Check if users table exists
echo "2. USERS TABLE CHECK:\n";
try {
    $tables = DB::select("SHOW TABLES LIKE 'users'");
    if (!empty($tables)) {
        echo "   Users table exists: YES\n";
        $userCount = DB::table('users')->count();
        echo "   Users count: $userCount\n";
        
        if ($userCount > 0) {
            $users = DB::table('users')->select('id', 'name', 'email', 'created_at')->orderBy('id', 'desc')->limit(3)->get();
            echo "   Recent users:\n";
            foreach ($users as $user) {
                echo "     - ID: {$user->id}, Name: {$user->name}, Email: {$user->email}\n";
            }
        }
    } else {
        echo "   Users table exists: NO\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n\n";
}

// 3. Check all tables in current database
echo "3. ALL TABLES IN CURRENT DATABASE:\n";
try {
    $tables = DB::select('SHOW TABLES');
    foreach ($tables as $table) {
        $tableName = array_values((array)$table)[0];
        echo "   - $tableName\n";
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n\n";
}

// 4. Check if there are any other tables with user data
echo "4. CHECKING FOR USER DATA IN OTHER TABLES:\n";
try {
    $tables = DB::select('SHOW TABLES');
    foreach ($tables as $table) {
        $tableName = array_values((array)$table)[0];
        
        // Check if table has name and email columns
        $columns = DB::select("SHOW COLUMNS FROM `$tableName`");
        $hasName = false;
        $hasEmail = false;
        foreach ($columns as $column) {
            if ($column->Field === 'name') $hasName = true;
            if ($column->Field === 'email') $hasEmail = true;
        }
        
        if ($hasName && $hasEmail) {
            $count = DB::table($tableName)->count();
            echo "   - $tableName: $count records (has name and email)\n";
            
            if ($count > 0) {
                $sample = DB::table($tableName)->select('id', 'name', 'email')->limit(2)->get();
                foreach ($sample as $record) {
                    echo "     Sample: ID: {$record->id}, Name: {$record->name}, Email: {$record->email}\n";
                }
            }
        }
    }
    echo "\n";
} catch (Exception $e) {
    echo "   Error: " . $e->getMessage() . "\n\n";
}

// 5. Test creating a user
echo "5. TESTING USER CREATION:\n";
try {
    $testUser = App\Models\User::create([
        'name' => 'Simple Test User',
        'email' => 'simpletest@example.com',
        'phone' => '0653561000',
        'address' => 'Simple Test Address',
        'password' => 'password123'
    ]);
    echo "   User created with ID: {$testUser->id}\n";
    
    // Check if it's in the users table
    $savedUser = DB::table('users')->where('id', $testUser->id)->first();
    if ($savedUser) {
        echo "   User found in users table: {$savedUser->name} ({$savedUser->email})\n";
    } else {
        echo "   ERROR: User not found in users table!\n";
    }
} catch (Exception $e) {
    echo "   Error creating user: " . $e->getMessage() . "\n";
}

echo "\n=== CHECK COMPLETE ===\n";





