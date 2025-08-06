# Prompt: Atualização de Estilização do Projeto React Editor

## Objetivo
Atualizar a estilização do projeto React Editor localizado em `/apps/editor/` para utilizar Tailwind CSS V4+ com design moderno, limpo e responsivo.

## Análise da Estrutura Atual do Projeto

### Dependências Atuais Identificadas
- `tailwindcss`: `^4.1.11` (já está na versão 4+)
- `@tailwindcss/postcss`: `^4.1.11` 
- `@mlw-packages/react-components`: `^1.4.1` (manter)
- `@phosphor-icons/react`: `^2.1.10` (manter)
- `clsx`: `^2.1.1` (manter)
- `tailwind-merge`: `^3.3.1` (manter)

### Páginas a Serem Atualizadas
Localização: `/apps/editor/src/pages/`
- `home.tsx` - Página principal com lista de regras
- `decision-simple.tsx` - Editor de decisões
- `rule-details.tsx` - Detalhes da regra
- `not-found.tsx` - Página de erro 404

### Estrutura CSS Atual
- Arquivo principal: `/apps/editor/src/main.css`
- Configuração PostCSS: `/apps/editor/postcss.config.js`
- Configuração Vite: `/apps/editor/vite.config.ts`

## Especificações Técnicas

### Dependências a Remover
- `@tailwindcss/typography`: `^0.5.16` (não necessária para o escopo)
- `autoprefixer`: `^10.4.21` (não necessária com Tailwind CSS V4+)

### Dependências a Adicionar
- `tailwindcss-animate`: Para animações suaves (se não estiver incluída no V4+)

### Configuração Tailwind CSS V4+

Criar arquivo `/apps/editor/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Syne", "sans-serif"],
      },
      colors: {
        "off-white": "#f5eee9",
        "marine-blue": "#0d1136",
        "dark-purple": "#5A37C2",
        purple: {
          DEFAULT: "#8e68ff",
          50: "#f4f2ff",
          100: "#ebe8ff",
          200: "#d9d4ff",
          300: "#beb1ff",
          400: "#9d85ff",
          500: "#8e68ff",
          600: "#6e30f7",
          700: "#601ee3",
          800: "#5018bf",
          900: "#43169c",
          950: "#280b6a",
        },
        green: {
          DEFAULT: "#55af7d",
          50: "#f0f9f3",
          100: "#daf1e1",
          200: "#b8e2c7",
          300: "#89cca4",
          400: "#55af7d",
          500: "#359462",
          600: "#25764e",
          700: "#1e5e40",
          800: "#1a4b34",
          900: "#163e2c",
          950: "#0b2318",
        },
        blue: {
          DEFAULT: "#2273e1",
          50: "#f0f8fe",
          100: "#dceefd",
          200: "#c2e1fb",
          300: "#98d0f8",
          400: "#67b6f3",
          500: "#4397ee",
          600: "#2273e1",
          700: "#2565d0",
          800: "#2452a9",
          900: "#234785",
          950: "#1a2c51",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
};
```

## Diretrizes de Design

### Layout e Responsividade
- Container principal com padding responsivo
- Grid layouts que se adaptam a diferentes tamanhos de tela
- Breakpoints: mobile-first approach
- Espaçamento consistente usando escala Tailwind

### Tipografia
- Fonte principal: Syne (já configurada)
- Hierarquia clara de títulos (text-xl, text-2xl, text-3xl)
- Peso de fonte adequado (font-medium, font-semibold)
- Altura de linha otimizada (leading-relaxed, leading-tight)

### Cores e Temas
- Suporte a tema claro e escuro (manter funcionalidade existente)
- Paleta de cores personalizada conforme especificação
- Estados de hover, focus e active bem definidos
- Contraste adequado para acessibilidade

### Componentes e Estados
- Cards com hover effects suaves
- Botões com estados visuais claros
- Loading states com spinners ou skeletons
- Transições suaves (transition-all duration-200)

### Espaçamento e Layout
- Padding e margin consistentes
- Gap entre elementos usando space-y-* e gap-*
- Alinhamento centralizado para containers principais
- Divisores visuais sutis

## Requisitos de Implementação

### Estrutura a Manter
- Não alterar a estrutura de componentes fora da pasta `pages`
- Manter todas as funcionalidades existentes
- Preservar hooks e context providers
- Manter integração com `@mlw-packages/react-components`

### Boas Práticas
- Usar `clsx` para composição condicional de classes
- Aplicar `tailwind-merge` para resolver conflitos de classes
- Utilizar comentários apenas quando necessário para clarificar lógica complexa
- Manter código limpo e legível

### Responsividade por Página
- **home.tsx**: Grid responsivo para cards de regras, sidebar colapsível
- **decision-simple.tsx**: Layout adaptável para editor de fluxo
- **rule-details.tsx**: Visualização otimizada para diferentes telas
- **not-found.tsx**: Layout centralizado e responsivo

### Componentes Permitidos
- Utilizar apenas componentes de `@mlw-packages/react-components`
- Ícones exclusivamente de `@phosphor-icons/react`
- Elementos HTML nativos estilizados com Tailwind

## Configuração de Arquivos

### Atualizar PostCSS Config
Simplificar `/apps/editor/postcss.config.js` para Tailwind V4+:

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

### Atualizar CSS Principal
Revisar `/apps/editor/src/main.css` para compatibilidade com V4+:

```css
@import "tailwindcss";

body {
  margin: 0;
  font-family: 'Syne', sans-serif;
}

.grl-dn__header__icon {
  box-sizing: content-box;
}

/* Temas mantidos */
body[data-theme="dark"] {
  background-color: theme(colors.marine-blue);
  color: theme(colors.off-white);
}

body[data-theme="light"] {
  background-color: theme(colors.off-white);
  color: theme(colors.marine-blue);
}
```

## Resultados Esperados

### Visual
- Interface moderna e limpa
- Transições suaves entre estados
- Responsividade perfeita em todos os dispositivos
- Consistência visual em toda a aplicação

### Técnico
- Código mais limpo e maintível
- Melhor performance de CSS
- Compatibilidade com Tailwind CSS V4+
- Estrutura escalável para futuras atualizações

### Funcionalidade
- Todas as funcionalidades existentes preservadas
- Tema claro/escuro funcionando
- Navegação intuitiva mantida
- Performance não degradada