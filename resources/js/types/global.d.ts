import { AxiosInstance } from 'axios';
import Pusher from 'pusher-js';
import ziggyRoute from 'ziggy-js';

declare global {
  interface Window {
    axios: AxiosInstance;
    Pusher: typeof Pusher;
  }

  const route: typeof ziggyRoute;
}
