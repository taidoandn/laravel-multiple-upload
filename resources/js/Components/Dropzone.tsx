import { cn } from '@/lib/utils';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

interface DropzoneProps extends DropzoneOptions {
  className?: string;
  children?: React.ReactNode;
}

const Dropzone = ({ className, children, ...options }: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone(options);

  return (
    <div
      {...getRootProps({
        className: cn(
          'flex items-center justify-center w-full h-40 bg-gray-100 border-2 border-dashed border-gray-200 text-gray-500 font-medium rounded-md',
          { 'bg-gray-200 border-gray-300': isDragActive },
          className,
        ),
      })}
    >
      <input {...getInputProps()} />
      <p>Drop or click here to upload files</p>
    </div>
  );
};

export default Dropzone;
