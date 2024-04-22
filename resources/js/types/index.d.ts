export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  channel: Channel;
}

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
};
