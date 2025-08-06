import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  variant?: 'default' | 'hoverable' | 'selected';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const cardVariants = {
  default: 'border border-gray-200 rounded-lg bg-white',
  hoverable:
    'border border-gray-200 rounded-lg bg-white transition-all duration-200 ease-in-out hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
  selected: 'border border-primary-500 rounded-lg bg-white shadow-lg',
};

const cardSizes = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  onClick,
  ...props
}) => {
  return (
    <div
      className={cn(cardVariants[variant], cardSizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
