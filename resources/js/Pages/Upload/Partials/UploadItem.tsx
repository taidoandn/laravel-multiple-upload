import { FormInput } from '@/Components/form/FormInput';
import { FormSelect } from '@/Components/form/FormSelect';
import { FormTextarea } from '@/Components/form/FormTextarea';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Skeleton } from '@/Components/ui/skeleton';
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
    visibility: 'private',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    patch(route('videos.update', upload.id), { preserveScroll: true, preserveState: true });
  };

  return (
    <>
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
        <div className="flex space-x-6">
          <div className="max-w-[280px] w-full space-y-3">
            <div className="overflow-hidden rounded-md">
              {upload.thumbnail ? (
                <img
                  src={upload.thumbnail}
                  alt={upload.title}
                  className="h-auto w-auto object-cover aspect-video bg-center bg-cover bg-no-repeat"
                />
              ) : (
                <Skeleton className="h-auto w-auto aspect-video bg-muted" />
              )}
            </div>
            {(upload.uploading || upload.processing) && (
              <div className="space-y-1">
                <span className="text-gray-700">
                  {upload.uploading ? 'Uploading' : 'Processing'}:
                </span>
                <Progress
                  indicatorClassName={cn(upload.uploading ? 'bg-blue-500' : 'bg-green-500')}
                  value={upload.uploading ? upload.uploadProgress : upload.processProgress}
                />
              </div>
            )}

            {upload.uploading && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => onCancelUpload?.(upload.id)}
                  className={cn('text-sm', 'font-medium')}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <form
            className="flex-grow space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <FormInput
                id={`title-${upload.id}`}
                type="text"
                label="Title"
                placeholder="Title"
                className="mt-1 block w-full"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                errors={errors.title}
              />
            </div>

            <div>
              <FormTextarea
                id={`description-${upload.id}`}
                label="Description"
                placeholder="Description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                errors={errors.description}
              />
            </div>

            <div>
              <FormSelect
                id={`visibility-${upload.id}`}
                label="Visibility"
                options={[
                  { label: 'Private', value: 'private' },
                  { label: 'Unlisted', value: 'unlisted' },
                  { label: 'Public', value: 'public' },
                ]}
                placeholder="Visibility"
                value={data.visibility}
                onChange={(value) => setData('visibility', value)}
                errors={errors.visibility}
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
