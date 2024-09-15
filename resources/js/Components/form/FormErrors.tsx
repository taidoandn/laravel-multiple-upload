interface FormErrorsProps {
  errors?: string | string[];
}

export const FormErrors = ({ errors }: FormErrorsProps) => {
  const messages = typeof errors === 'string' ? [errors] : errors;

  if (!messages) {
    return null;
  }

  return (
    <>
      {messages.map((message) => (
        <p
          key={message}
          className="text-sm text-red-600"
        >
          {message}
        </p>
      ))}
    </>
  );
};
