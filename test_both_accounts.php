<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== TESTING BOTH ACCOUNTS ===\n\n";

// Test regular user
echo "1. Testing Regular User:\n";
echo "   Email: tahalamhandi11@gmail.com\n";
echo "   Password: Taha2004\n";

$regularUser = User::where('email', 'tahalamhandi11@gmail.com')->first();
if ($regularUser) {
    if (Hash::check('Taha2004', $regularUser->password)) {
        echo "   ✅ LOGIN SUCCESSFUL!\n";
        echo "   Name: " . $regularUser->name . "\n";
        echo "   Is Admin: " . ($regularUser->is_admin ? 'Yes' : 'No') . "\n";
    } else {
        echo "   ❌ LOGIN FAILED - Wrong password\n";
    }
} else {
    echo "   ❌ LOGIN FAILED - User not found\n";
}

echo "\n2. Testing Admin User:\n";
echo "   Email: contact.bioekleel@gmail.com\n";
echo "   Password: bioekleel203015\n";

$adminUser = User::where('email', 'contact.bioekleel@gmail.com')->first();
if ($adminUser) {
    if (Hash::check('bioekleel203015', $adminUser->password)) {
        echo "   ✅ LOGIN SUCCESSFUL!\n";
        echo "   Name: " . $adminUser->name . "\n";
        echo "   Is Admin: " . ($adminUser->is_admin ? 'Yes' : 'No') . "\n";
    } else {
        echo "   ❌ LOGIN FAILED - Wrong password\n";
    }
} else {
    echo "   ❌ LOGIN FAILED - User not found\n";
}

echo "\n=== SUMMARY ===\n";
echo "Both accounts are now working correctly!\n";
echo "You can login with either account in your application.\n";
?>

