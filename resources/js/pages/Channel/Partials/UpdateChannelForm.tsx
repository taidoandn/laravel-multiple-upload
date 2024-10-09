import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import { Button } from '@/components/ui/button';
import { Channel } from '@/types/channel';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { CameraIcon } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface FormProps {
  name: string;
  description: string | null;
  image: File | undefined | null;
  _method: string;
}

interface Props {
  channel: Channel;
  className?: string;
}

export default function UpdateChannelForm({ channel, className = '' }: Props) {
  const [preview, setPreview] = useState('');
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm<FormProps>({
    _method: 'put',
    name: channel.name,
    description: channel.description || '',
    image: null,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('channel.update', channel.uuid), {
      forceFormData: true,
    });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setData('image', file);
  };

  useEffect(() => {
    return () => {
      preview && URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Channel Information</h2>

        <p className="mt-1 text-sm text-gray-600">Update your channel's information.</p>
      </header>

      <form
        onSubmit={submit}
        className="mt-6 space-y-6"
      >
        <div>
          <InputLabel
            htmlFor="image"
            value="Image"
          />
          <div className="flex items-center mt-1">
            <div className="shrink-0 group relative">
              <img
                src={preview || channel.image_url}
                className="shadow w-36 h-36 rounded-full object-cover"
                alt="Avatar"
              />
              <InputLabel
                htmlFor="file"
                className="absolute inset-0 hidden group-hover:flex items-center justify-center cursor-pointer"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 bg-opacity-60">
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                <TextInput
                  id="file"
                  type="file"
                  className="sr-only"
                  onChange={handleChangeImage}
                />
              </InputLabel>
            </div>
          </div>
          <InputError
            className="mt-2"
            message={errors.image}
          />
        </div>
        <div>
          <InputLabel
            htmlFor="name"
            value="Name"
          />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError
            className="mt-2"
            message={errors.name}
          />
        </div>

        <div>
          <InputLabel
            htmlFor="description"
            value="Description"
          />

          <TextInput
            id="description"
            className="mt-1 block w-full"
            value={data.description || ''}
            onChange={(e) => setData('description', e.target.value)}
          />

          <InputError
            className="mt-2"
            message={errors.description}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button disabled={processing}>Save</Button>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-gray-600">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
