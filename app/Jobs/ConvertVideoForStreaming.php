<?php
declare(strict_types=1);

namespace App\Jobs;

use App\Events\ConvertVideoProgress;
use App\Events\ConvertVideoStart;
use App\Models\Video;
use FFMpeg\Format\Video\X264;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class ConvertVideoForStreaming implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 0;

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
        event(new ConvertVideoStart($this->video));

        $low = (new X264)->setKiloBitrate(250);
        $mid = (new X264)->setKiloBitrate(500);
        $high = (new X264)->setKiloBitrate(750);

        $uuid = $this->video->uuid;
        $path = sprintf('videos/%s/%s.m3u8', $uuid, $uuid);

        $media = FFMpeg::fromDisk('public')
            ->open($this->video->video_path);
        $durationInSeconds = $media->getDurationInSeconds(); // returns an int

        FFMpeg::fromDisk('public')
            ->open($this->video->video_path)
            ->exportForHLS()
            ->toDisk('public')
            ->addFormat($low)
            ->addFormat($mid)
            ->addFormat($high)
            ->onProgress(function ($percentage) {
                event(new ConvertVideoProgress($this->video, $percentage));
            })
            ->save($path);

        event(new ConvertVideoProgress($this->video, 100));
        Storage::disk('public')->delete($this->video->video_path);

        $this->video->update([
            'duration' => $durationInSeconds,
            'processed' => true,
            'video_path' => $path,
        ]);
    }
}
