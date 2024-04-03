<?php
declare(strict_types=1);

namespace App\Listeners;

use App\Models\User;
use Illuminate\Auth\Events\Registered;

class CreateUserChannel
{
    public function handle(Registered $event): void
    {
        $user = $event->user;
        /** @var User $user */
        $user->channel()->create([
            'name' => $user->name,
        ]);
    }
}
