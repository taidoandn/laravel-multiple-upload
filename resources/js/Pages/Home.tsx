import Pagination from '@/Components/Pagination';
import VideoList from '@/Components/video/VideoList';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { PageProps } from '@/types';
import { PaginationResponse } from '@/types/pagination';
import type { VideoWithChannel } from '@/types/video';
import { Head } from '@inertiajs/react';

export default function Home({
  auth,
  videos,
}: PageProps<{ videos: PaginationResponse<VideoWithChannel> }>) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}
    >
      <Head title="Home" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <VideoList videos={videos.data} />
            </div>
            <Pagination links={videos.meta.links} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
