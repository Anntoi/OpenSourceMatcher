<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('issue_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('issue_number');
            $table->string('title');
            $table->string('repository');
            $table->string('url', 500);
            $table->json('labels')->nullable();
            $table->string('difficulty')->default('all-levels');
            $table->timestamp('viewed_at')->useCurrent();

            // Composite unique: one view entry per user per issue
            $table->unique(['user_id', 'issue_number']);

            // Index for listing recent views
            $table->index(['user_id', 'viewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('issue_views');
    }
};
