// Tipos de posição
export interface Position {
  x: number;
  y: number;
}

// Tipos de nós de decisão
export interface DecisionNode {
  id: string;
  name: string;
  description?: string;
  type?: string;
  content?: unknown;
  position: Position;
}

// Tipos de arestas de decisão
export interface DecisionEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type?: string;
  sourceHandle?: string;
}

// Conteúdo de decisão
export interface DecisionContent {
  nodes: DecisionNode[];
  edges: DecisionEdge[];
}

// Tipos de documento
export enum DocumentFileTypes {
  Decision = 'application/vnd.gorules.decision',
}
