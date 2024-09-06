import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';
import { Upload } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

interface Props {
  upload: Upload;
  onCancelUpload?: (id: Upload['id']) => void;
}
export const UploadItem = ({ upload, onCancelUpload }: Props) => {
  const { data, setData, errors, processing, recentlySuccessful, patch } = useForm({
    title: upload.title,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    patch(route('videos.update', upload.id), { preserveScroll: true, preserveState: true });
  };

  return (
    <>
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
        <div className="flex space-x-6">
          <div className="max-w-[240px] w-full space-y-3">
            {upload.uploading && (
              <div>
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="bg-blue-600 text-xs font-medium text-blue-400 text-center p-0.5 leading-none rounded-full"
                      style={{
                        width: `${upload.uploadProgress || 0}%`,
                      }}
                    >
                      {upload.uploadProgress || 0}%
                    </div>
                  </div>
                  <div className="text-sm">Uploading</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => onCancelUpload?.(upload.id)}
                    className={cn('text-sm', 'font-medium')}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          <form
            className="flex-grow space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <InputLabel
                htmlFor={`title-${upload.id}`}
                value="Title"
              />

              <Input
                id={`title-${upload.id}`}
                type="text"
                name="title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className="mt-1 block w-full"
                placeholder="Title"
              />

              <InputError
                message={errors.title}
                className="mt-2"
              />
            </div>

            <div>
              <InputLabel
                htmlFor={`description-${upload.id}`}
                value="Description"
              />

              <Textarea
                id={`description-${upload.id}`}
                name="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="mt-1 block w-full"
                placeholder="Description"
              />

              <InputError
                message={errors.description}
                className="mt-2"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                className={cn({ 'opacity-25': processing })}
                type="submit"
                disabled={processing}
              >
                Save
              </Button>
              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-gray-600">Video updated.</p>
              </Transition>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
