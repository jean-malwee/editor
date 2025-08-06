import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, FlowData } from '@repo/schemas';
import { toast } from '@mlw-packages/react-components';
import { apiService } from '../services/api';
import { FlowStorageService } from '../services/flowStorage';

// Query keys para organização do cache
export const queryKeys = {
  flows: {
    all: ['flows'] as const,
    list: () => [...queryKeys.flows.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.flows.all, 'detail', id] as const,
  },
  health: {
    check: ['health', 'check'] as const,
  },
} as const;

/**
 * Hook para buscar lista de fluxos
 */
export const useFlows = () => {
  return useQuery({
    queryKey: queryKeys.flows.list(),
    queryFn: async () => {
      // Usa o FlowStorageService que já faz a lógica de decidir entre cloud/local
      return await FlowStorageService.listFlows();
    },
    staleTime: 2 * 60 * 1000, // 2 minutos - dados de lista podem ficar stale mais rápido
  });
};

/**
 * Hook para buscar um fluxo específico
 */
export const useFlow = (flowId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.flows.detail(flowId || ''),
    queryFn: async (): Promise<FlowData> => {
      if (!flowId) {
        throw new Error('Flow ID is required');
      }
      return await FlowStorageService.loadFlow(flowId);
    },
    enabled: !!flowId, // Só executa se flowId estiver definido
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de detalhes podem ficar fresh por mais tempo
  });
};

/**
 * Hook para criar um novo fluxo
 */
export const useCreateFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: DecisionGraphType; metadata: Partial<FlowMetadata> }) => {
      return await FlowStorageService.saveFlow(data.content, data.metadata);
    },
    onSuccess: (newFlow) => {
      // Invalida e refaz a query da lista de fluxos
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.list() });

      // Adiciona o novo fluxo no cache
      queryClient.setQueryData(queryKeys.flows.detail(newFlow.id), {
        metadata: newFlow,
        content: null, // O conteúdo será carregado quando necessário
      });

      toast.success('Fluxo criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar fluxo:', error);
      toast.error('Erro ao criar fluxo. Tente novamente.');
    },
  });
};

/**
 * Hook para atualizar um fluxo existente (conteúdo + metadados)
 */
export const useUpdateFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { flowId: string; content: DecisionGraphType; metadata: Partial<FlowMetadata> }) => {
      // Para atualizar tanto conteúdo quanto metadados, usamos saveFlow
      return await FlowStorageService.saveFlow(data.content, {
        ...data.metadata,
        id: data.flowId, // Garante que mantenha o ID
      });
    },
    onSuccess: (updatedFlow, variables) => {
      // Invalida a lista de fluxos
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.list() });

      // Atualiza o cache do fluxo específico
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.detail(variables.flowId) });

      toast.success('Fluxo atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar fluxo:', error);
      toast.error('Erro ao atualizar fluxo. Tente novamente.');
    },
  });
};

/**
 * Hook para atualizar apenas metadados de um fluxo
 */
export const useUpdateFlowMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { flowId: string; metadata: Partial<FlowMetadata> }) => {
      return await FlowStorageService.updateFlowMetadata(data.flowId, data.metadata);
    },
    onSuccess: (updatedFlow, variables) => {
      // Invalida a lista de fluxos
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.list() });

      // Atualiza otimisticamente o cache do fluxo específico
      queryClient.setQueryData(queryKeys.flows.detail(variables.flowId), (old: FlowData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          metadata: updatedFlow,
        };
      });

      toast.success('Metadados atualizados com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar metadados:', error);
      toast.error('Erro ao atualizar metadados. Tente novamente.');
    },
  });
};

/**
 * Hook para deletar um fluxo
 */
export const useDeleteFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flowId: string) => {
      await FlowStorageService.deleteFlow(flowId);
      return flowId;
    },
    onSuccess: (deletedFlowId) => {
      // Remove o fluxo do cache da lista
      queryClient.setQueryData(queryKeys.flows.list(), (old: FlowMetadata[] | undefined) => {
        if (!old) return old;
        return old.filter((flow) => flow.id !== deletedFlowId);
      });

      // Remove o cache do fluxo específico
      queryClient.removeQueries({ queryKey: queryKeys.flows.detail(deletedFlowId) });

      toast.success('Fluxo excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar fluxo:', error);
      toast.error('Erro ao excluir fluxo. Tente novamente.');
    },
  });
};

/**
 * Hook para duplicar um fluxo
 */
export const useDuplicateFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flowId: string) => {
      // Carrega o fluxo original
      const flowData = await FlowStorageService.loadFlow(flowId);

      // Cria uma cópia com nome modificado
      return await FlowStorageService.saveFlow(flowData.content, {
        name: `${flowData.metadata.name} (Cópia)`,
        description: flowData.metadata.description,
        tags: flowData.metadata.tags,
      });
    },
    onSuccess: () => {
      // Invalida a lista de fluxos para mostrar o novo fluxo
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.list() });
      toast.success('Fluxo duplicado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao duplicar fluxo:', error);
      toast.error('Erro ao duplicar fluxo. Tente novamente.');
    },
  });
};

/**
 * Hook para simular execução de fluxo (apenas para cloud storage)
 */
export const useSimulateFlow = () => {
  return useMutation({
    mutationFn: async (data: { content: DecisionGraphType; context: Record<string, unknown> }) => {
      return await apiService.flows.simulate(data);
    },
    onError: (error) => {
      console.error('Erro na simulação:', error);
      toast.error('Erro ao executar simulação. Tente novamente.');
    },
  });
};

/**
 * Hook para verificar saúde do backend
 */
export const useHealthCheck = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.health.check,
    queryFn: apiService.health.check,
    staleTime: 30 * 1000, // 30 segundos
    retry: 2,
    refetchInterval: 60 * 1000, // Recheck a cada minuto
    enabled: options?.enabled !== false, // Default to enabled unless explicitly disabled
  });
};
