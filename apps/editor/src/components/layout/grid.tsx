import React from 'react';
import { cn } from '../../utils/cn';

interface GridProps {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridGaps = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export const Grid: React.FC<GridProps> = ({
  cols = 3,
  gap = 'md',
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn('grid', gridCols[cols], gridGaps[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
};
