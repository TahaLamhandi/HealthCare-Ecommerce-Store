<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePromotionsTable extends Migration
{
   public function up()
{
    Schema::create('promotions', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('subtitle');
        $table->text('description');
        $table->string('backgroundImage');
        $table->unsignedBigInteger('product_id');
        $table->integer('discount');
        $table->timestamps();

        $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    });
}

    public function down()
    {
        Schema::dropIfExists('promotions');
    }
}
