import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-600 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
};

const badgeSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', size = 'sm', children, className, ...props }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border rounded-full',
        badgeVariants[variant],
        badgeSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
