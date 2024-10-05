import { formatDuration, formatNumber } from '@/lib/format';
import type { VideoWithChannel } from '@/types/video';
import { Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import pluralize from 'pluralize';
dayjs.extend(relativeTime);

interface VideoCardProps {
  video: VideoWithChannel;
}

function VideoCard({ video }: VideoCardProps) {
  return (
    <>
      <Link href="#">
        <div className="group overflow-hidden rounded-lg flex flex-col gap-2">
          <div className="relative">
            <img
              src={video.thumbnail}
              alt="Video thumbnail"
              width={320}
              height={180}
              className="w-full aspect-video rounded-lg object-cover group-hover:opacity-80 transition-opacity"
            />
            <span className="absolute right-1 bottom-1 text-xs bg-gray-700/60 text-white px-1 py-0.5 rounded">
              {formatDuration(video.duration)}
            </span>
          </div>
          <div className="flex gap-2">
            <img
              src={video.channel.image_url}
              alt="Channel avatar"
              className="flex-none w-8 h-8 mt-2 rounded-full object-cover"
            />
            <div className="flex flex-col gap-1">
              <div
                className="text-base text-gray-900 font-semibold break-all line-clamp-2"
                title={video.title}
              >
                {video.title}
              </div>
              <div className="flex flex-col text-sm gap-1">
                <div
                  className="line-clamp-1"
                  title={video.channel.name}
                >
                  {video.channel.name}
                </div>
                <div>
                  {formatNumber(video.views) + pluralize(' view', video.views)}
                  <span className="inline-block mx-1">•</span>
                  {dayjs(video.created_at).fromNow()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default VideoCard;
