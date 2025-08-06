import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, FlowData, StorageService, Rule } from '@repo/schemas';
import { backendApiClient } from './backendApiClient';

// Re-export dos tipos para compatibilidade
export type { FlowMetadata, FlowData, Rule, RuleFlow } from '@repo/schemas';

export class CloudStorageService implements StorageService {
  /**
   * Lista todos os fluxos salvos através do backend
   */
  async listFlows(): Promise<FlowMetadata[]> {
    return await backendApiClient.listFlows();
  }

  /**
   * Salva um fluxo através do backend
   */
  async saveFlow(content: DecisionGraphType, metadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    return await backendApiClient.saveFlow(content, metadata);
  }

  /**
   * Carrega um fluxo específico pelo ID através do backend
   */
  async loadFlow(flowId: string): Promise<FlowData> {
    return await backendApiClient.loadFlow(flowId);
  }

  /**
   * Deleta um fluxo através do backend
   */
  async deleteFlow(flowId: string): Promise<void> {
    await backendApiClient.deleteFlow(flowId);
  }

  /**
   * Atualiza metadados de um fluxo existente através do backend
   */
  async updateFlowMetadata(flowId: string, updatedMetadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    return await backendApiClient.updateFlowMetadata(flowId, updatedMetadata);
  }

  /**
   * Lista todas as regras através do backend
   */
  async listRules(): Promise<Rule[]> {
    return await backendApiClient.listRules();
  }

  /**
   * Carrega uma regra específica pelo nome através do backend
   */
  async loadRule(ruleName: string): Promise<Rule> {
    return await backendApiClient.loadRule(ruleName);
  }

  /**
   * Salva uma regra através do backend
   */
  async saveRule(rule: Rule): Promise<Rule> {
    return await backendApiClient.saveRule(rule);
  }

  /**
   * Deleta uma regra através do backend
   */
  async deleteRule(ruleName: string): Promise<void> {
    await backendApiClient.deleteRule(ruleName);
  }

  /**
   * Ativa um fluxo específico em uma regra através do backend
   */
  async setActiveFlow(ruleName: string, flowId: string): Promise<void> {
    await backendApiClient.activateFlow(ruleName, flowId);
  }

  /**
   * Verifica se o backend está disponível
   */
  async healthCheck() {
    return await backendApiClient.healthCheck();
  }
}
