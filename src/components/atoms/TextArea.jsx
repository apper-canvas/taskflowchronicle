import { forwardRef } from 'react';

const TextArea = forwardRef(({ 
  label, 
  error, 
  rows = 3,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          block w-full rounded-lg border-2 px-3 py-2 text-gray-900 placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200 resize-none
          ${error ? 'border-error focus:ring-error' : 'border-gray-200 focus:border-primary'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;