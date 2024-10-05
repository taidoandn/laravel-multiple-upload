<?php
declare(strict_types=1);

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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('channel_id')->constrained()->cascadeOnDelete();
            $table->uuid()->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('duration')->unsigned()->default(0);
            $table->string('video_path')->nullable();
            $table->string('thumbnail')->nullable();
            $table->boolean('processed')->default(false);
            $table->boolean('allow_votes')->default(true);
            $table->boolean('allow_comments')->default(true);
            $table->enum('visibility', ['public', 'unlisted', 'private'])->default('private');
            $table->integer('views')->unsigned()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
