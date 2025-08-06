import React from 'react';
import {
  CardBase,
  CardHeaderBase,
  CardTitleBase,
  CardDescriptionBase,
  CardContentBase,
  CardFooterBase,
  ButtonBase,
  DropDownMenuBase,
  DropDownMenuContentBase,
  DropDownMenuItemBase,
  DropDownMenuTriggerBase,
} from '@mlw-packages/react-components';
import { DotsThreeIcon, PauseIcon, PlayIcon, TrashIcon, UserIcon } from '@phosphor-icons/react';
import { Rule } from '@repo/schemas';
import { Badge } from './ui/badge';

interface RuleCardProps {
  rule: Rule;
  onEdit?: (rule: Rule) => void;
  onDelete?: (ruleId: string) => void;
  onViewDetails?: (ruleId: string) => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({ rule, onDelete, onViewDetails }) => {
  const activeFlow = rule.flows.find((flow) => flow.active);
  const totalFlows = rule.flows.length;

  return (
    <CardBase
      className="w-full cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
      onClick={() => onViewDetails?.(rule.id || rule.name)}
    >
      <CardHeaderBase>
        <div className="flex justify-between items-start">
          <CardTitleBase className="text-base font-semibold flex-1 mr-3 m-0">{rule.name}</CardTitleBase>
          <div className="flex gap-1 flex-shrink-0">
            <Badge className="flex items-center gap-1">
              <UserIcon />
              {totalFlows} fluxo{totalFlows !== 1 ? 's' : ''}
            </Badge>
            {activeFlow && (
              <Badge className="flex items-center gap-1 bg-green-500 text-white">
                <PlayIcon />
                Ativo
              </Badge>
            )}
            {!activeFlow && totalFlows > 0 && (
              <Badge className="flex items-center gap-1">
                <PauseIcon />
                Inativo
              </Badge>
            )}
          </div>
        </div>
        <CardDescriptionBase className="block leading-snug">{rule.description}</CardDescriptionBase>
      </CardHeaderBase>

      <CardContentBase>
        {activeFlow && (
          <div className="mt-2 p-2 border border-green-200 rounded">
            <span className="font-bold">Fluxo ativo: </span>
            <span>{activeFlow.name}</span>
          </div>
        )}

        {totalFlows === 0 && (
          <div className="mt-2 text-gray-600">
            <span>Nenhum fluxo configurado</span>
          </div>
        )}
      </CardContentBase>

      <CardFooterBase className="flex gap-2">
        <ButtonBase
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.(rule.id || rule.name);
          }}
        >
          Ver detalhes
        </ButtonBase>

        <DropDownMenuBase>
          <DropDownMenuTriggerBase asChild>
            <ButtonBase variant="ghost" onClick={(e) => e.stopPropagation()}>
              <DotsThreeIcon size={16} />
            </ButtonBase>
          </DropDownMenuTriggerBase>
          <DropDownMenuContentBase>
            <DropDownMenuItemBase
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(rule.id || rule.name);
              }}
              className="flex items-center gap-2 text-red-600"
            >
              <TrashIcon size={14} />
              Excluir regra
            </DropDownMenuItemBase>
          </DropDownMenuContentBase>
        </DropDownMenuBase>
      </CardFooterBase>
    </CardBase>
  );
};
