---
mode: agent
---
# Implementação de Tela Home com Listagem de Fluxos

## Objetivo

Implementar uma tela home que exiba uma listagem de todos os fluxos disponíveis para edição, permitindo aos usuários navegar, visualizar e gerenciar seus fluxos de decisão de forma intuitiva.

## Análise da Estrutura Base do Projeto

### Arquitetura Atual
- **Frontend**: React com TypeScript, utilizando Vite como bundler
- **Roteamento**: React Router v6 com `createBrowserRouter`
- **UI Framework**: Ant Design para componentes visuais
- **Editor**: Biblioteca `@gorules/jdm-editor` para edição de grafos de decisão
- **Storage**: Sistema flexível com adaptador entre Local Storage e Cloud Storage
- **Schemas**: Package compartilhado `@repo/schemas` para tipagem

### Estrutura de Serviços
- `FlowStorageService`: Adaptador que permite alternar entre storage local e cloud
- `FlowMetadata`: Interface para metadados de fluxos (id, name, description, tags, etc.)
- `StorageService`: Interface padrão para operações CRUD de fluxos

### Roteamento Atual
```typescript
// apps/editor/src/main.tsx
const router = createBrowserRouter([
  { path: '/', element: <DecisionSimplePage /> },
  { path: '*', element: <NotFoundPage /> }
]);
```

## Requisitos de Implementação

### Funcionalidades Principais

1. **Listagem de Fluxos**
   - Exibir todos os fluxos salvos usando `FlowStorageService.listFlows()`
   - Mostrar informações básicas: nome, descrição, data de criação/atualização, tags
   - Implementar ordenação por nome, data de criação ou última modificação
   - Adicionar funcionalidade de busca/filtro por nome e tags

2. **Ações de Fluxo**
   - Botão para criar novo fluxo
   - Botão para editar fluxo existente (navegar para editor)
   - Botão para duplicar fluxo
   - Botão para excluir fluxo (com confirmação)
   - Visualização rápida de metadados

3. **Interface do Usuário**
   - Layout responsivo usando Ant Design
   - Cards ou lista para exibição dos fluxos
   - Indicador de status do storage (reutilizar `StorageStatusIndicator`)
   - Estados de loading, erro e lista vazia
   - Breadcrumb ou navegação clara

### Estrutura de Arquivos a Criar/Modificar

```
apps/editor/src/
├── pages/
│   ├── home.tsx                    # Nova página home com listagem
│   └── home.module.css            # Estilos específicos da home
├── components/
│   ├── flow-card.tsx              # Componente card para cada fluxo
│   ├── flow-list.tsx              # Componente lista de fluxos
│   └── flow-actions.tsx           # Componente ações do fluxo
└── main.tsx                       # Atualizar roteamento
```

### Integração com Sistema Existente

1. **Roteamento**
   - Manter `/` como rota da home
   - Criar `/editor` ou `/editor/:flowId` para o editor
   - Preservar funcionalidade de templates via query params

2. **Serviços**
   - Utilizar `FlowStorageService` existente
   - Manter compatibilidade com ambos os storage providers
   - Reutilizar componentes existentes quando possível

## Especificações Técnicas

### Tipos TypeScript
```typescript
interface FlowCardProps {
  metadata: FlowMetadata;
  onEdit: (flowId: string) => void;
  onDuplicate: (flowId: string) => void;
  onDelete: (flowId: string) => void;
}

interface FlowListProps {
  flows: FlowMetadata[];
  loading: boolean;
  onCreateNew: () => void;
}
```

### Estados de Interface
- Loading inicial dos fluxos
- Estado vazio (nenhum fluxo encontrado)
- Estado de erro na comunicação com storage
- Estados de loading para ações individuais (duplicar, excluir)

### Responsividade
- Layout em grid responsivo (1-4 colunas dependendo da tela)
- Componentes adaptáveis para mobile e desktop
- Manter consistência visual com o resto da aplicação

## Boas Práticas de Codificação

### Padrões de Código
- Seguir convenções TypeScript strict
- Usar hooks React de forma otimizada (useMemo, useCallback quando necessário)
- Implementar error boundaries para tratamento de erros
- Separar lógica de negócio dos componentes de apresentação

### Performance
- Implementar lazy loading se necessário
- Usar React.memo para componentes que re-renderizam frequentemente
- Implementar debounce para busca em tempo real
- Otimizar re-renders desnecessários

### Tratamento de Erros
- Feedback claro para o usuário em caso de erros
- Retry automático para falhas de rede
- Logging adequado para debugging
- Fallback gracioso quando storage não disponível

### Acessibilidade
- Implementar navegação por teclado
- Labels e roles ARIA apropriados
- Contraste adequado e texto legível
- Suporte a screen readers

### Testabilidade
- Componentes com responsabilidades bem definidas
- Props tipadas e documentadas
- Separação clara entre lógica e apresentação
- Estrutura que facilite testes unitários

## Restrições e Considerações

### Não Alterar Estrutura Base
- Manter sistema de storage existente
- Preservar configurações de build (Vite, TypeScript)
- Não modificar schemas existentes sem necessidade
- Manter compatibilidade com editor atual

### Integração com Componentes Existentes
- Reutilizar `PageHeader` para consistência
- Usar `ThemeContextProvider` para temas
- Aproveitar `StorageStatusIndicator` para status
- Manter padrões visuais do Ant Design

### Migração Gradual
- Implementar de forma que não quebre funcionalidade atual
- Permitir acesso ao editor direto via URL
- Manter templates funcionando
- Considerar feature flags se necessário

## Critérios de Sucesso

1. **Funcionalidade**: Usuário consegue visualizar, criar, editar e excluir fluxos
2. **Performance**: Carregamento rápido da listagem (< 2s)
3. **Usabilidade**: Interface intuitiva e responsiva
4. **Manutenibilidade**: Código bem estruturado e documentado
5. **Compatibilidade**: Funciona com ambos os storage providers
6. **Acessibilidade**: Atende padrões básicos de acessibilidade web

## Entregáveis

1. Componente de página home com listagem completa
2. Componentes reutilizáveis para cards e ações de fluxo
3. Roteamento atualizado mantendo compatibilidade
4. Estilos CSS modulares seguindo padrão do projeto
5. Documentação dos novos componentes criados
6. Tratamento adequado de estados de loading e erro
