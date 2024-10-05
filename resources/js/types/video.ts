import { Channel } from './channel';

export interface Video {
  id: string;
  uuid: string;
  title: string;
  description: string | null;
  image_url: string;
  duration: number;
  video_path: string;
  thumbnail: string;
  processed: boolean;
  visibility: Visibility;
  views: number;
  created_at: string;
  updated_at: string;
}

export type VideoWithChannel = Video & {
  channel: Channel;
};

type Visibility = 'public' | 'unlisted' | 'private';
