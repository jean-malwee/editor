import React from 'react';
import { Rule } from '@repo/schemas';
import { RuleCard } from './rule-card';

interface RuleListProps {
  rules: Rule[];
  loading?: boolean;
  error?: string;
  onEdit?: (rule: Rule) => void;
  onDelete?: (ruleName: string) => void;
  onViewDetails?: (ruleName: string) => void;
  onCreateRule?: () => void;
}

export const RuleList: React.FC<RuleListProps> = ({ rules, loading, error, onEdit, onDelete, onViewDetails }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5 gap-4">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-gray-600 text-sm">Carregando regras...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50 my-4">
        <div className="text-red-600 font-medium mb-1">Erro ao carregar regras</div>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full p-0">
      {/* Header com controles */}
      <div className="flex justify-between items-center mb-6 px-1 md:flex-row flex-col gap-4 md:gap-0">
        <h3 className="text-xl font-semibold m-0">Regras ({rules.length})</h3>
      </div>

      {/* Lista de regras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-0">
        {rules.map((rule) => (
          <RuleCard key={rule.name} rule={rule} onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
};
