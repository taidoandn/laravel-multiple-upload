import { Channel } from './channel';

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  channel: Channel;
}
