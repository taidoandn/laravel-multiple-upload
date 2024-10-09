import { cn } from '@/lib/utils';
import pluralize from 'pluralize';
import { useCallback } from 'react';
import { DropzoneOptions, ErrorCode, FileRejection, useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface DropzoneProps extends DropzoneOptions {
  className?: string;
  children?: React.ReactNode;
  onDrop?: (acceptedFiles: File[]) => void;
  maxFiles?: number;
}

const Dropzone = ({ className, children, onDrop, maxFiles = 4, ...options }: DropzoneProps) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length) {
        const hasMaxFiles = fileRejections.some(({ errors }) =>
          errors.some((error) => error.code === ErrorCode.TooManyFiles),
        );
        if (hasMaxFiles) {
          toast.error(`You can only upload ${pluralize('file', maxFiles, true)} at a time.`);
          return;
        }
        fileRejections.forEach(({ file, errors }) => {
          toast.error(`Error file: ${file.name}`, {
            description: errors[0].message,
          });
        });
      }
      onDrop?.(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...options,
    maxFiles,
    onDrop: handleDrop,
  });

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
