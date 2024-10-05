<?php
declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Visibility;
use App\Models\Channel;
use App\Models\Video;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class VideoFactory extends Factory
{
    protected $model = Video::class;

    public function definition(): array
    {
        return [
            'uuid' => $this->faker->uuid(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->text(),
            'duration' => $this->faker->randomNumber(),
            'video_path' => $this->faker->word(),
            'thumbnail' => '/thumbs/' . $this->faker->image('public/storage/thumbs', 400, 300, null, false),
            'processed' => $this->faker->boolean(),
            'allow_votes' => $this->faker->boolean(),
            'allow_comments' => $this->faker->boolean(),
            'visibility' => $this->faker->randomElement(array_column(Visibility::cases(), 'name')),
            'views' => $this->faker->numberBetween(1000, 100_000),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'channel_id' => Channel::factory(),
        ];
    }
}
