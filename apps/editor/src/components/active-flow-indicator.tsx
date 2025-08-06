import React from 'react';
import {
  SidebarMenuBadgeBase as Badge,
  TooltipBase as Tooltip,
  TooltipContentBase as TooltipContent,
  TooltipProviderBase as TooltipProvider,
  TooltipTriggerBase as TooltipTrigger,
} from '@mlw-packages/react-components';
import { PlayCircle, PauseCircle } from '@phosphor-icons/react';

interface ActiveFlowIndicatorProps {
  active: boolean;
  flowName?: string;
  showTooltip?: boolean;
}

export const ActiveFlowIndicator: React.FC<ActiveFlowIndicatorProps> = ({ active, flowName, showTooltip = true }) => {
  const activeTag = (
    <Badge
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#52c41a',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
      }}
    >
      <PlayCircle size={14} />
      {flowName ? `Ativo: ${flowName}` : 'Ativo'}
    </Badge>
  );

  const inactiveTag = (
    <Badge
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: '#d9d9d9',
        color: '#666',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
      }}
    >
      <PauseCircle size={14} />
      Inativo
    </Badge>
  );

  if (!showTooltip) {
    return active ? activeTag : inactiveTag;
  }

  if (active) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{activeTag}</TooltipTrigger>
          <TooltipContent>
            {flowName ? `O fluxo "${flowName}" está ativo nesta regra` : 'Esta regra tem um fluxo ativo'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{inactiveTag}</TooltipTrigger>
        <TooltipContent>Nenhum fluxo está ativo nesta regra</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
