<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('paniers', function (Blueprint $table) {
            // Drop the items column
            $table->dropColumn('items');
            
            // Add product_id and quantity columns
            $table->unsignedBigInteger('product_id')->after('user_id');
            $table->integer('quantity')->default(1)->after('product_id');
            
            // Add foreign key constraint
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            // Add unique constraint to prevent duplicate entries
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('paniers', function (Blueprint $table) {
            // Drop foreign key and unique constraint
            $table->dropForeign(['product_id']);
            $table->dropUnique(['user_id', 'product_id']);
            
            // Drop the new columns
            $table->dropColumn(['product_id', 'quantity']);
            
            // Add back the items column
            $table->json('items')->nullable();
        });
    }
};
