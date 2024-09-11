<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Video\UpdateRequest;
use App\Models\Video;
use Illuminate\Http\RedirectResponse;

class VideoController extends Controller
{
    public function update(UpdateRequest $request, Video $video): RedirectResponse
    {
        $video->update($request->validated());
        return back();
    }

    public function destroy(Video $video): RedirectResponse
    {
        $video->delete();
        return back();
    }
}
