/* eslint-disable @typescript-eslint/no-explicit-any */

// Metadados de fluxo
export interface FlowMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// Dados de fluxo (usa any para evitar dependência circular)
export interface FlowData {
  metadata: FlowMetadata;
  content: any; // DecisionGraphType será definido pelos apps que importam
}

// Fluxo dentro de uma regra
export interface RuleFlow {
  id: string;
  name: string;
  active: boolean;
}

// Regra (contém múltiplos fluxos)
export interface Rule {
  id: string;
  name: string;
  description: string;
  flows: RuleFlow[];
}

// Interface para serviços de storage
export interface StorageService {
  listFlows(): Promise<FlowMetadata[]>;
  saveFlow(content: any, metadata: Partial<FlowMetadata>): Promise<FlowMetadata>;
  loadFlow(flowId: string): Promise<{ metadata: FlowMetadata; content: any }>;
  deleteFlow(flowId: string): Promise<void>;
  updateFlowMetadata(flowId: string, updatedMetadata: Partial<FlowMetadata>): Promise<FlowMetadata>;
  
  // Métodos para manipulação de regras
  listRules(): Promise<Rule[]>;
  loadRule(ruleId: string): Promise<Rule>;
  saveRule(rule: Rule): Promise<Rule>;
  deleteRule(ruleId: string): Promise<void>;
  setActiveFlow(ruleId: string, flowId: string): Promise<void>;
}

// Informações sobre o provedor de storage
export interface StorageInfo {
  provider: string;
  isCloud: boolean;
  bucketName?: string;
  projectId?: string;
}
