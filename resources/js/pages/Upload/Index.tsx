import Dropzone from '@/components/Dropzone';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import echo from '@/lib/echo';
import { PageProps } from '@/types';
import { Upload } from '@/types/upload';
import { Head, router } from '@inertiajs/react';
import { createUpload } from '@mux/upchunk';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UploadItem } from './Partials/UploadItem';

export default function Index({ auth, csrf_token }: PageProps) {
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    const channel = echo.private(`videos.user.${auth.user.id}`);
    channel
      .listen('ExportVideoThumbnail', (e: { video_id: number; thumbnail: string }) => {
        updateUpload(e.video_id, { thumbnail: e.thumbnail });
      })
      .listen('ConvertVideoStart', (e: { video_id: number }) => {
        updateUpload(e.video_id, { status: 'processing', uploadProgress: 0 });
      })
      .listen('ConvertVideoProgress', (e: { video_id: number; percentage: number }) => {
        const percentage = e.percentage;
        const videoId = e.video_id;
        if (percentage === 100) {
          updateUpload(videoId, { status: 'success', uploadProgress: percentage });
        } else {
          updateUpload(videoId, { uploadProgress: percentage });
        }
      });

    return () => {
      echo.leave(`videos.user.${auth.user.id}`);
    };
  }, [auth.user.id]);

  const handleDropFiles = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    const promises = acceptedFiles.map((file) => {
      return axios.post(route('channel.videos.store', auth.user.channel.uuid), {
        title: file.name,
      });
    });

    const newUploads: Upload[] = [];
    const responses = await Promise.allSettled(promises);
    responses.forEach((response, index) => {
      if (response.status === 'rejected') {
        toast.error(`Error uploading file: ${acceptedFiles[index].name}`, {
          description: response.reason.message,
        });
      } else {
        newUploads.push({
          id: response.value.data.id,
          title: acceptedFiles[index].name,
          file: startChunkedUpload(response.value.data.id, acceptedFiles[index]),
          uploadProgress: 0,
          status: 'idle',
        });
      }
    });

    setUploads((prevUploads) => [...newUploads, ...prevUploads]);
  };

  const updateUpload = (id: number, data: Omit<Partial<Upload>, 'id'>) => {
    setUploads((uploads) =>
      uploads.map((upload) => (upload.id === id ? { ...upload, ...data } : upload)),
    );
  };

  const startChunkedUpload = (id: number, file: File) => {
    const upload = createUpload({
      endpoint: route('videos.file.store', id),
      file,
      headers: { 'X-CSRF-TOKEN': csrf_token },
      method: 'POST',
      chunkSize: 10 * 1024,
    });

    upload.on('attempt', () => updateUpload(id, { status: 'uploading' }));
    upload.on('progress', (progress) =>
      updateUpload(id, { uploadProgress: progress.detail.toFixed(2) }),
    );
    upload.on('success', () => updateUpload(id, { status: 'idle', uploadProgress: 0 }));
    upload.on('error', (error) => {
      updateUpload(id, { status: 'error' });
      toast.error(error.detail.message);
    });
    return upload;
  };

  const onCancelUpload = (id: Upload['id']) => {
    const upload = uploads.find((upload) => upload.id === id);
    if (!upload) {
      return;
    }
    upload.file.abort();

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
                <Dropzone
                  maxSize={20 * 1024 * 1024}
                  accept={{ 'video/*': [] }}
                  onDrop={handleDropFiles}
                ></Dropzone>
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
