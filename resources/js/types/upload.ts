import { UpChunk } from '@mux/upchunk';

export interface Upload {
  id: number;
  title: string;
  file: UpChunk;
  description?: string;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  uploadProgress: number;
  thumbnail?: string;
}
