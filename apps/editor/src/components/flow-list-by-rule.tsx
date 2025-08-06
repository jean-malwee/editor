import React from 'react';
import { ButtonBase as Button, CardBase as Card, SidebarMenuBadgeBase as Badge } from '@mlw-packages/react-components';
import { PlayCircle } from '@phosphor-icons/react';
import { RuleFlow } from '@repo/schemas';
import { cn } from '../utils/cn';

interface FlowListByRuleProps {
  flows: RuleFlow[];
  onActivateFlow?: (flowId: string) => void;
  onEditFlow?: (flowId: string) => void;
  loading?: boolean;
}

export const FlowListByRule: React.FC<FlowListByRuleProps> = ({ flows, onActivateFlow, onEditFlow }) => {
  if (flows.length === 0) {
    return (
      <div className="text-center py-16 px-5 text-gray-600">
        <p className="text-base m-0">Nenhum fluxo configurado nesta regra</p>
      </div>
    );
  }

  const handleCardClick = (e: React.MouseEvent, flow: RuleFlow) => {
    // Evita o clique quando clicar no botão de ativar
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onEditFlow?.(flow.id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {flows.map((flow) => (
        <Card
          key={flow.id}
          className={cn(
            'h-full transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
            flow.active
              ? 'border-green-500 bg-green-50 hover:border-green-600'
              : 'border-gray-200 hover:border-gray-300',
          )}
          onClick={(e) => handleCardClick(e, flow)}
        >
          <div className="py-1">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <span
                className={cn('text-base flex-1 min-w-0 break-words', flow.active ? 'font-semibold' : 'font-normal')}
              >
                {flow.name}
              </span>
              {flow.active && (
                <Badge className="inline-flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                  <PlayCircle size={14} />
                  Ativo
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <span className="text-gray-600 text-sm">ID: {flow.id}</span>
              {!flow.active && <span className="text-gray-600 text-xs">Clique no card para editar</span>}
              {flow.active && <span className="text-gray-600 text-xs">Este é o fluxo ativo da regra</span>}
            </div>

            {!flow.active && (
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActivateFlow?.(flow.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <PlayCircle size={16} />
                  Ativar
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
