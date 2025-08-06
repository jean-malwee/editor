#!/bin/bash

# Script para desenvolvimento local
echo "🚀 Iniciando ambiente de desenvolvimento..."

# Verifica se o pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm não encontrado. Instalando..."
    npm install -g pnpm
fi

# Instala dependências
echo "📦 Instalando dependências..."
pnpm install

# Build dos pacotes compartilhados
echo "🔨 Building packages..."
pnpm run build --filter=@jdm-editor/schemas

# Inicia o desenvolvimento em modo watch
echo "🎯 Iniciando desenvolvimento..."
pnpm run dev
