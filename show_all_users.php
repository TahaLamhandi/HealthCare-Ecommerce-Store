<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== ALL USERS IN DATABASE ===\n\n";

try {
    $users = App\Models\User::all(['id', 'name', 'email', 'phone', 'address', 'created_at']);
    
    echo "Database: " . DB::connection()->getDatabaseName() . "\n";
    echo "Table: users\n";
    echo "Total users: " . $users->count() . "\n\n";
    
    if ($users->count() > 0) {
        echo "All users:\n";
        foreach ($users as $user) {
            echo "ID: {$user->id}\n";
            echo "Name: {$user->name}\n";
            echo "Email: {$user->email}\n";
            echo "Phone: {$user->phone}\n";
            echo "Address: {$user->address}\n";
            echo "Created: {$user->created_at}\n";
            echo "---\n";
        }
    } else {
        echo "No users found in database.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\n=== END ===\n";








