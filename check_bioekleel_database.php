<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CHECKING bioekleel DATABASE ===\n\n";

try {
    // Connect to bioekleel database
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=bioekleel", 'root', '');
    echo "Connected to bioekleel database successfully\n\n";
    
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    if (!empty($tables)) {
        echo "Users table exists in bioekleel\n";
        
        // Count users
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Users count in bioekleel: " . $result['count'] . "\n\n";
        
        if ($result['count'] > 0) {
            $stmt = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY id DESC");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "All users in bioekleel:\n";
            foreach ($users as $user) {
                echo "ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}, Created: {$user['created_at']}\n";
            }
        }
    } else {
        echo "Users table does NOT exist in bioekleel\n";
    }
    
    // Show all tables in bioekleel
    echo "\nAll tables in bioekleel:\n";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $table) {
        echo "- $table\n";
    }
    
} catch (Exception $e) {
    echo "Error connecting to bioekleel: " . $e->getMessage() . "\n";
}

echo "\n=== COMPARISON ===\n";
echo "Laravel is using: bioecleel (with 'c')\n";
echo "You might be looking at: bioekleel (with 'k')\n";
echo "Make sure you're checking the correct database in phpMyAdmin!\n";



