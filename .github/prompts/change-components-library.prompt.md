---
mode: agent
---

# Migração da Biblioteca de Componentes - Projeto React Editor

## Contexto do Projeto

Este prompt tem como objetivo migrar completamente a biblioteca de componentes do projeto React localizado em `/apps/editor/` de Ant Design para as novas bibliotecas:
- **@mlw-packages/react-components** para componentes UI
- **@phosphor-icons/react** para ícones

## Dependências Removidas

As seguintes dependências foram removidas do projeto e não devem mais ser utilizadas:
- `@ant-design/icons`
- `antd`

## Estado Atual da Migração

- As novas bibliotecas (`@mlw-packages/react-components` e `@phosphor-icons/react`) já estão instaladas
- Alguns componentes já foram migrados para as novas bibliotecas
- Existem ainda arquivos com dependências das bibliotecas antigas que precisam ser corrigidos

## Análise dos Arquivos com Erros de Dependência

### Arquivos que ainda importam `antd`:
1. `/apps/editor/src/hooks/useFlows.ts` - importa `message`
2. `/apps/editor/src/hooks/useRules.ts` - importa `message`
3. `/apps/editor/src/context/theme.provider.tsx` - importa `ConfigProvider, theme`
4. `/apps/editor/src/components/rule-creation-modal.tsx` - importa `Modal, Form, Input, Button, message`
5. `/apps/editor/src/components/rule-edit-modal.tsx` - importa `Modal, Form, Input, Button, message`
6. `/apps/editor/src/pages/home.tsx` - importa `Button, Input, Select, Space, Typography, Empty, Spin, Alert`
7. `/apps/editor/src/pages/rule-details.tsx` - importa `Button, Typography, Space, Breadcrumb, Spin, Alert, Card`
8. `/apps/editor/src/pages/not-found.tsx` - importa `Button, Result`
9. `/apps/editor/src/pages/decision-simple.tsx` - importa `Button, Divider, Dropdown, message, Modal, theme, Typography`
10. `/apps/editor/src/components/flow-list-by-rule.tsx` - importa `Button, Typography, Tag, Empty, Space, Card`
11. `/apps/editor/src/components/active-flow-indicator.tsx` - importa `Tag, Tooltip`
12. `/apps/editor/src/components/rule-list.tsx` - importa `Empty, Input, Select, Space, Typography, Spin, Alert`
13. `/apps/editor/src/helpers/error-message.ts` - importa `message`

### Arquivos que ainda importam `@ant-design/icons`:
1. `/apps/editor/src/pages/decision-simple.tsx` - importa `BulbOutlined, CheckOutlined, PlayCircleOutlined`
2. `/apps/editor/src/pages/home.tsx` - importa `PlusOutlined, SearchOutlined, AppstoreOutlined, UnorderedListOutlined`
3. `/apps/editor/src/pages/rule-details.tsx` - importa `ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined`
4. `/apps/editor/src/components/active-flow-indicator.tsx` - importa `PlayCircleOutlined, PauseCircleOutlined`
5. `/apps/editor/src/components/flow-list-by-rule.tsx` - importa `PlayCircleOutlined`
6. `/apps/editor/src/components/rule-list.tsx` - importa `SearchOutlined`

## Mapeamento de Componentes

### Componentes da Biblioteca @mlw-packages/react-components

**Componentes Base:**
- `ButtonBase as Button` - substitui `Button` do antd
- `CardBase as Card` - substitui `Card` do antd
- `SidebarMenuBadgeBase as Badge` - substitui `Badge` do antd
- `toast` - substitui `message` do antd

**Componentes de Modal/Dialog:**
- `DialogBase` - substitui `Modal` do antd
- `DialogHeaderBase` - cabeçalho do modal
- `DialogTitleBase` - título do modal
- `DialogContentBase` - conteúdo do modal
- `DialogFooterBase` - rodapé do modal
- `AlertDialogBase` - para confirmações
- `AlertDialogTriggerBase`
- `AlertDialogContentBase`
- `AlertDialogHeaderBase`
- `AlertDialogTitleBase`
- `AlertDialogDescriptionBase`
- `AlertDialogFooterBase`
- `AlertDialogActionBase`
- `AlertDialogCancelBase`

**Componentes de Tooltip:**
- `TooltipBase as Tooltip` - substitui `Tooltip` do antd
- `TooltipContentBase as TooltipContent`
- `TooltipProviderBase as TooltipProvider`
- `TooltipTriggerBase as TooltipTrigger`

### Ícones da Biblioteca @phosphor-icons/react

**Mapeamento de Ícones Ant Design para Phosphor:**
- `PlusOutlined` → `Plus`
- `SearchOutlined` → `MagnifyingGlass`
- `AppstoreOutlined` → `GridFour`
- `UnorderedListOutlined` → `List`
- `ArrowLeftOutlined` → `ArrowLeft`
- `EditOutlined` → `PencilSimple`
- `DeleteOutlined` → `Trash`
- `PlayCircleOutlined` → `PlayCircle`
- `PauseCircleOutlined` → `PauseCircle`
- `BulbOutlined` → `Lightbulb`
- `CheckOutlined` → `Check`

## Componentes que Devem ser Adicionados

Para completar a migração, será necessário implementar ou mapear componentes equivalentes para:

### Componentes de Entrada:
- `Input` - implementar componente de entrada baseado em `@mlw-packages/react-components`
- `Select` - implementar componente de seleção
- `Form` - implementar sistema de formulários

### Componentes de Layout:
- `Space` - implementar componente de espaçamento
- `Typography` (`Title`, `Text`) - implementar componentes de tipografia
- `Empty` - implementar estado vazio
- `Spin` - implementar indicador de carregamento
- `Alert` - implementar componente de alerta
- `Divider` - implementar divisor
- `Breadcrumb` - implementar navegação breadcrumb
- `Dropdown` - implementar dropdown
- `Tag` - implementar tags/badges

### Componentes de Sistema:
- `ConfigProvider` - implementar provedor de configuração para temas
- `Result` - implementar página de resultado

## Componentes que Devem ser Removidos

Remover todas as importações e referências dos seguintes componentes do Ant Design:
- Todos os componentes listados nas importações dos arquivos com erro
- Remover completamente as importações `from 'antd'`
- Remover completamente as importações `from '@ant-design/icons'`

## Estrutura de Implementação

### 1. Sistema de Notificações
- Substituir `message` do antd por `toast` da nova biblioteca
- Atualizar todos os hooks e helpers que usam notificações

### 2. Sistema de Temas
- Migrar `ConfigProvider` e `theme` do antd para sistema equivalente
- Manter funcionalidade de tema claro/escuro

### 3. Componentes de Interface
- Migrar modais para `DialogBase` e componentes relacionados
- Migrar tooltips para sistema `TooltipBase`
- Migrar cards e botões para componentes base

### 4. Componentes de Formulário
- Implementar sistema de formulários compatível
- Manter validação e estados de erro

## Diretrizes de Implementação

### Boas Práticas:
1. **Consistência**: Manter o mesmo padrão de importação usado nos arquivos já migrados
2. **Compatibilidade**: Preservar todas as funcionalidades existentes
3. **Performance**: Otimizar imports para reduzir bundle size
4. **TypeScript**: Manter tipagem forte em todos os componentes
5. **Acessibilidade**: Garantir que os novos componentes mantêm padrões de acessibilidade

### Padrão de Importação:
```typescript
// Componentes da nova biblioteca
import {
  ButtonBase as Button,
  CardBase as Card,
  DialogBase as Dialog,
  toast
} from '@mlw-packages/react-components';

// Ícones da nova biblioteca
import {
  Plus,
  MagnifyingGlass,
  ArrowLeft
} from '@phosphor-icons/react';
```

### Padrão de Uso do Toast:
```typescript
// Substituir message do antd
// De: message.success('Mensagem')
// Para: toast.success('Mensagem')
```

## Arquivos Prioritários para Migração

1. **Hooks de Sistema** (`useFlows.ts`, `useRules.ts`) - migrar sistema de notificações
2. **Context de Tema** (`theme.provider.tsx`) - migrar sistema de temas
3. **Helpers** (`error-message.ts`) - migrar sistema de mensagens de erro
4. **Componentes Modais** (`rule-creation-modal.tsx`, `rule-edit-modal.tsx`) - migrar modais
5. **Páginas Principais** (`home.tsx`, `decision-simple.tsx`, `rule-details.tsx`) - migrar interface principal
6. **Componentes de Lista** (`rule-list.tsx`, `flow-list-by-rule.tsx`) - migrar listas e filtros

## Validação e Testes

Após a migração, verificar:
1. **Compilação**: Projeto deve compilar sem erros de TypeScript
2. **Funcionalidade**: Todas as features devem continuar funcionando
3. **Estilo**: Interface deve manter aparência consistente
4. **Performance**: Não deve haver degradação de performance
5. **Responsividade**: Layout deve continuar responsivo
6. **Tema**: Sistema de tema claro/escuro deve funcionar

## Estrutura de Comentários

- Usar comentários apenas quando necessário para explicar lógica complexa
- Evitar comentários óbvios sobre o que o código faz
- Focar em comentários que explicam o "porquê" ao invés do "o quê"

## Instruções Finais

1. Analisar cada arquivo listado individualmente
2. Fazer a migração preservando toda a funcionalidade existente
3. Manter a estrutura base do projeto inalterada
4. Garantir que não há quebras de compatibilidade
5. Verificar se todos os imports estão corretos
6. Testar a aplicação após cada migração
7. Não utilizar emojis nos comentários ou código
