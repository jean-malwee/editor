---
mode: agent
---

# Migrar Chamadas de API para React Query

## Objetivo
Implementar a biblioteca @tanstack/react-query para substituir as chamadas de API diretas existentes no projeto JDM Editor, melhorando o gerenciamento de estado, cache e experiência do usuário.

## Análise da Estrutura Base do Projeto

### Arquivos de Serviços Existentes
- `apps/editor/src/services/backendApiClient.ts` - Cliente principal de API
- `apps/editor/src/services/cloudStorage.ts` - Serviços de armazenamento em nuvem
- `apps/editor/src/services/flowStorage.ts` - Gerenciamento de fluxos
- `apps/editor/src/services/localStorage.ts` - Armazenamento local
- `apps/editor/src/services/storageDiagnostic.ts` - Diagnósticos de armazenamento

### Componentes que Fazem Chamadas de API
- `apps/editor/src/components/flow-list.tsx` - Lista de fluxos
- `apps/editor/src/components/flow-manager-modal.tsx` - Modal de gerenciamento de fluxos
- `apps/editor/src/components/storage-status-indicator.tsx` - Indicador de status de armazenamento
- `apps/editor/src/pages/decision-simple.tsx` - Página principal de decisão
- `apps/editor/src/pages/home.tsx` - Página inicial

## Requisitos de Implementação

### 1. Configuração do React Query
- Criar um QueryClient configurado com settings apropriados
- Implementar QueryClientProvider no ponto de entrada da aplicação (main.tsx)
- Configurar cache, retry policies e stale time adequados para o contexto da aplicação

### 2. Criação de Hooks Customizados
Criar hooks específicos para cada operação de API:
- `useFlows()` - Buscar lista de fluxos
- `useFlow(id)` - Buscar fluxo específico
- `useCreateFlow()` - Criar novo fluxo
- `useUpdateFlow()` - Atualizar fluxo existente
- `useDeleteFlow()` - Deletar fluxo
- `useSimulateFlow()` - Simular execução de fluxo
- `useStorageStatus()` - Verificar status do armazenamento

### 3. Implementação de Mutations
- Configurar mutations para operações de escrita (POST, PUT, DELETE)
- Implementar invalidação de cache após mutations bem-sucedidas
- Adicionar tratamento de erro apropriado
- Implementar feedback visual para operações em andamento

### 4. Migração dos Componentes
Substituir chamadas diretas de API nos componentes por hooks do React Query:
- Remover useState para loading states
- Remover useEffect para chamadas de API
- Implementar error boundaries onde necessário
- Manter a mesma interface de usuário existente

## Boas Práticas de Codificação

### Estrutura de Código
- Criar diretório `hooks/` dentro de `src/` para hooks customizados
- Manter separação clara entre lógica de API e componentes UI
- Usar TypeScript rigorosamente com tipos existentes do pacote schemas
- Seguir padrões de nomenclatura estabelecidos no projeto

### Performance e Cache
- Configurar stale time apropriado para diferentes tipos de dados
- Implementar cache invalidation inteligente
- Usar background refetch para melhorar UX
- Configurar retry logic para falhas de rede

### Tratamento de Erros
- Manter compatibilidade com sistema de notificação existente (Ant Design)
- Implementar fallbacks apropriados para estados de erro
- Preservar mensagens de erro específicas do backend

### Tipagem TypeScript
- Usar tipos existentes do pacote `@repo/schemas`
- Criar tipos específicos para responses de API quando necessário
- Manter type safety em todas as operações

## Restrições

### Não Alterar
- Estrutura de pastas existente do projeto
- APIs do backend (manter compatibilidade total)
- Interface de usuário existente
- Lógica de negócio core
- Configurações de build (Vite, TypeScript, etc.)

### Manter Compatibilidade
- Funcionamento com Google Cloud Storage
- Sistema de temas existente
- Navegação e roteamento atuais
- Validação com Zod existente

## Critérios de Sucesso

### Funcionalidade
- Todas as operações de API continuam funcionando identicamente
- Loading states melhorados com indicadores visuais
- Error handling mantido ou melhorado
- Performance igual ou superior às chamadas diretas

### Qualidade do Código
- Zero erros de TypeScript
- Conformidade com ESLint e Prettier existentes
- Hooks reutilizáveis e bem documentados
- Testes de integração passando

### User Experience
- Interface responsiva durante operações de API
- Feedback visual adequado para todas as ações
- Estados de erro informativos
- Cache inteligente reduzindo chamadas desnecessárias

## Documentação da Biblioteca
Referência: https://tanstack.com/query/latest/docs/framework/react/overview

## Observações Importantes
- A biblioteca @tanstack/react-query já está instalada no projeto
- Manter backward compatibility total
- Não utilizar emojis no código ou comentários
- Seguir padrões de commit do projeto (conventional commits)
- Testar todas as funcionalidades após a migração