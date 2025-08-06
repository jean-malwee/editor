import React, { useState, useEffect, useCallback } from 'react';
import {
  ButtonBase,
  InputBase,
  SelectBase,
  SelectTriggerBase,
  SelectValueBase,
  SelectContentBase,
  SelectItemBase,
  useTheme,
} from '@mlw-packages/react-components';
import { PlusIcon, MagnifyingGlassIcon, GridFourIcon, ListIcon, SunIcon, MoonIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/page-header';
import { RuleList } from '../components/rule-list';
import { RuleCreationModal } from '../components/rule-creation-modal';
import { Rule } from '@repo/schemas';
import { Stack } from '../components/stack';
import { displayError } from '../helpers/error-message';
import { useRules, useDeleteRule } from '../hooks/useRules';

type SortField = 'name' | 'flowCount';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // React Query hooks para regras
  const { data: rules = [], isLoading: loading, error: rulesError, refetch: reloadRules } = useRules();
  const deleteRuleMutation = useDeleteRule();

  // Local state for UI
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [sortSelectOpen, setSortSelectOpen] = useState(false);

  // Convert React Query error to string for UI
  const error = rulesError ? 'Erro ao carregar regras. Verifique sua conexão e tente novamente.' : null;

  // Filter and sort rules when dependencies change
  useEffect(() => {
    const filtered = filterAndSortRules(rules, searchTerm, sortField, sortOrder);
    setFilteredRules(filtered);
  }, [rules, searchTerm, sortField, sortOrder]);

  const filterAndSortRules = (
    rules: Rule[],
    searchTerm: string,
    sortField: SortField,
    sortOrder: SortOrder,
  ): Rule[] => {
    // Filter by search term
    const filtered = rules.filter((rule) => {
      const searchLower = searchTerm.toLowerCase();
      return rule.name.toLowerCase().includes(searchLower) || rule.description.toLowerCase().includes(searchLower);
    });

    // Sort rules
    filtered.sort((a, b) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'flowCount':
        default:
          valueA = a.flows.length;
          valueB = b.flows.length;
          break;
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const handleCreateNewRule = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalVisible(false);
  }, []);

  const handleRuleCreated = useCallback((newRule: Rule) => {
    console.log('Nova regra criada:', newRule);
  }, []);

  const handleEditRule = useCallback((rule: Rule) => {
    console.log('Edit rule:', rule);
  }, []);

  const handleDeleteRule = useCallback(
    async (ruleName: string) => {
      try {
        await deleteRuleMutation.mutateAsync(ruleName);
      } catch (error) {
        displayError(error);
      }
    },
    [deleteRuleMutation],
  );

  const handleViewRuleDetails = useCallback(
    (ruleId: string) => {
      navigate(`/rule/${encodeURIComponent(ruleId)}`);
    },
    [navigate],
  );

  const handleRefresh = useCallback(() => {
    reloadRules();
  }, [reloadRules]);

  const handleToggleTheme = useCallback(() => {
    const isDark = theme.includes('dark');
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const renderHeader = () => (
    <PageHeader
      title={<h2 className="m-0 text-2xl font-semibold">Regras de Negócio</h2>}
      subTitle={
        <span className="text-sm">
          {filteredRules.length} regra{filteredRules.length !== 1 ? 's' : ''}
        </span>
      }
      extra={
        <Stack horizontal gap={12} verticalAlign="center">
          <ButtonBase
            onClick={handleToggleTheme}
            variant="ghost"
            size="lg"
            className="flex items-center gap-2 p-3"
            title={`Alternar para tema ${theme.includes('dark') ? 'claro' : 'escuro'}`}
          >
            {theme.includes('dark') ? <SunIcon size={20} /> : <MoonIcon size={20} />}
          </ButtonBase>
        </Stack>
      }
    />
  );

  const renderFilters = () => (
    <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full max-w-md">
          <InputBase
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm transition-all duration-200"
            leftIcon={<MagnifyingGlassIcon />}
          />
        </div>

        <div className="flex items-center gap-4">
          <ButtonBase onClick={handleCreateNewRule} className="flex items-center gap-2 whitespace-nowrap">
            <PlusIcon />
            Nova Regra
          </ButtonBase>

          <div className="flex items-center gap-2">
            <SelectBase
              open={sortSelectOpen}
              onOpenChange={setSortSelectOpen}
              value={`${sortField}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split('-') as [SortField, SortOrder];
                setSortField(field);
                setSortOrder(order);
              }}
            >
              <SelectTriggerBase className="w-44">
                <SelectValueBase placeholder="Selecionar ordenação" />
              </SelectTriggerBase>
              <SelectContentBase>
                <SelectItemBase value="name-asc">Nome A-Z</SelectItemBase>
                <SelectItemBase value="name-desc">Nome Z-A</SelectItemBase>
                <SelectItemBase value="flowCount-desc">Mais fluxos</SelectItemBase>
                <SelectItemBase value="flowCount-asc">Menos fluxos</SelectItemBase>
              </SelectContentBase>
            </SelectBase>
          </div>

          <div className="flex gap-1 rounded-lg p-1">
            <ButtonBase
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
              className="p-2"
            >
              <GridFourIcon />
            </ButtonBase>
            <ButtonBase
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              size="sm"
              className="p-2"
            >
              <ListIcon />
            </ButtonBase>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center justify-center p-10 gap-4">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-gray-600 text-sm">Carregando regras...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mx-4 sm:mx-6 lg:mx-8 my-4">
          <div className="p-4 border border-red-300 rounded-lg bg-red-50">
            <div className="text-red-700 font-medium mb-2">Erro ao carregar regras</div>
            <div className="text-red-600 text-sm mb-3">{error}</div>
            <ButtonBase onClick={handleRefresh} size="sm" variant="outline">
              Tentar novamente
            </ButtonBase>
          </div>
        </div>
      );
    }

    if (rules.length === 0) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center py-16 px-5">
            <div className="mb-4">
              <p className="text-lg text-gray-800 mb-2 m-0">Nenhuma regra encontrada</p>
              <p className="text-sm text-gray-500 m-0">Comece criando sua primeira regra de negócio</p>
            </div>
            <ButtonBase onClick={handleCreateNewRule} className="inline-flex items-center gap-2">
              <PlusIcon size={16} />
              Criar Primeira Regra
            </ButtonBase>
          </div>
        </div>
      );
    }

    if (filteredRules.length === 0 && searchTerm) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center py-16 px-5">
            <div className="mb-4">
              <p className="text-lg text-gray-800 mb-2 m-0">Nenhuma regra corresponde à sua busca</p>
              <p className="text-sm text-gray-500 m-0">Tente ajustar os termos de busca ou criar uma nova regra</p>
            </div>
            <ButtonBase onClick={handleCreateNewRule} className="inline-flex items-center gap-2">
              <PlusIcon size={16} />
              Criar Nova Regra
            </ButtonBase>
          </div>
        </div>
      );
    }

    return (
      <RuleList
        rules={filteredRules}
        loading={loading}
        error={error || undefined}
        onEdit={handleEditRule}
        onDelete={handleDeleteRule}
        onViewDetails={handleViewRuleDetails}
      />
    );
  };

  return (
    <div className="min-h-screen bg-off-white">
      {renderHeader()}
      {renderFilters()}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">{renderContent()}</div>

      <RuleCreationModal
        visible={isCreateModalVisible}
        onClose={handleCloseCreateModal}
        onSuccess={handleRuleCreated}
      />
    </div>
  );
};
