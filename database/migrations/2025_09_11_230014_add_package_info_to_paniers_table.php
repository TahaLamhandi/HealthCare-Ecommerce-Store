<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('paniers', function (Blueprint $table) {
            // Add package information columns
            $table->string('package')->default('Standard')->after('quantity');
            $table->unsignedBigInteger('package_id')->nullable()->after('package');
            $table->integer('package_quantity')->default(1)->after('package_id');
            $table->decimal('package_old_price', 10, 2)->nullable()->after('package_quantity');
            $table->decimal('package_save', 10, 2)->default(0)->after('package_old_price');
            $table->string('package_label')->nullable()->after('package_save');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paniers', function (Blueprint $table) {
            $table->dropColumn([
                'package',
                'package_id',
                'package_quantity',
                'package_old_price',
                'package_save',
                'package_label'
            ]);
        });
    }
};