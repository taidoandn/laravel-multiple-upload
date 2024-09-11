<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Channel\StoreVideoRequest;
use App\Models\Channel;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class UploadVideoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Upload/Index');
    }

    public function store(StoreVideoRequest $request, Channel $channel): JsonResponse
    {
        $video = $channel->videos()->create($request->validated());
        return response()->json(['id' => $video->id]);
    }
}
