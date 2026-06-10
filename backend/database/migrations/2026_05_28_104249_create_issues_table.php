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
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->string('repository');
            $table->string('url');
            $table->json('labels')->nullable();
            $table->string('difficulty')->default('beginner');
            $table->timestamps();

            // Composite unique key: same issue number can exist in different repos
            $table->unique(['repository', 'number']);
            
            // Indexes for filtering performance
            $table->index('difficulty');
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('issues');
    }
};
