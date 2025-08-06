import React, { useState } from 'react';
import {
  CardBase as Card,
  ButtonBase as Button,
  TooltipBase as Tooltip,
  TooltipContentBase as TooltipContent,
  TooltipProviderBase as TooltipProvider,
  TooltipTriggerBase as TooltipTrigger,
  AlertDialogBase as AlertDialog,
  AlertDialogTriggerBase as AlertDialogTrigger,
  AlertDialogContentBase as AlertDialogContent,
  AlertDialogHeaderBase as AlertDialogHeader,
  AlertDialogTitleBase as AlertDialogTitle,
  AlertDialogDescriptionBase as AlertDialogDescription,
  AlertDialogFooterBase as AlertDialogFooter,
  AlertDialogActionBase as AlertDialogAction,
  AlertDialogCancelBase as AlertDialogCancel,
  SidebarMenuBadgeBase as Badge,
  toast,
} from '@mlw-packages/react-components';
import { PencilSimpleIcon, TrashIcon, CopyIcon, CalendarIcon, ClockIcon, TagIcon } from '@phosphor-icons/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FlowMetadata } from '../services/flowStorage';
import { cn } from '../utils/cn';

dayjs.extend(relativeTime);

export interface FlowCardProps {
  metadata: FlowMetadata;
  viewMode: 'grid' | 'list';
  onEdit: (flowId: string) => void;
  onDuplicate: (flowId: string) => void;
  onDelete: (flowId: string) => void;
}

export const FlowCard: React.FC<FlowCardProps> = ({ metadata, viewMode, onEdit, onDuplicate, onDelete }) => {
  const [loading, setLoading] = useState<{ duplicate: boolean; delete: boolean }>({
    duplicate: false,
    delete: false,
  });

  const handleEdit = () => {
    onEdit(metadata.id);
  };

  const handleDuplicate = async () => {
    try {
      setLoading((prev) => ({ ...prev, duplicate: true }));
      await onDuplicate(metadata.id);
    } catch {
      toast.error('Erro ao duplicar fluxo');
    } finally {
      setLoading((prev) => ({ ...prev, duplicate: false }));
    }
  };

  const handleDelete = async () => {
    try {
      setLoading((prev) => ({ ...prev, delete: true }));
      await onDelete(metadata.id);
    } catch {
      toast.error('Erro ao excluir fluxo');
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const formatDate = (date: Date | string) => {
    const dayJsDate = dayjs(date);
    return {
      absolute: dayJsDate.format('DD/MM/YYYY HH:mm'),
      relative: dayJsDate.fromNow(),
    };
  };

  const createdDate = formatDate(metadata.createdAt);
  const updatedDate = formatDate(metadata.updatedAt);

  const actions = [
    <TooltipProvider key="edit">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <PencilSimpleIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar fluxo</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
    <TooltipProvider key="duplicate">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" disabled={loading.duplicate} onClick={handleDuplicate}>
            <CopyIcon size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Duplicar fluxo</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
    <AlertDialog key="delete">
      <AlertDialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm">
                <TrashIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir fluxo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir fluxo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este fluxo? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading.delete}>
            Sim, excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>,
  ];

  const cardContent = (
    <>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-base font-semibold text-gray-800 flex-1 mr-3 m-0" title={metadata.name}>
          {metadata.name}
        </h4>
        <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:opacity-100">
          {actions}
        </div>
      </div>

      {metadata.description && (
        <p className="mb-4 text-gray-600 leading-snug text-ellipsis-2" title={metadata.description}>
          {metadata.description}
        </p>
      )}

      <div className="mt-auto">
        <div className={cn('flex gap-1 mb-2', viewMode === 'list' ? 'flex-row gap-4 mb-1' : 'flex-col gap-1 mb-2')}>
          <div className="flex items-center gap-1">
            <CalendarIcon size={14} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-gray-600">Criado {createdDate.relative}</span>
                </TooltipTrigger>
                <TooltipContent>{`Criado em ${createdDate.absolute}`}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-1">
            <ClockIcon size={14} />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-gray-600">Atualizado {updatedDate.relative}</span>
                </TooltipTrigger>
                <TooltipContent>{`Atualizado em ${updatedDate.absolute}`}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {metadata.tags && metadata.tags.length > 0 && (
          <div className={cn('mt-2', viewMode === 'list' && 'mt-0 ml-4')}>
            <div className="flex items-center gap-1 flex-wrap">
              <TagIcon size={14} className="text-gray-400" />
              {metadata.tags.slice(0, viewMode === 'grid' ? 3 : 5).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              {metadata.tags.length > (viewMode === 'grid' ? 3 : 5) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge>+{metadata.tags.length - (viewMode === 'grid' ? 3 : 5)}</Badge>
                    </TooltipTrigger>
                    <TooltipContent>{metadata.tags.slice(viewMode === 'grid' ? 3 : 5).join(', ')}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <Card
      className={cn(
        'rounded-lg border border-gray-200 transition-all duration-200 ease-in-out hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer h-fit group',
        viewMode === 'grid' ? 'min-h-[200px] p-4' : 'min-h-auto p-3',
        viewMode === 'list' && 'md:flex md:justify-between md:items-center',
      )}
      onClick={handleEdit}
    >
      {cardContent}
    </Card>
  );
};
