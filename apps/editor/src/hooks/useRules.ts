import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Rule } from '@repo/schemas';
import { toast } from '@mlw-packages/react-components';
import { RuleStorageService } from '../services/ruleStorage';

// Query keys para organização do cache
export const ruleQueryKeys = {
  rules: {
    all: ['rules'] as const,
    list: () => [...ruleQueryKeys.rules.all, 'list'] as const,
    detail: (ruleId: string) => [...ruleQueryKeys.rules.all, 'detail', ruleId] as const,
    detailByName: (ruleName: string) => [...ruleQueryKeys.rules.all, 'detailByName', ruleName] as const,
  },
} as const;

/**
 * Hook para buscar lista de regras
 */
export const useRules = () => {
  return useQuery({
    queryKey: ruleQueryKeys.rules.list(),
    queryFn: async () => {
      return await RuleStorageService.listRules();
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para buscar uma regra específica por ID
 */
export const useRule = (ruleId: string | undefined) => {
  return useQuery({
    queryKey: ruleQueryKeys.rules.detail(ruleId || ''),
    queryFn: async (): Promise<Rule> => {
      if (!ruleId) {
        throw new Error('Rule ID is required');
      }
      return await RuleStorageService.loadRule(ruleId);
    },
    enabled: !!ruleId, // Só executa se ruleId estiver definido
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para buscar uma regra específica por nome (backward compatibility)
 */
export const useRuleByName = (ruleName: string | undefined) => {
  return useQuery({
    queryKey: ruleQueryKeys.rules.detailByName(ruleName || ''),
    queryFn: async (): Promise<Rule> => {
      if (!ruleName) {
        throw new Error('Rule name is required');
      }
      return await RuleStorageService.loadRuleByName(ruleName);
    },
    enabled: !!ruleName, // Só executa se ruleName estiver definido
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para criar uma nova regra
 */
export const useCreateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: Rule) => {
      return await RuleStorageService.saveRule(rule);
    },
    onSuccess: () => {
      // Invalida e refaz a query da lista de regras
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.list() });
      toast.success('Regra criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar regra:', error);
      toast.error('Erro ao criar regra. Tente novamente.');
    },
  });
};

/**
 * Hook para atualizar uma regra existente
 */
export const useUpdateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rule: Rule) => {
      return await RuleStorageService.saveRule(rule);
    },
    onSuccess: (updatedRule) => {
      // Invalida a lista de regras
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.list() });

      // Atualiza o cache da regra específica
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.detail(updatedRule.id) });
      // Para compatibilidade, também invalida o cache por nome
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.detailByName(updatedRule.name) });

      toast.success('Regra atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar regra:', error);
      toast.error('Erro ao atualizar regra. Tente novamente.');
    },
  });
};

/**
 * Hook para deletar uma regra por ID
 */
export const useDeleteRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string) => {
      await RuleStorageService.deleteRule(ruleId);
      return ruleId;
    },
    onSuccess: (deletedRuleId) => {
      // Remove a regra do cache da lista
      queryClient.setQueryData(ruleQueryKeys.rules.list(), (old: Rule[] | undefined) => {
        if (!old) return old;
        return old.filter((rule) => rule.id !== deletedRuleId);
      });

      // Remove o cache da regra específica
      queryClient.removeQueries({ queryKey: ruleQueryKeys.rules.detail(deletedRuleId) });

      toast.success('Regra excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar regra:', error);
      toast.error('Erro ao excluir regra. Tente novamente.');
    },
  });
};

/**
 * Hook para deletar uma regra por nome (backward compatibility)
 */
export const useDeleteRuleByName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleName: string) => {
      await RuleStorageService.deleteRuleByName(ruleName);
      return ruleName;
    },
    onSuccess: (deletedRuleName) => {
      // Remove a regra do cache da lista
      queryClient.setQueryData(ruleQueryKeys.rules.list(), (old: Rule[] | undefined) => {
        if (!old) return old;
        return old.filter((rule) => rule.name !== deletedRuleName);
      });

      // Remove o cache da regra específica por nome
      queryClient.removeQueries({ queryKey: ruleQueryKeys.rules.detailByName(deletedRuleName) });

      toast.success('Regra excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar regra:', error);
      toast.error('Erro ao excluir regra. Tente novamente.');
    },
  });
};

/**
 * Hook para ativar um fluxo específico em uma regra por ID
 */
export const useActivateFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ruleId, flowId }: { ruleId: string; flowId: string }) => {
      await RuleStorageService.activateFlow(ruleId, flowId);
      return { ruleId, flowId };
    },
    onSuccess: ({ ruleId }) => {
      // Invalida a lista de regras
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.list() });

      // Atualiza o cache da regra específica
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.detail(ruleId) });

      toast.success('Fluxo ativado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao ativar fluxo:', error);
      toast.error('Erro ao ativar fluxo. Tente novamente.');
    },
  });
};

/**
 * Hook para ativar um fluxo específico em uma regra por nome (backward compatibility)
 */
export const useActivateFlowByName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ruleName, flowId }: { ruleName: string; flowId: string }) => {
      await RuleStorageService.activateFlowByName(ruleName, flowId);
      return { ruleName, flowId };
    },
    onSuccess: ({ ruleName }) => {
      // Invalida a lista de regras
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.list() });

      // Atualiza o cache da regra específica
      queryClient.invalidateQueries({ queryKey: ruleQueryKeys.rules.detailByName(ruleName) });

      toast.success('Fluxo ativado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao ativar fluxo:', error);
      toast.error('Erro ao ativar fluxo. Tente novamente.');
    },
  });
};
