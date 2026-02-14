import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2';

  const variantClasses = {
    primary: 'bg-coffee-600 text-white hover:bg-coffee-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white text-coffee-600 border-2 border-coffee-100 hover:border-coffee-600 hover:bg-coffee-50 shadow-sm hover:shadow-md',
    outline: 'border-2 border-white text-white hover:bg-white/10',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} 
    ${fullWidth ? 'w-full' : ''} ${isLoading || disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <motion.button
      type={type}
      className={finalClasses}
      onClick={onClick}
      disabled={isLoading || disabled}
      whileHover={!(isLoading || disabled) ? { scale: 1.02 } : {}}
      whileTap={!(isLoading || disabled) ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader className="animate-spin" size={20} />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-4 top-3.5 text-gray-400">{icon}</div>}
        <input
          className={`input-field ${icon ? 'pl-10' : ''} ${error ? '!border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
}) => {
  return (
    <motion.div
      className={`card ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hoverable ? { y: -5, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' } : {}}
    >
      {children}
    </motion.div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'badge',
    success: 'badge bg-green-100 text-green-700',
    warning: 'badge bg-yellow-100 text-yellow-700',
    danger: 'badge bg-red-100 text-red-700',
  };

  return (
    <motion.span
      className={variantClasses[variant] + ' ' + className}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.span>
  );
};

interface LoaderProps {
  size?: number;
}

export const Spinner: React.FC<LoaderProps> = ({ size = 40 }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="inline-flex"
    >
      <Loader size={size} className="text-coffee-600" />
    </motion.div>
  );
};
