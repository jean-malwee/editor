import React from 'react';
import { FlowCard } from './flow-card';
import { FlowMetadata } from '../services/flowStorage';
import { cn } from '../utils/cn';

export interface FlowListProps {
  flows: FlowMetadata[];
  viewMode: 'grid' | 'list';
  onEdit: (flowId: string) => void;
  onDuplicate: (flowId: string) => void;
  onDelete: (flowId: string) => void;
}

export const FlowList: React.FC<FlowListProps> = ({ flows, viewMode, onEdit, onDuplicate, onDelete }) => {
  const containerClass = cn(
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1 auto-fill-320'
      : 'flex flex-col gap-4 md:gap-3 sm:gap-2',
  );

  return (
    <div className={containerClass}>
      {flows.map((flow) => (
        <FlowCard
          key={flow.id}
          metadata={flow}
          viewMode={viewMode}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
