interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 ${className}`}
        {...props}
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-bold text-gray-800 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-gray-300 cursor-pointer ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
