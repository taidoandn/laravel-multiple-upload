import { VideoWithChannel } from '@/types/video';
import VideoCard from './VideoCard';

export interface VideoListProps {
  videos: VideoWithChannel[];
}

function VideoList({ videos }: VideoListProps) {
  if (videos.length === 0) {
    return <div className="text-center">No video found</div>;
  }
  return (
    <>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
        />
      ))}
    </>
  );
}

export default VideoList;
