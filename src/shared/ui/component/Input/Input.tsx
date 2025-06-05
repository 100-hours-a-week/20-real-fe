import { InputHTMLAttributes, ReactNode, Ref } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Input({ className = '', type = 'text', label, error, icon, ref, ...props }: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={`
            w-full border border-gray-300 bg-white px-3 py-2
            ${icon ? 'pl-10' : 'pl-3'}
            text-base shadow-sm
            text-black
            placeholder:text-gray-400
            transition-all duration-200
            hover:border-gray-400
            focus:border-gray-400 focus:outline-none
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100
            ${error ? 'border-red-500 ring-2 ring-red-500/25' : ''}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
