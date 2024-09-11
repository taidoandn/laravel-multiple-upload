<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Video\StoreFileRequest;
use App\Jobs\ConvertVideo;
use App\Models\Video;
use Illuminate\Http\UploadedFile;
use Pion\Laravel\ChunkUpload\Exceptions\UploadMissingFileException;
use Pion\Laravel\ChunkUpload\Handler\ContentRangeUploadHandler;
use Pion\Laravel\ChunkUpload\Receiver\FileReceiver;

class VideoFileController extends Controller
{
    public function store(StoreFileRequest $request, Video $video): void
    {
        $receiver = new FileReceiver(
            UploadedFile::fake()->createWithContent('file', $request->getContent()),
            $request,
            ContentRangeUploadHandler::class,
        );

        if ($receiver->isUploaded() === false) {
            throw new UploadMissingFileException;
        }

        $save = $receiver->receive();

        if ($save->isFinished()) {
            $this->storeFile($save->getFile(), $video);
        }

        $save->handler();
    }

    protected function storeFile(UploadedFile $file, Video $video)
    {
        $video->update([
            'video_path' => $file->store('videos', 'public'),
        ]);
    }
}
