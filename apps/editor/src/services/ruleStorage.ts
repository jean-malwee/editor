import { Rule } from '@repo/schemas';
import { CloudStorageService } from './cloudStorage';
import { LocalStorageService } from './localStorage';

// Re-export para facilitar o uso
export type { Rule, RuleFlow } from '@repo/schemas';

// Determina qual serviço usar baseado na configuração do ambiente
// Para usar o backend (Google Cloud Storage), altere para true
const useCloudStorage = import.meta.env.VITE_USE_CLOUD_STORAGE === 'true' || false;

const CloudStorageServiceInstance = new CloudStorageService();
const LocalStorageServiceInstance = new LocalStorageService();

// Interface específica para serviços de regras
export interface RuleStorageService {
  listRules(): Promise<Rule[]>;
  loadRule(ruleId: string): Promise<Rule>;
  loadRuleByName(ruleName: string): Promise<Rule>; // Backward compatibility
  saveRule(rule: Rule): Promise<Rule>;
  deleteRule(ruleId: string): Promise<void>;
  deleteRuleByName(ruleName: string): Promise<void>; // Backward compatibility
  activateFlow(ruleId: string, flowId: string): Promise<void>;
  activateFlowByName(ruleName: string, flowId: string): Promise<void>; // Backward compatibility
}

// Adaptador que permite alternar entre serviços
export const RuleStorageService: RuleStorageService = {
  async listRules() {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.listRules();
    }
    return LocalStorageServiceInstance.listRules();
  },

  async loadRule(ruleId: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.loadRule(ruleId);
    }
    return LocalStorageServiceInstance.loadRule(ruleId);
  },

  async loadRuleByName(ruleName: string) {
    if (useCloudStorage) {
      // Para o cloud storage, buscar regra por nome requer listar todas e filtrar
      const rules = await CloudStorageServiceInstance.listRules();
      const rule = rules.find((r) => r.name === ruleName);
      if (!rule) {
        throw new Error('Regra não encontrada');
      }
      return rule;
    }
    // Para localStorage, usar o método original (por compatibilidade)
    return LocalStorageServiceInstance.loadRule(ruleName);
  },

  async saveRule(rule: Rule) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.saveRule(rule);
    }
    return LocalStorageServiceInstance.saveRule(rule);
  },

  async deleteRule(ruleId: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.deleteRule(ruleId);
    }
    return LocalStorageServiceInstance.deleteRule(ruleId);
  },

  async deleteRuleByName(ruleName: string) {
    if (useCloudStorage) {
      // Para o cloud storage, buscar regra por nome e deletar por ID
      const rules = await CloudStorageServiceInstance.listRules();
      const rule = rules.find((r) => r.name === ruleName);
      if (!rule) {
        throw new Error('Regra não encontrada');
      }
      return CloudStorageServiceInstance.deleteRule(rule.id);
    }
    // Para localStorage, usar o método original (por compatibilidade)
    return LocalStorageServiceInstance.deleteRule(ruleName);
  },

  async activateFlow(ruleId: string, flowId: string) {
    if (useCloudStorage) {
      return CloudStorageServiceInstance.setActiveFlow(ruleId, flowId);
    }
    // Para localStorage, usar o método original (assumindo ruleId é na verdade ruleName)
    return LocalStorageServiceInstance.setActiveFlow(ruleId, flowId);
  },

  async activateFlowByName(ruleName: string, flowId: string) {
    if (useCloudStorage) {
      // Para o cloud storage, buscar regra por nome e ativar fluxo por ID
      const rules = await CloudStorageServiceInstance.listRules();
      const rule = rules.find((r) => r.name === ruleName);
      if (!rule) {
        throw new Error('Regra não encontrada');
      }
      return CloudStorageServiceInstance.setActiveFlow(rule.id, flowId);
    }
    // Para localStorage, usar o método original
    return LocalStorageServiceInstance.setActiveFlow(ruleName, flowId);
  },
};

// Informações sobre qual serviço está sendo usado
export const getRuleStorageInfo = () => ({
  provider: useCloudStorage ? 'Backend API (Google Cloud Storage)' : 'Local Storage',
  isCloud: useCloudStorage,
  apiBaseUrl: useCloudStorage ? '/api' : undefined,
  environment: import.meta.env.MODE,
  useCloudStorageEnv: import.meta.env.VITE_USE_CLOUD_STORAGE,
});
