export interface Upload {
  id: number;
  title: string;
  file: File;
  description?: string;
  uploadProgress: number;
  uploading: boolean;
  processing: boolean;
  processProgress: number;
  thumbnail?: string;
  paused: boolean;
}
