<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Channel\UpdateRequest;
use App\Models\Channel;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ChannelController extends Controller
{
    public function edit(Channel $channel): Response
    {
        return Inertia::render('Channel/Edit', [
            'channel' => $channel,
        ]);
    }

    public function update(UpdateRequest $request, Channel $channel): RedirectResponse
    {
        if ($request->hasFile('image')) {
            $channel->clearMediaCollection('images');
            $channel->addMediaFromRequest('image')
                ->toMediaCollection('images');
        }
        $channel->update($request->validated());

        return redirect()->route('channel.edit', $channel);
    }

}
