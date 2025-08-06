import axios, { AxiosResponse } from 'axios';
import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, FlowData } from '@repo/schemas';

// Configuração base do axios para o cliente da API
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para as requisições de salvamento de fluxo
interface SaveFlowRequest {
  content: DecisionGraphType;
  metadata: Partial<FlowMetadata>;
}

// Interface para requisições de simulação
interface SimulateFlowRequest {
  content: DecisionGraphType;
  context: Record<string, unknown>;
}

/**
 * Serviços de API para uso com React Query
 * Todas as funções retornam Promises que podem ser usadas diretamente
 * com useQuery e useMutation
 */
export const apiService = {
  // Flows
  flows: {
    /**
     * Lista todos os fluxos disponíveis
     */
    list: async (): Promise<FlowMetadata[]> => {
      const response: AxiosResponse<FlowMetadata[]> = await apiClient.get('/flows');
      return response.data;
    },

    /**
     * Carrega um fluxo específico pelo ID
     */
    get: async (flowId: string): Promise<FlowData> => {
      const response: AxiosResponse<FlowData> = await apiClient.get(`/flows/${flowId}`);
      return response.data;
    },

    /**
     * Cria um novo fluxo
     */
    create: async (data: SaveFlowRequest): Promise<FlowMetadata> => {
      const response: AxiosResponse<FlowMetadata> = await apiClient.post('/flows', data);
      return response.data;
    },

    /**
     * Atualiza metadados de um fluxo existente
     */
    updateMetadata: async (params: { flowId: string; metadata: Partial<FlowMetadata> }): Promise<FlowMetadata> => {
      const { flowId, metadata } = params;
      const response: AxiosResponse<FlowMetadata> = await apiClient.put(`/flows/${flowId}/metadata`, metadata);
      return response.data;
    },

    /**
     * Deleta um fluxo
     */
    delete: async (flowId: string): Promise<void> => {
      await apiClient.delete(`/flows/${flowId}`);
    },

    /**
     * Simula a execução de um fluxo
     */
    simulate: async (data: SimulateFlowRequest): Promise<unknown> => {
      const response = await apiClient.post('/simulate', data);
      return response.data;
    },
  },

  // Health check
  health: {
    /**
     * Verifica a saúde do backend
     */
    check: async (): Promise<{ status: string; timestamp: string }> => {
      const response = await apiClient.get('/health');
      return response.data;
    },
  },
};
