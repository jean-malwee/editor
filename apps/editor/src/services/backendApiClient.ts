import axios, { AxiosResponse } from 'axios';
import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, FlowData, Rule } from '@repo/schemas';

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

/**
 * Cliente HTTP para comunicação com o backend
 * Abstrai as chamadas para as rotas de fluxos
 */
export class BackendApiClient {
  /**
   * Lista todos os fluxos disponíveis
   */
  async listFlows(): Promise<FlowMetadata[]> {
    try {
      const response: AxiosResponse<FlowMetadata[]> = await apiClient.get('/flows');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar fluxos do backend:', error);
      throw new Error('Não foi possível carregar a lista de fluxos do servidor');
    }
  }

  /**
   * Carrega um fluxo específico pelo ID
   */
  async loadFlow(flowId: string): Promise<FlowData> {
    try {
      const response: AxiosResponse<FlowData> = await apiClient.get(`/flows/${flowId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar fluxo do backend:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Fluxo não encontrado');
      }
      throw new Error('Não foi possível carregar o fluxo do servidor');
    }
  }

  /**
   * Salva um novo fluxo ou atualiza um existente
   */
  async saveFlow(content: DecisionGraphType, metadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    try {
      const requestData: SaveFlowRequest = { content, metadata };
      const response: AxiosResponse<FlowMetadata> = await apiClient.post('/flows', requestData);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar fluxo no backend:', error);
      throw new Error('Não foi possível salvar o fluxo no servidor');
    }
  }

  /**
   * Atualiza metadados de um fluxo existente
   */
  async updateFlowMetadata(flowId: string, updatedMetadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    try {
      const response: AxiosResponse<FlowMetadata> = await apiClient.put(`/flows/${flowId}/metadata`, updatedMetadata);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar metadados do fluxo no backend:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Fluxo não encontrado');
      }
      throw new Error('Não foi possível atualizar os metadados do fluxo no servidor');
    }
  }

  /**
   * Deleta um fluxo do servidor
   */
  async deleteFlow(flowId: string): Promise<void> {
    try {
      await apiClient.delete(`/flows/${flowId}`);
    } catch (error) {
      console.error('Erro ao deletar fluxo no backend:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Fluxo não encontrado');
      }
      throw new Error('Não foi possível deletar o fluxo do servidor');
    }
  }

  /**
   * Verifica a saúde do backend
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Erro no health check do backend:', error);
      throw new Error('Backend não disponível');
    }
  }

  /**
   * Lista todas as regras disponíveis
   */
  async listRules(): Promise<Rule[]> {
    try {
      const response: AxiosResponse<Rule[]> = await apiClient.get('/rules');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar regras do backend:', error);
      throw new Error('Não foi possível carregar a lista de regras do servidor');
    }
  }

  /**
   * Carrega uma regra específica pelo nome
   */
  async loadRule(ruleName: string): Promise<Rule> {
    try {
      const response: AxiosResponse<Rule> = await apiClient.get(`/rules/${encodeURIComponent(ruleName)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar regra do backend:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Regra não encontrada');
      }
      throw new Error('Não foi possível carregar a regra do servidor');
    }
  }

  /**
   * Salva uma nova regra ou atualiza uma existente
   */
  async saveRule(rule: Rule): Promise<Rule> {
    try {
      const response: AxiosResponse<Rule> = await apiClient.post('/rules', rule);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar regra no backend:', error);
      throw new Error('Não foi possível salvar a regra no servidor');
    }
  }

  /**
   * Deleta uma regra do servidor
   */
  async deleteRule(ruleName: string): Promise<void> {
    try {
      await apiClient.delete(`/rules/${encodeURIComponent(ruleName)}`);
    } catch (error) {
      console.error('Erro ao deletar regra no backend:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Regra não encontrada');
      }
      throw new Error('Não foi possível deletar a regra do servidor');
    }
  }

  /**
   * Ativa um fluxo específico em uma regra
   */
  async activateFlow(ruleName: string, flowId: string): Promise<void> {
    try {
      await apiClient.put(`/rules/${encodeURIComponent(ruleName)}/flows/${flowId}/activate`);
    } catch (error) {
      console.error('Erro ao ativar fluxo no backend:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Regra ou fluxo não encontrado');
      }
      throw new Error('Não foi possível ativar o fluxo no servidor');
    }
  }
}

// Instância singleton do cliente da API
export const backendApiClient = new BackendApiClient();
