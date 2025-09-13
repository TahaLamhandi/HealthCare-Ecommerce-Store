<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {

        if (!Schema::hasTable('categories')) {
            throw new RuntimeException('Categories table must exist before creating products');
        }

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('categorie_id')->nullable();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->string('img');
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('reviews')->default(0);
            $table->boolean('isNew')->default(false);
            $table->integer('discount')->nullable();
            $table->text('description');
            $table->timestamps();
        });
        if (Schema::hasTable('categories')) {
            Schema::table('products', function (Blueprint $table) {
                $table->foreign('categorie_id')
                    ->references('id')
                    ->on('categories')
                    ->onDelete('set null');
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}