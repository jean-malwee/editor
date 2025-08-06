import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, FlowData, StorageService, Rule } from '@repo/schemas';
import { v4 as uuidv4 } from 'uuid';

// Serviço que simula o Google Cloud Storage usando localStorage
// Útil para desenvolvimento quando não há acesso ao GCS
export class LocalStorageService implements StorageService {
  private readonly STORAGE_KEY = 'editor_flows';
  private readonly RULES_STORAGE_KEY = 'editor_rules';

  /**
   * Lista todos os fluxos salvos no localStorage
   */
  async listFlows(): Promise<FlowMetadata[]> {
    try {
      const flows = this.getAllFlows();
      return flows
        .map((flow) => flow.metadata)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      console.error('Erro ao listar fluxos:', error);
      throw new Error('Não foi possível carregar a lista de fluxos');
    }
  }

  /**
   * Salva um fluxo no localStorage
   */
  async saveFlow(content: DecisionGraphType, metadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    try {
      const flowId = metadata.id || uuidv4();
      const now = new Date();

      const flowMetadata: FlowMetadata = {
        id: flowId,
        name: metadata.name || 'Untitled Flow',
        description: metadata.description,
        createdAt: metadata.createdAt || now,
        updatedAt: now,
        tags: metadata.tags || [],
      };

      const flowData: FlowData = {
        metadata: flowMetadata,
        content,
      };

      const flows = this.getAllFlows();
      const existingIndex = flows.findIndex((flow) => flow.metadata.id === flowId);

      if (existingIndex >= 0) {
        flows[existingIndex] = flowData;
      } else {
        flows.push(flowData);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(flows));

      return flowMetadata;
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      throw new Error('Não foi possível salvar o fluxo');
    }
  }

  /**
   * Carrega um fluxo específico pelo ID
   */
  async loadFlow(flowId: string): Promise<FlowData> {
    try {
      const flows = this.getAllFlows();
      const flow = flows.find((f) => f.metadata.id === flowId);

      if (!flow) {
        throw new Error('Fluxo não encontrado');
      }

      return flow;
    } catch (error) {
      console.error('Erro ao carregar fluxo:', error);
      throw new Error('Não foi possível carregar o fluxo');
    }
  }

  /**
   * Deleta um fluxo do localStorage
   */
  async deleteFlow(flowId: string): Promise<void> {
    try {
      const flows = this.getAllFlows();
      const filteredFlows = flows.filter((flow) => flow.metadata.id !== flowId);

      if (flows.length === filteredFlows.length) {
        throw new Error('Fluxo não encontrado');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredFlows));
    } catch (error) {
      console.error('Erro ao deletar fluxo:', error);
      throw new Error('Não foi possível deletar o fluxo');
    }
  }

  /**
   * Atualiza metadados de um fluxo existente
   */
  async updateFlowMetadata(flowId: string, updatedMetadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    try {
      const flowData = await this.loadFlow(flowId);

      const newMetadata: FlowMetadata = {
        ...flowData.metadata,
        ...updatedMetadata,
        id: flowId,
        updatedAt: new Date(),
      };

      await this.saveFlow(flowData.content, newMetadata);

      return newMetadata;
    } catch (error) {
      console.error('Erro ao atualizar metadados do fluxo:', error);
      throw new Error('Não foi possível atualizar os metadados do fluxo');
    }
  }

  /**
   * Obtém todos os fluxos do localStorage
   */
  private getAllFlows(): FlowData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
      return [];
    }
  }

  /**
   * Limpa todos os fluxos do localStorage (útil para desenvolvimento)
   */
  async clearAllFlows(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Exporta todos os fluxos como JSON (útil para backup)
   */
  async exportFlows(): Promise<string> {
    const flows = this.getAllFlows();
    return JSON.stringify(flows, null, 2);
  }

  /**
   * Importa fluxos de um JSON (útil para restaurar backup)
   */
  async importFlows(jsonData: string): Promise<void> {
    try {
      const flows: FlowData[] = JSON.parse(jsonData);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(flows));
    } catch (error) {
      console.error('Erro ao importar fluxos:', error);
      throw new Error('Não foi possível importar os fluxos. Verifique o formato do arquivo.');
    }
  }

  /**
   * Lista todas as regras salvas no localStorage
   */
  async listRules(): Promise<Rule[]> {
    try {
      const rules = this.getAllRules();
      return rules.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Erro ao listar regras:', error);
      throw new Error('Não foi possível carregar a lista de regras');
    }
  }

  /**
   * Carrega uma regra específica pelo nome
   */
  async loadRule(ruleName: string): Promise<Rule> {
    try {
      const rules = this.getAllRules();
      const rule = rules.find((r) => r.name === ruleName);

      if (!rule) {
        throw new Error('Regra não encontrada');
      }

      return rule;
    } catch (error) {
      console.error('Erro ao carregar regra:', error);
      throw new Error('Não foi possível carregar a regra');
    }
  }

  /**
   * Salva uma regra no localStorage
   */
  async saveRule(rule: Rule): Promise<Rule> {
    try {
      // Valida que apenas um fluxo está ativo
      const activeFlows = rule.flows.filter((flow) => flow.active);
      if (activeFlows.length > 1) {
        throw new Error('Apenas um fluxo pode estar ativo por regra');
      }

      const rules = this.getAllRules();
      const existingIndex = rules.findIndex((r) => r.name === rule.name);

      if (existingIndex >= 0) {
        rules[existingIndex] = rule;
      } else {
        rules.push(rule);
      }

      localStorage.setItem(this.RULES_STORAGE_KEY, JSON.stringify(rules));

      return rule;
    } catch (error) {
      console.error('Erro ao salvar regra:', error);
      throw new Error('Não foi possível salvar a regra');
    }
  }

  /**
   * Deleta uma regra do localStorage
   */
  async deleteRule(ruleName: string): Promise<void> {
    try {
      const rules = this.getAllRules();
      const filteredRules = rules.filter((rule) => rule.name !== ruleName);

      if (rules.length === filteredRules.length) {
        throw new Error('Regra não encontrada');
      }

      localStorage.setItem(this.RULES_STORAGE_KEY, JSON.stringify(filteredRules));
    } catch (error) {
      console.error('Erro ao deletar regra:', error);
      throw new Error('Não foi possível deletar a regra');
    }
  }

  /**
   * Ativa um fluxo específico em uma regra (desativa os outros)
   */
  async setActiveFlow(ruleName: string, flowId: string): Promise<void> {
    try {
      const rule = await this.loadRule(ruleName);

      // Verifica se o fluxo existe na regra
      const flowExists = rule.flows.some((flow) => flow.id === flowId);
      if (!flowExists) {
        throw new Error('Fluxo não encontrado na regra');
      }

      // Atualiza o status dos fluxos: apenas o especificado fica ativo
      rule.flows = rule.flows.map((flow) => ({
        ...flow,
        active: flow.id === flowId,
      }));

      await this.saveRule(rule);
    } catch (error) {
      console.error('Erro ao ativar fluxo:', error);
      throw new Error('Não foi possível ativar o fluxo');
    }
  }

  /**
   * Obtém todas as regras do localStorage
   */
  private getAllRules(): Rule[] {
    try {
      const stored = localStorage.getItem(this.RULES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao acessar localStorage (regras):', error);
      return [];
    }
  }

  /**
   * Limpa todas as regras do localStorage (útil para desenvolvimento)
   */
  async clearAllRules(): Promise<void> {
    localStorage.removeItem(this.RULES_STORAGE_KEY);
  }
}
