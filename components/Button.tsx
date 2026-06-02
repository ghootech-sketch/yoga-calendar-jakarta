import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-sage text-white hover:bg-brand-sagedark focus:ring-brand-sage shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-brand-beige text-brand-brown hover:bg-brand-sand/50 focus:ring-brand-brown shadow-none hover:shadow-sm hover:-translate-y-0.5',
    outline: 'border border-brand-sage/40 text-brand-sage hover:bg-brand-sage hover:text-white focus:ring-brand-sage hover:-translate-y-0.5',
    ghost: 'text-brand-brown/80 hover:bg-brand-beige/50 hover:text-brand-brown focus:ring-brand-beige',
    accent: 'bg-brand-brown text-brand-cream hover:bg-brand-charcoal focus:ring-brand-brown shadow-sm hover:shadow-md hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs font-semibold tracking-wider uppercase',
    md: 'px-6 py-3 text-sm tracking-wide',
    lg: 'px-8 py-4 text-base tracking-wide',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
