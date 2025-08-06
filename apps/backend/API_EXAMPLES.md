# Exemplo de Uso da API Backend

## Configuração Inicial

1. Configure as variáveis de ambiente:
```bash
cp apps/backend/.env.example apps/backend/.env
```

2. Edite o arquivo `.env` com suas credenciais do Google Cloud.

3. Inicie o backend:
```bash
pnpm dev:backend
```

## Endpoints da API

### Listar Fluxos
```bash
curl http://localhost:3001/api/flows
```

### Criar/Salvar Fluxo
```bash
curl -X POST http://localhost:3001/api/flows \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "nodes": [],
      "edges": []
    },
    "metadata": {
      "name": "Meu Fluxo",
      "description": "Descrição do fluxo"
    }
  }'
```

### Carregar Fluxo Específico
```bash
curl http://localhost:3001/api/flows/{flow-id}
```

### Atualizar Metadados
```bash
curl -X PUT http://localhost:3001/api/flows/{flow-id}/metadata \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Nome",
    "description": "Nova descrição"
  }'
```

### Deletar Fluxo
```bash
curl -X DELETE http://localhost:3001/api/flows/{flow-id}
```

### Simular Execução
```bash
curl -X POST http://localhost:3001/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "input": "dados de entrada"
    },
    "content": {
      "nodes": [/* nós do fluxo */],
      "edges": [/* arestas do fluxo */]
    }
  }'
```

### Health Check
```bash
curl http://localhost:3001/health
```

## Integração com Frontend

Para usar o backend no frontend, atualize o arquivo `apps/editor/src/services/flowStorage.ts`:

```typescript
// Altere de false para true
const useCloudStorage = true;
```

E configure a URL base da API no frontend conforme necessário.
