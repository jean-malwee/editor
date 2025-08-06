#!/bin/bash

echo "🧪 Testando a estrutura do monorepo..."

# Verifica se os pacotes foram instalados corretamente
echo "📦 Verificando instalação dos pacotes..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules não encontrado"
    exit 1
fi
echo "✅ Pacotes instalados"

# Build do schemas
echo "🔨 Testando build do schemas..."
pnpm run build:schemas
if [ $? -ne 0 ]; then
    echo "❌ Falha no build do schemas"
    exit 1
fi
echo "✅ Build do schemas OK"

# Verifica se os arquivos foram gerados
if [ ! -f "packages/schemas/dist/index.js" ]; then
    echo "❌ Arquivo dist não gerado para schemas"
    exit 1
fi
echo "✅ Arquivos dist gerados"

# Teste de lint dos schemas
echo "🔍 Testando lint do schemas..."
cd packages/schemas
pnpm run lint
if [ $? -ne 0 ]; then
    echo "❌ Falha no lint do schemas"
    exit 1
fi
cd ../..
echo "✅ Lint do schemas OK"

# Build do backend
echo "🔨 Testando build do backend..."
pnpm run build:backend
if [ $? -ne 0 ]; then
    echo "❌ Falha no build do backend"
    exit 1
fi
echo "✅ Build do backend OK"

# Build do editor
echo "🔨 Testando build do editor..."
pnpm run build:editor
if [ $? -ne 0 ]; then
    echo "❌ Falha no build do editor"
    exit 1
fi
echo "✅ Build do editor OK"

echo ""
echo "🎉 Todos os testes passaram! Estrutura do monorepo está funcionando corretamente."
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente para o backend (.env)"
echo "2. Execute 'pnpm dev' para iniciar o desenvolvimento"
echo "3. Acesse http://localhost:5173 para o frontend"
echo "4. Acesse http://localhost:3001 para o backend"
