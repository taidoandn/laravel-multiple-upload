export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  channel: Channel;
}

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
}

export interface Upload {
  id: number;
  title: string;
  file: File;
  description?: string;
  uploadProgress: number;
  uploading: boolean;
  paused: boolean;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
  csrf_token: string;
};
