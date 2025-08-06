import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { DecisionGraphType } from '@gorules/jdm-editor';
import { FlowMetadata, FlowData, StorageService, Rule } from '@repo/schemas';

export class CloudStorageService implements StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(projectId: string, bucketName: string, keyFilename?: string) {
    this.bucketName = bucketName;
    this.storage = new Storage({
      projectId,
      ...(keyFilename && { keyFilename }),
    });
  }

  private get bucket() {
    return this.storage.bucket(this.bucketName);
  }

  /**
   * Lista todos os fluxos salvos no bucket
   */
  async listFlows(): Promise<FlowMetadata[]> {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: 'flows/',
        delimiter: '/',
      });

      const flows: FlowMetadata[] = [];

      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const [content] = await file.download();
            const flowData: FlowData = JSON.parse(content.toString());
            flows.push({
              ...flowData.metadata,
              createdAt: new Date(flowData.metadata.createdAt),
              updatedAt: new Date(flowData.metadata.updatedAt),
            });
          } catch (error) {
            console.warn(`Erro ao processar arquivo ${file.name}:`, error);
          }
        }
      }

      return flows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (error) {
      console.error('Erro ao listar fluxos:', error);
      throw new Error('Não foi possível carregar a lista de fluxos');
    }
  }

  /**
   * Salva um fluxo no bucket
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

      const fileName = `flows/${flowId}.json`;
      const file = this.bucket.file(fileName);

      await file.save(JSON.stringify(flowData, null, 2), {
        metadata: {
          contentType: 'application/json',
        },
      });

      return flowMetadata;
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      throw new Error(`Não foi possível salvar o fluxo: ${error}`);
    }
  }

  /**
   * Carrega um fluxo específico do bucket
   */
  async loadFlow(flowId: string): Promise<{ metadata: FlowMetadata; content: DecisionGraphType }> {
    try {
      const fileName = `flows/${flowId}.json`;
      const file = this.bucket.file(fileName);

      const [exists] = await file.exists();
      if (!exists) {
        throw new Error('Fluxo não encontrado');
      }

      const [content] = await file.download();
      const flowData: FlowData = JSON.parse(content.toString());

      return {
        metadata: {
          ...flowData.metadata,
          createdAt: new Date(flowData.metadata.createdAt),
          updatedAt: new Date(flowData.metadata.updatedAt),
        },
        content: flowData.content,
      };
    } catch (error) {
      console.error('Erro ao carregar fluxo:', error);
      throw new Error(`Não foi possível carregar o fluxo: ${error}`);
    }
  }

  /**
   * Deleta um fluxo do bucket
   */
  async deleteFlow(flowId: string): Promise<void> {
    try {
      const fileName = `flows/${flowId}.json`;
      const file = this.bucket.file(fileName);

      const [exists] = await file.exists();
      if (!exists) {
        throw new Error('Fluxo não encontrado');
      }

      await file.delete();
    } catch (error) {
      console.error('Erro ao deletar fluxo:', error);
      throw new Error(`Não foi possível deletar o fluxo: ${error}`);
    }
  }

  /**
   * Atualiza os metadados de um fluxo
   */
  async updateFlowMetadata(flowId: string, updatedMetadata: Partial<FlowMetadata>): Promise<FlowMetadata> {
    try {
      const { metadata, content } = await this.loadFlow(flowId);

      const newMetadata: FlowMetadata = {
        ...metadata,
        ...updatedMetadata,
        id: flowId, // Não permitir mudança do ID
        updatedAt: new Date(),
      };

      const flowData: FlowData = {
        metadata: newMetadata,
        content,
      };

      const fileName = `flows/${flowId}.json`;
      const file = this.bucket.file(fileName);

      await file.save(JSON.stringify(flowData, null, 2), {
        metadata: {
          contentType: 'application/json',
        },
      });

      return newMetadata;
    } catch (error) {
      console.error('Erro ao atualizar metadados do fluxo:', error);
      throw new Error(`Não foi possível atualizar os metadados do fluxo: ${error}`);
    }
  }

  /**
   * Lista todas as regras salvas no bucket
   */
  async listRules(): Promise<Rule[]> {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: 'application/rules/',
        delimiter: '/',
      });

      const rules: Rule[] = [];

      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const [content] = await file.download();
            const rule: Rule = JSON.parse(content.toString());
            rules.push(rule);
          } catch (error) {
            console.warn(`Erro ao processar arquivo de regra ${file.name}:`, error);
          }
        }
      }

      // Ordena por nome da regra
      return rules.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Erro ao listar regras:', error);
      throw new Error('Não foi possível carregar a lista de regras');
    }
  }

  /**
   * Carrega uma regra específica do bucket
   */
  async loadRule(ruleId: string): Promise<Rule> {
    try {
      const fileName = `application/rules/${ruleId}.json`;
      const file = this.bucket.file(fileName);

      const [exists] = await file.exists();
      if (!exists) {
        throw new Error('Regra não encontrada');
      }

      const [content] = await file.download();
      const rule: Rule = JSON.parse(content.toString());

      return rule;
    } catch (error) {
      console.error('Erro ao carregar regra:', error);
      throw new Error(`Não foi possível carregar a regra: ${error}`);
    }
  }

  /**
   * Salva uma regra no bucket
   */
  async saveRule(rule: Rule): Promise<Rule> {
    try {
      // Gera UUID para nova regra se não tiver ID
      if (!rule.id) {
        rule.id = uuidv4();
      }

      // Valida que apenas um fluxo está ativo
      const activeFlows = rule.flows.filter(flow => flow.active);
      if (activeFlows.length > 1) {
        throw new Error('Apenas um fluxo pode estar ativo por regra');
      }

      const fileName = `application/rules/${rule.id}.json`;
      const file = this.bucket.file(fileName);

      await file.save(JSON.stringify(rule, null, 2), {
        metadata: {
          contentType: 'application/json',
        },
      });

      return rule;
    } catch (error) {
      console.error('Erro ao salvar regra:', error);
      throw new Error(`Não foi possível salvar a regra: ${error}`);
    }
  }

  /**
   * Deleta uma regra do bucket
   */
  async deleteRule(ruleId: string): Promise<void> {
    try {
      const fileName = `application/rules/${ruleId}.json`;
      const file = this.bucket.file(fileName);

      const [exists] = await file.exists();
      if (!exists) {
        throw new Error('Regra não encontrada');
      }

      await file.delete();
    } catch (error) {
      console.error('Erro ao deletar regra:', error);
      throw new Error(`Não foi possível deletar a regra: ${error}`);
    }
  }

  /**
   * Ativa um fluxo específico em uma regra (desativa os outros)
   */
  async setActiveFlow(ruleId: string, flowId: string): Promise<void> {
    try {
      const rule = await this.loadRule(ruleId);

      // Verifica se o fluxo existe na regra
      const flowExists = rule.flows.some(flow => flow.id === flowId);
      if (!flowExists) {
        throw new Error('Fluxo não encontrado na regra');
      }

      // Atualiza o status dos fluxos: apenas o especificado fica ativo
      rule.flows = rule.flows.map(flow => ({
        ...flow,
        active: flow.id === flowId,
      }));

      await this.saveRule(rule);
    } catch (error) {
      console.error('Erro ao ativar fluxo:', error);
      throw new Error(`Não foi possível ativar o fluxo: ${error}`);
    }
  }
}
