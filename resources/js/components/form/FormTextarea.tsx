import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { FormErrors } from './FormErrors';

interface FormTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  errors?: string | string[];
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ id, label, errors, className, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label && (
            <Label
              htmlFor={id}
              className="block font-medium text-sm text-gray-700"
            >
              {label}
            </Label>
          )}
          <Textarea
            {...props}
            ref={ref}
            name={id}
            id={id}
            className={cn(className)}
          />
        </div>
        <FormErrors errors={errors} />
      </div>
    );
  },
);

FormTextarea.displayName = 'FormTextarea';
