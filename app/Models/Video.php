<?php
declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class Video extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'channel_id',
        'title',
        'description',
        'duration',
        'thumbnail',
        'video_path',
        'encoded',
    ];

    public function uniqueIds()
    {
        return ['uuid'];
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(Channel::class);
    }

    public function user(): HasOneThrough
    {
        return $this->hasOneThrough(User::class, Channel::class);
    }

}
