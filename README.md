# JDM Editor Monorepo

Um editor de regras de decisão (JDM - JSON Decision Model) organizado como monorepo com Turbo, contendo frontend, backend e tipos compartilhados.

## 📁 Estrutura do Projeto

```
├── apps/
│   ├── editor/          # Frontend React com Vite
│   └── backend/         # Backend API com Fastify
├── packages/
│   └── schemas/         # Tipos TypeScript compartilhados
├── configs/
│   ├── eslint-config/   # Configuração ESLint compartilhada
│   ├── prettier-config/ # Configuração Prettier compartilhada
│   └── typescript-config/ # Configuração TypeScript compartilhada
└── scripts/             # Scripts utilitários
```

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- pnpm 8+

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd editor

# Execute o script de setup
./scripts/dev-setup.sh

# Ou manualmente:
pnpm install
pnpm run build --filter=@jdm-editor/schemas
pnpm run dev
```

## 📦 Pacotes

### `@jdm-editor/schemas`
Tipos TypeScript compartilhados entre frontend e backend:
- Interfaces de fluxo e metadados
- Tipos de nós e arestas de decisão
- Schemas de validação

### `apps/editor` 
Frontend React com:
- Editor visual de fluxos de decisão
- Integração com Google Cloud Storage
- Simulador de execução
- Interface moderna com Ant Design

### `apps/backend`
Backend API com:
- Fastify para alta performance
- Integração com Google Cloud Storage
- Validação de entrada com Zod
- Endpoints RESTful para gerenciamento de fluxos

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia todos os apps em modo dev
pnpm dev:editor       # Apenas o frontend
pnpm dev:backend      # Apenas o backend

# Build
pnpm build            # Build de todos os pacotes
pnpm build:schemas    # Build apenas dos schemas
pnpm build:editor     # Build apenas do frontend
pnpm build:backend    # Build apenas do backend

# Linting e formatação
pnpm lint             # Lint em todos os pacotes
pnpm format           # Formatar código
pnpm type-check       # Verificação de tipos

# Limpeza
pnpm clean            # Limpa builds e node_modules
```

## 🔧 Configuração

### Google Cloud Storage (Backend)

Crie um arquivo `.env` no diretório `apps/backend/`:

```env
GCS_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=editor-flows-bucket
GCS_KEY_FILENAME=path/to/service-account-key.json
PORT=3001
```

### Desenvolvimento Local

O frontend por padrão usa localStorage. Para usar Google Cloud Storage:

1. Configure as variáveis de ambiente no backend
2. Altere `useCloudStorage = true` em `apps/editor/src/services/flowStorage.ts`
3. Configure as variáveis no frontend (`.env.local`):

```env
REACT_APP_GCS_BUCKET_NAME=editor-flows-bucket
REACT_APP_GCS_PROJECT_ID=your-project-id
```

## 🐳 Docker

```bash
# Build da imagem do backend
docker build -f apps/backend/Dockerfile -t jdm-editor-backend .

# Executar container
docker run -p 3001:3001 -e GCS_PROJECT_ID=your-project jdm-editor-backend
```

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
cd apps/editor
pnpm build
# Deploy da pasta dist/
```

### Backend (Cloud Run/Railway)
```bash
cd apps/backend
pnpm build
pnpm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [Documentação do Turbo](https://turbo.build/repo/docs)
- [GoRules JDM Editor](https://github.com/gorules/jdm-editor)
- [Fastify Documentation](https://fastify.dev/)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
