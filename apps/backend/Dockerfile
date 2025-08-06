# Dockerfile para o backend
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar arquivos de dependência
COPY package.json pnpm-lock.yaml ./
COPY packages/schemas/package.json ./packages/schemas/
COPY apps/backend/package.json ./apps/backend/

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY packages/schemas ./packages/schemas
COPY apps/backend ./apps/backend

# Build do projeto
RUN pnpm run build --filter=@jdm-editor/backend

# Expor porta
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["node", "apps/backend/dist/index.js"]
