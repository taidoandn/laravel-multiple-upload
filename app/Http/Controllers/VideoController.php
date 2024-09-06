<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Video\StoreRequest;
use App\Http\Requests\Video\UpdateRequest;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Upload/Index');
    }

    public function store(StoreRequest $request): JsonResponse
    {
        $video = $request->user()->videos()->create($request->validated());
        return response()->json(['id' => $video->id]);
    }

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
