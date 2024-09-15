<?php
declare(strict_types=1);

namespace App\Jobs;

use App\Events\ExportVideoThumbnail;
use App\Models\Video;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use ProtoneMedia\LaravelFFMpeg\Filesystem\Media;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class CreateVideoThumbnail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Video $video)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        FFMpeg::fromDisk('public')
            ->open($this->video->video_path)
            ->getFrameFromSeconds(1)
            ->export()
            ->toDisk('public')
            ->afterSaving(function ($exporter, Media $media) {
                $path = $media->getPath();
                event(new ExportVideoThumbnail($this->video, Storage::url($path)));
                $this->video->update([
                    'thumbnail' => $path,
                ]);
            })
            ->save(sprintf('thumbs/%s.png', $this->video->uuid));
    }
}
