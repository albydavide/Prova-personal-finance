interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative overflow-hidden rounded-full font-medium transition-all duration-475 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none';

  const variants = {
    primary: 'bg-[#3d3a4e] text-white hover:shadow-lg hover:shadow-purple-500/50',
    secondary: 'bg-slate-700 text-white hover:shadow-lg hover:shadow-slate-500/50',
    danger: 'bg-[#3d3a4e] text-white hover:shadow-lg hover:shadow-red-500/50',
    success: 'bg-[#3d3a4e] text-white hover:shadow-lg hover:shadow-green-500/50',
  };

  const sizes = {
    sm: 'h-10 px-6 text-sm',
    md: 'h-12 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
  };

  const gradients = {
    primary: 'linear-gradient(82.3deg, rgba(150, 93, 233, 1) 10.8%, rgba(99, 88, 238, 1) 94.3%)',
    secondary: 'linear-gradient(82.3deg, rgba(71, 85, 105, 1) 10.8%, rgba(51, 65, 85, 1) 94.3%)',
    danger: 'linear-gradient(82.3deg, rgba(239, 68, 68, 1) 10.8%, rgba(220, 38, 38, 1) 94.3%)',
    success: 'linear-gradient(82.3deg, rgba(34, 197, 94, 1) 10.8%, rgba(22, 163, 74, 1) 94.3%)',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} group`}
      {...props}
    >
      <span 
        className="absolute top-0 left-0 w-full h-full rounded-full transition-transform duration-[475ms] scale-x-0 origin-left group-hover:scale-x-100"
        style={{ background: gradients[variant] }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
