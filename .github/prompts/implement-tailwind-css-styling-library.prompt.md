# Migração da Biblioteca de Estilização para Tailwind CSS

## Objetivo

Migrar o projeto React localizado em `/apps/editor/` para utilizar Tailwind CSS como biblioteca principal de estilização, substituindo os módulos CSS existentes e otimizando a configuração para o ambiente de desenvolvimento e produção.

## Análise da Estrutura Base do Projeto

### Estrutura Atual
- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite com hot module replacement
- **UI Library**: @mlw-packages/react-components (componentes base)
- **Estilização Atual**: CSS Modules (*.module.css) e CSS global (main.css)
- **Dependência Existente**: tailwindcss@4.1.11 (já instalado mas não configurado)

### Componentes com CSS Modules Identificados
- `flow-card.module.css` e `flow-card.tsx`
- `rule-card.module.css` e `rule-card.tsx`
- `flow-list.module.css` e `flow-list.tsx`
- `flow-list-by-rule.module.css` e `flow-list-by-rule.tsx`
- `rule-list.module.css` e `rule-list.tsx`
- `decision-simple.module.css` e `decision-simple.tsx`
- `rule-details.module.css` e páginas relacionadas
- `home.module.css` e páginas relacionadas

## Configuração do Tailwind CSS

### Dependências a Adicionar
```json
{
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.12"
  }
}
```

### Dependências a Manter
- `tailwindcss@4.1.11` (já existe)
- `@mlw-packages/react-components` (componentes base mantidos)
- `@phosphor-icons/react` (ícones)

### Arquivos de Configuração a Criar

#### 1. `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        border: '#d9d9d9',
        background: '#ffffff',
        foreground: '#262626',
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#8c8c8c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(2px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: ['class', '[data-theme="dark"]'],
}
```

#### 2. `postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 3. Atualizar `src/main.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
}

.grl-dn__header__icon {
  box-sizing: content-box;
}

body[data-theme="dark"] {
  @apply bg-gray-900 text-white;
}

body[data-theme="light"] {
  @apply bg-white text-gray-900;
}

@layer components {
  .card-hover {
    @apply transition-all duration-200 ease-in-out hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5;
  }
  
  .text-ellipsis-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

#### 4. Atualizar `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import wasm from 'vite-plugin-wasm';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import * as path from 'path';

export default defineConfig({
  plugins: [react(), wasm()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  // ... resto da configuração
});
```

## Componentes a Modificar

### 1. `flow-card.tsx`
- Remover import de `flow-card.module.css`
- Substituir todas as classes CSS modules por classes Tailwind
- Manter estrutura de componente e funcionalidades
- Aplicar responsividade com classes Tailwind

### 2. `rule-card.tsx`
- Remover import de `rule-card.module.css`
- Migrar estilos de hover, layout e cores para Tailwind
- Manter comportamento de click e interações

### 3. `flow-list.tsx` e `flow-list-by-rule.tsx`
- Remover imports de CSS modules correspondentes
- Migrar grid/list layouts para Tailwind Grid e Flexbox
- Implementar responsividade nativa do Tailwind

### 4. `rule-list.tsx`
- Remover import de `rule-list.module.css`
- Migrar estilos de lista e cards para classes Tailwind
- Manter funcionalidade de ordenação e filtros

### 5. `decision-simple.tsx`
- Remover import de `decision-simple.module.css`
- Migrar layout de página principal para Tailwind
- Implementar sidebar responsiva com classes Tailwind

### 6. Páginas `rule-details.tsx` e `home.tsx`
- Remover imports de CSS modules respectivos
- Migrar layouts de página para Tailwind
- Implementar design responsivo

## Componentes a Adicionar

### 1. `src/components/ui/card.tsx`
```typescript
// Wrapper customizado para cards com variantes Tailwind
interface CardProps {
  variant?: 'default' | 'hoverable' | 'selected';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}
```

### 2. `src/components/ui/badge.tsx`
```typescript
// Badge component com variantes de cor e tamanho
interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 3. `src/components/layout/grid.tsx`
```typescript
// Grid responsivo para listas de cards
interface GridProps {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 4. `src/utils/cn.ts`
```typescript
// Utility para combinar classes condicionalmente (clsx + tailwind-merge)
export function cn(...inputs: ClassValue[]): string;
```

## Arquivos a Remover

### CSS Modules
- `src/components/flow-card.module.css`
- `src/components/rule-card.module.css`
- `src/components/flow-list.module.css`
- `src/components/flow-list-by-rule.module.css`
- `src/components/rule-list.module.css`
- `src/pages/decision-simple.module.css`
- `src/pages/rule-details.module.css`
- `src/pages/home.module.css`

## Dependências a Adicionar

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.7.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.12"
  }
}
```

## Padrões de Migração

### Classes CSS para Tailwind
```css
/* CSS Module */
.card { border-radius: 8px; border: 1px solid var(--ant-color-border); }
/* Tailwind */
className="rounded-lg border border-gray-200"

/* CSS Module */
.card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
/* Tailwind */
className="hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
```

### Layout Responsivo
```typescript
// CSS Modules
<div className={classes.grid}>
// Tailwind
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### Tema Dark/Light
```typescript
// CSS com variáveis CSS
background: var(--ant-color-bg);
// Tailwind com dark mode
className="bg-white dark:bg-gray-900"
```

## Critérios de Sucesso

### Funcionais
- Todos os componentes mantêm funcionalidade original
- Design visual permanece consistente
- Responsividade funciona em todos os breakpoints
- Tema dark/light funciona corretamente
- Performance de build mantida ou melhorada

### Técnicos
- Zero CSS modules remanescentes
- Configuração Tailwind otimizada para produção
- Classes Tailwind utilizadas de forma semântica
- Bundle size não aumenta significativamente
- Hot reload funciona corretamente

### Qualidade de Código
- Código limpo e bem organizado
- Reutilização de componentes UI
- Padrões consistentes de nomenclatura
- Comentários apenas quando necessário
- TypeScript strict mode mantido

## Boas Práticas de Implementação

1. **Migração Incremental**: Migrar um componente por vez
2. **Testes Visuais**: Verificar cada componente após migração
3. **Responsividade**: Testar em diferentes tamanhos de tela
4. **Performance**: Monitorar tamanho do bundle
5. **Consistência**: Usar utilitários customizados para padrões repetitivos
6. **Acessibilidade**: Manter contraste e navegação por teclado
7. **Documentação**: Atualizar README com nova configuração

## Estrutura Final Esperada

```
apps/editor/
├── tailwind.config.js          # Configuração Tailwind
├── postcss.config.js           # Configuração PostCSS
├── src/
│   ├── main.css                # Tailwind imports + estilos globais
│   ├── components/
│   │   ├── ui/                 # Componentes UI reutilizáveis
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── ...
│   │   ├── layout/             # Componentes de layout
│   │   │   ├── grid.tsx
│   │   │   └── ...
│   │   ├── flow-card.tsx       # Sem CSS modules
│   │   ├── rule-card.tsx       # Sem CSS modules
│   │   └── ...
│   ├── utils/
│   │   ├── cn.ts               # Utility para classes
│   │   └── ...
│   └── pages/                  # Páginas sem CSS modules
└── package.json                # Dependências atualizadas
```