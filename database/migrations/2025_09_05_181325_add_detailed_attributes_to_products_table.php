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
        Schema::table('products', function (Blueprint $table) {
            // Product details
            $table->text('long_description')->nullable();
            $table->json('images')->nullable(); // Array of image URLs
            $table->string('brand')->nullable();
            $table->string('sku')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('in_stock')->default(true);
            
            // Product specifications
            $table->json('composition')->nullable(); // Array of ingredients
            $table->text('usage_instructions')->nullable();
            $table->text('benefits')->nullable();
            $table->text('precautions')->nullable();
            
            // Pricing and packages
            $table->json('packages')->nullable(); // Array of package options
            $table->decimal('old_price', 10, 2)->nullable();
            $table->integer('savings_amount')->nullable();
            
            // Medical information
            $table->json('medical_effects')->nullable(); // Timeline of effects
            $table->text('target_conditions')->nullable();
            $table->text('clinical_study')->nullable();
            
            // Reviews and ratings
            $table->json('testimonials')->nullable(); // Array of testimonials
            $table->integer('total_sold')->default(0);
            $table->decimal('average_rating', 3, 2)->default(0);
            
            // Features and badges
            $table->json('features')->nullable(); // Array of feature badges
            $table->json('quality_guarantees')->nullable();
            
            // SEO and marketing
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('tags')->nullable(); // Array of tags
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'long_description',
                'images',
                'brand',
                'sku',
                'stock_quantity',
                'in_stock',
                'composition',
                'usage_instructions',
                'benefits',
                'precautions',
                'packages',
                'old_price',
                'savings_amount',
                'medical_effects',
                'target_conditions',
                'clinical_study',
                'testimonials',
                'total_sold',
                'average_rating',
                'features',
                'quality_guarantees',
                'meta_title',
                'meta_description',
                'tags'
            ]);
        });
    }
};