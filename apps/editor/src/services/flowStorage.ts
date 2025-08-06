import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, StorageService } from '@repo/schemas';
import { CloudStorageService } from './cloudStorage';
import { LocalStorageService } from './localStorage';

// Re-export para facilitar o uso
export type { FlowMetadata } from '@repo/schemas';

// Determina qual serviço usar baseado na configuração do ambiente
// Para usar o backend (Google Cloud Storage), altere para true
const useCloudStorage = import.meta.env.VITE_USE_CLOUD_STORAGE === 'true' || false;

const CloudStorageServiceInstance = new CloudStorageService();
const LocalStorageServiceInstance = new LocalStorageService();

// Adaptador que permite alternar entre serviços
export const FlowStorageService: StorageService = {
  async listFlows() {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.listFlows();
    }
    return LocalStorageServiceInstance.listFlows();
  },

  async saveFlow(content: DecisionGraphType, metadata: Partial<FlowMetadata>) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.saveFlow(content, metadata);
    }
    return LocalStorageServiceInstance.saveFlow(content, metadata);
  },

  async loadFlow(flowId: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.loadFlow(flowId);
    }
    return LocalStorageServiceInstance.loadFlow(flowId);
  },

  async deleteFlow(flowId: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.deleteFlow(flowId);
    }
    return LocalStorageServiceInstance.deleteFlow(flowId);
  },

  async updateFlowMetadata(flowId: string, updatedMetadata: Partial<FlowMetadata>) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.updateFlowMetadata(flowId, updatedMetadata);
    }
    return LocalStorageServiceInstance.updateFlowMetadata(flowId, updatedMetadata);
  },

  async listRules() {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.listRules();
    }
    return LocalStorageServiceInstance.listRules();
  },

  async loadRule(ruleName: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.loadRule(ruleName);
    }
    return LocalStorageServiceInstance.loadRule(ruleName);
  },

  async saveRule(rule) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.saveRule(rule);
    }
    return LocalStorageServiceInstance.saveRule(rule);
  },

  async deleteRule(ruleName: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.deleteRule(ruleName);
    }
    return LocalStorageServiceInstance.deleteRule(ruleName);
  },

  async setActiveFlow(ruleName: string, flowId: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.setActiveFlow(ruleName, flowId);
    }
    return LocalStorageServiceInstance.setActiveFlow(ruleName, flowId);
  },
};

// Informações sobre qual serviço está sendo usado
export const getStorageInfo = () => ({
  provider: useCloudStorage ? 'Backend API (Google Cloud Storage)' : 'Local Storage',
  isCloud: useCloudStorage,
  apiBaseUrl: useCloudStorage ? '/api' : undefined,
  environment: import.meta.env.MODE,
  useCloudStorageEnv: import.meta.env.VITE_USE_CLOUD_STORAGE,
});

// Função para forçar o uso do localStorage (útil para desenvolvimento)
export const forceLocalStorage = () => {
  return {
    ...LocalStorageServiceInstance,
    provider: 'Local Storage (Forced)',
    isCloud: false,
  };
};
