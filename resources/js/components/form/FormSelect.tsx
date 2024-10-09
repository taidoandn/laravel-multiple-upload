import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormErrors } from './FormErrors';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
interface FormSelectProps {
  id: string;
  value?: Option['value'];
  label?: string;
  options?: Option[];
  errors?: string | string[];
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const FormSelect = ({
  id,
  label,
  errors,
  placeholder,
  value,
  options = [],
  className,
  onChange,
}: FormSelectProps) => {
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
        <Select
          name={id}
          value={value}
          onValueChange={onChange}
        >
          <SelectTrigger
            id={id}
            className={cn('w-full', className)}
          >
            <SelectValue
              placeholder={placeholder}
              defaultValue={value}
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FormErrors errors={errors} />
    </div>
  );
};

FormSelect.displayName = 'FormSelect';
