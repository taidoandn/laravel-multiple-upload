<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Visibility;
use App\Http\Resources\VideoResource;
use App\Models\Video;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $videos = Video::query()
            ->with('channel')
            ->where('visibility', Visibility::PUBLIC)
            ->where('processed', true)
            ->latest()
            ->paginate(8);
        return Inertia::render('Home', [
            'videos' => VideoResource::collection($videos),
        ]);
    }
}
