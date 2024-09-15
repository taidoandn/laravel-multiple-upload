import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import echo from '@/lib/echo';
import { cn } from '@/lib/utils';
import { PageProps, Upload } from '@/types';
import { Head, router } from '@inertiajs/react';
import { createUpload, UpChunk } from '@mux/upchunk';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { UploadItem } from './Partials/UploadItem';

export default function Index({ auth, csrf_token }: PageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const uploadRefs = useRef<Record<number, UpChunk>>({});

  useEffect(() => {
    const channel = echo.private(`videos.user.${auth.user.id}`);
    channel
      .listen('ExportVideoThumbnail', (e: { video_id: number; thumbnail: string }) => {
        const videoId = e.video_id;
        const upload = uploads.find((upload) => upload.id === videoId);
        console.log(e);

        if (!upload) return;
        updateUpload(videoId, { thumbnail: e.thumbnail });
      })
      .listen('ConvertVideoStart', (e: { video_id: number }) => {
        const videoId = e.video_id;
        const upload = uploads.find((upload) => upload.id === videoId);
        if (!upload) return;
        updateUpload(videoId, { processing: true });
      })
      .listen('ConvertVideoProgress', (e: { video_id: number; percentage: number }) => {
        const videoId = e.video_id;
        const upload = uploads.find((upload) => upload.id === videoId);
        if (!upload) return;
        const data =
          e.percentage === 100
            ? { processing: false, processProgress: e.percentage }
            : { processProgress: e.percentage };
        updateUpload(videoId, data);
      });

    return () => {
      echo.leave(`videos.user.${auth.user.id}`);
    };
  });

  const handleDropFiles = async (uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newUploads = await Promise.all(
      Array.from(uploadedFiles).map(async (file) => {
        try {
          const response = await axios.post(route('channel.videos.store', auth.user.channel.uuid), {
            title: file.name,
          });
          const { id } = response.data;
          return {
            id,
            title: file.name,
            file,
            uploading: true,
            uploadProgress: 0,
            processing: false,
            processProgress: 0,
            paused: false,
          };
        } catch (error) {
          console.error('Error uploading file:', error);
          return null;
        }
      }),
    );

    const validUploads = newUploads.filter(Boolean) as Upload[];
    setUploads((prevUploads) => [...prevUploads, ...validUploads]);
    validUploads.forEach((upload) => startUpload(upload.id, upload.file));
  };

  const updateUpload = (id: number, data: Omit<Partial<Upload>, 'id'>) => {
    setUploads((uploads) =>
      uploads.map((upload) => (upload.id === id ? { ...upload, ...data } : upload)),
    );
  };

  const startUpload = (id: number, file: File) => {
    uploadRefs.current[id] = createUpload({
      endpoint: route('videos.file.store', id),
      file,
      headers: { 'X-CSRF-TOKEN': csrf_token },
      method: 'POST',
      chunkSize: 10 * 1024,
    });

    uploadRefs.current[id].on('attempt', () => updateUpload(id, { uploading: true }));
    uploadRefs.current[id].on('progress', (progress) =>
      updateUpload(id, { uploadProgress: progress.detail.toFixed(2) }),
    );
    uploadRefs.current[id].on('success', () => updateUpload(id, { uploading: false }));
    uploadRefs.current[id].on('error', (error) => console.log(error.detail.message));
  };

  const onCancelUpload = (id: Upload['id']) => {
    if (!uploadRefs.current[id]) {
      return;
    }
    uploadRefs.current[id].abort();
    delete uploadRefs.current[id];

    router.delete(route('videos.destroy', id), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setUploads(uploads.filter((upload) => upload.id !== id));
        toast.success('Video deleted successfully');
      },
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Upload</h2>}
    >
      <Head title="Upload" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form
                action=""
                className="p-6 text-gray-900"
              >
                <label
                  htmlFor="file"
                  className="flex items-center justify-center w-full h-44 bg-gray-100 border-2 border-dashed border-gray-200 text-gray-500 font-medium rounded-md"
                >
                  Drop or click here to upload files
                </label>
                <input
                  multiple
                  type="file"
                  id="file"
                  accept="video/*"
                  className={cn('sr-only', { 'bg-gray-200 border-gray-300': isDragging })}
                  onDragOver={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={(e) => {
                    e.currentTarget.value = '';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDropFiles(e.dataTransfer.files);
                    setIsDragging(false);
                  }}
                  onChange={(e) => {
                    handleDropFiles(e.target.files);
                  }}
                />
              </form>
            </div>
          </div>
          <div className="space-y-3">
            {uploads.map((upload) => (
              <UploadItem
                key={upload.id}
                upload={upload}
                onCancelUpload={onCancelUpload}
              />
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
