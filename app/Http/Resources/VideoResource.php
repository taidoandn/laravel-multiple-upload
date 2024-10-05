<?php
declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_url,
            'duration' => $this->duration,
            'video_path' => $this->video_path,
            'thumbnail' => $this->thumbnail,
            'processed' => $this->processed,
            'visibility' => $this->visibility,
            'views' => $this->views,
            'channel' => new ChannelResource($this->whenLoaded('channel')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
