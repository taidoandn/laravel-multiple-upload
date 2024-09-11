<?php
declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\Video;

class VideoPolicy
{
    /**
     * Determine whether the user can store video file.
     */
    public function storeFile(User $user, Video $video): bool
    {
        return $video->channel->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Video $video): bool
    {
        return $video->channel->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Video $video): bool
    {
        return $video->channel->user_id === $user->id;
    }
}
