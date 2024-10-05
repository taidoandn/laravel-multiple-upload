<?php
declare(strict_types=1);

use App\Http\Controllers\ChannelController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UploadVideoController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoFileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::group(['prefix' => 'channel', 'as' => 'channel.'], function () {
        Route::get('/{channel}/videos', [UploadVideoController::class, 'index'])->name('videos.upload');
        Route::post('/{channel}/videos', [UploadVideoController::class, 'store'])->name('videos.store');
        Route::get('/{channel}/edit', [ChannelController::class, 'edit'])->name('edit');
        Route::put('/{channel}', [ChannelController::class, 'update'])->name('update');
    });

    Route::delete('videos/{video}', [VideoController::class, 'destroy'])->name('videos.destroy');
    Route::patch('videos/{video}', [VideoController::class, 'update'])->name('videos.update');
    Route::post('videos/{video}/file', [VideoFileController::class, 'store'])
        ->name('videos.file.store');
});

require __DIR__ . '/auth.php';
