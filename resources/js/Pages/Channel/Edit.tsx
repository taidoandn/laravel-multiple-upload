import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Channel } from '@/types/channel';
import { Head } from '@inertiajs/react';
import UpdateChannelForm from './Partials/UpdateChannelForm';

export default function Edit({ auth, channel }: PageProps<{ channel: Channel }>) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
    >
      <Head title="Channel" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <UpdateChannelForm
              channel={channel}
              className="max-w-xl"
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
