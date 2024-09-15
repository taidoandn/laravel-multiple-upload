import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormErrors } from './FormErrors';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  errors?: string | string[];
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, errors, className, ...props }, ref) => (
    <div className="space-y-2">
      <div className="space-y-1">
        {label && (
          <Label
            htmlFor={id}
            className="block font-medium text-sm text-gray-700"
          >
            {label}
          </Label>
        )}
        <Input
          {...props}
          ref={ref}
          name={id}
          id={id}
          className={cn(className)}
        />
      </div>
      <FormErrors errors={errors} />
    </div>
  ),
);

FormInput.displayName = 'FormInput';
