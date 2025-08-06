---
mode: agent
---

# Refatoração da Estrutura de Apresentação de Fluxos Baseada em Regras

## Objetivo

Transformar a estrutura atual de apresentação de fluxos individuais para uma hierarquia organizada por regras, onde cada regra contém múltiplos fluxos e apenas um fluxo pode estar ativo por regra por vez.

## Estrutura de Dados

### Regra (Rule)
```typescript
interface Rule {
  name: string;
  description: string;
  flows: RuleFlow[];
}
```

### Fluxo dentro de uma Regra (RuleFlow)
```typescript
interface RuleFlow {
  id: string;
  name: string;
  active: boolean;
}
```

### Exemplo de JSON por Regra
```json
{
  "name": "Calculo Quantidade para Abrir",
  "description": "Calcula a quantidade necessária para abrir um novo fluxo",
  "flows": [
    {
      "id": "6cf8a6fd-56ba-41fb-959f-c18904c20927",
      "name": "Calculo Quantidade para Abrir - 1",
      "active": true
    },
    {
      "id": "6cf8a6fd-56ba-41fb-959f-c28704c50928",
      "name": "Calculo Quantidade para Abrir - 2",
      "active": false
    }
  ]
}
```

## Estrutura de Armazenamento

### Google Cloud Storage
- **Regras**: `application/rules/{rule-name}.json`
- **Fluxos**: `flows/{flow-id}.json` (estrutura atual mantida)

## Tarefas de Implementação

### 1. Backend (apps/backend/)

#### 1.1 Atualizar Schemas (packages/schemas/src/)
- [ ] Criar interfaces `Rule` e `RuleFlow` em `storage.ts`
- [ ] Adicionar métodos para manipulação de regras na interface `StorageService`
- [ ] Manter compatibilidade com interfaces existentes de `FlowMetadata` e `FlowData`

#### 1.2 Expandir CloudStorageService (apps/backend/src/services/cloudStorage.ts)
- [ ] Implementar `listRules(): Promise<Rule[]>`
- [ ] Implementar `loadRule(ruleName: string): Promise<Rule>`
- [ ] Implementar `saveRule(rule: Rule): Promise<Rule>`
- [ ] Implementar `deleteRule(ruleName: string): Promise<void>`
- [ ] Implementar `setActiveFlow(ruleName: string, flowId: string): Promise<void>`
- [ ] Manter métodos existentes de fluxos para compatibilidade

#### 1.3 Criar Rotas de Regras (apps/backend/src/routes/rules.ts)
- [ ] `GET /api/rules` - Lista todas as regras
- [ ] `GET /api/rules/:ruleName` - Carrega uma regra específica
- [ ] `POST /api/rules` - Cria/atualiza uma regra
- [ ] `DELETE /api/rules/:ruleName` - Deleta uma regra
- [ ] `PUT /api/rules/:ruleName/flows/:flowId/activate` - Ativa um fluxo específico

#### 1.4 Atualizar Schemas de Validação (apps/backend/src/schemas.ts)
- [ ] Adicionar schemas Zod para validação de regras
- [ ] Manter schemas existentes de fluxos

### 2. Frontend (apps/editor/)

#### 2.1 Criar Serviços de API (apps/editor/src/services/)
- [ ] Atualizar `backendApiClient.ts` com endpoints de regras
- [ ] Criar `ruleService.ts` para operações específicas de regras
- [ ] Manter `flowStorage.ts` existente para compatibilidade

#### 2.2 Criar Hooks de Regras (apps/editor/src/hooks/)
- [ ] `useRules.ts` - Hook para listar e gerenciar regras
- [ ] `useRule.ts` - Hook para operações em regra específica
- [ ] `useActivateFlow.ts` - Hook para ativar/desativar fluxos
- [ ] Manter `useFlows.ts` existente para operações de fluxos individuais

#### 2.3 Criar Componentes de Regras (apps/editor/src/components/)
- [ ] `rule-card.tsx` - Card individual de regra na home
- [ ] `rule-list.tsx` - Lista de regras na home
- [ ] `flow-list-by-rule.tsx` - Lista de fluxos dentro de uma regra
- [ ] `active-flow-indicator.tsx` - Indicador visual de fluxo ativo
- [ ] Manter componentes existentes de fluxos

#### 2.4 Atualizar Páginas (apps/editor/src/pages/)
- [ ] Refatorar `home.tsx` para listar regras em vez de fluxos
- [ ] Criar `rule-details.tsx` - Página de detalhes de uma regra específica
- [ ] Manter `decision-simple.tsx` (editor) inalterado
- [ ] Atualizar roteamento no `main.tsx`

#### 2.5 Atualizar Roteamento
- [ ] `/` - Home com lista de regras
- [ ] `/rule/:ruleName` - Página de detalhes da regra com lista de fluxos
- [ ] `/editor/:flowId?` - Editor de fluxos (mantido)
- [ ] `/editor/rule/:ruleName` - Criar novo fluxo dentro de uma regra

### 3. Migração e Compatibilidade

#### 3.1 Estratégia de Migração
- [ ] Criar script de migração para organizar fluxos existentes em regras
- [ ] Implementar fallback para fluxos órfãos (sem regra definida)
- [ ] Manter endpoints existentes funcionando durante transição

#### 3.2 Regra Padrão
- [ ] Criar regra "Fluxos Gerais" para fluxos não categorizados
- [ ] Implementar lógica para auto-categorização baseada em metadados

### 4. Interface do Usuário

#### 4.1 Home Page Redesign
- [ ] Grid/lista de cards de regras
- [ ] Busca e filtro por nome/descrição de regras
- [ ] Contador de fluxos por regra
- [ ] Indicador de regras com fluxos ativos
- [ ] Botão "Nova Regra"

#### 4.2 Página de Detalhes da Regra
- [ ] Header com nome e descrição da regra
- [ ] Lista de fluxos da regra
- [ ] Indicação clara do fluxo ativo
- [ ] Ações: ativar/desativar fluxo, editar fluxo, novo fluxo
- [ ] Breadcrumb para navegação

#### 4.3 Melhorias de UX
- [ ] Confirmação ao ativar/desativar fluxos
- [ ] Indicadores visuais de status (ativo/inativo)
- [ ] Tooltips explicativos
- [ ] Loading states apropriados

### 5. Validações e Regras de Negócio

#### 5.1 Validações de Regra
- [ ] Nome de regra único e válido
- [ ] Pelo menos um fluxo por regra
- [ ] Máximo um fluxo ativo por regra

#### 5.2 Validações de Fluxo
- [ ] Fluxo deve pertencer a uma regra
- [ ] ID único mantido globalmente
- [ ] Metadados existentes preservados

### 6. Testes e Qualidade

#### 6.1 Testes Backend
- [ ] Testes unitários para CloudStorageService
- [ ] Testes de integração para rotas de regras
- [ ] Validação de schemas Zod

#### 6.2 Testes Frontend
- [ ] Testes unitários para hooks de regras
- [ ] Testes de componentes de regras
- [ ] Testes de integração de fluxo de navegação

## Restrições e Considerações

### Não Alterar
- [ ] Estrutura base do monorepo (turbo, pnpm, configs)
- [ ] Editor de fluxos (@gorules/jdm-editor)
- [ ] Estrutura de dados dos fluxos individuais
- [ ] Autenticação e configuração GCS

### Manter Compatibilidade
- [ ] APIs existentes de fluxos durante período de transição
- [ ] Estrutura de dados de FlowMetadata e FlowData
- [ ] Funcionalidades existentes do editor

### Padrões de Código
- [ ] TypeScript strict mode
- [ ] Componentes funcionais React
- [ ] Hooks personalizados para lógica de estado
- [ ] Validação Zod em todas as APIs
- [ ] Nomenclatura kebab-case para arquivos
- [ ] Nomenclatura PascalCase para componentes
- [ ] ESLint e Prettier configurados

## Critérios de Sucesso

1. **Funcionalidade**: Home page lista regras, navegação funciona, fluxos podem ser ativados/desativados
2. **Performance**: Carregamento rápido de regras e fluxos
3. **UX**: Interface intuitiva com feedback visual claro
4. **Compatibilidade**: Sistema anterior funciona durante migração
5. **Código**: Seguir padrões estabelecidos, testes passando
6. **Dados**: Integridade mantida, migração sem perda

## Ordem de Implementação Sugerida

1. Backend: Schemas e interfaces
2. Backend: CloudStorageService e rotas
3. Frontend: Serviços e hooks
4. Frontend: Componentes básicos
5. Frontend: Páginas e roteamento
6. Testes e refinamentos
7. Migração de dados
8. Documentação e deployment