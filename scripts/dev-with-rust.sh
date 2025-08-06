#!/bin/bash

# Script para executar o desenvolvimento com backend Node.js + Rust

set -e

echo "🚀 Iniciando desenvolvimento com backend Rust..."

# Função para cleanup ao sair
cleanup() {
    echo "🛑 Parando todos os processos..."
    kill $RUST_PID $NODE_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

# Configura trap para cleanup
trap cleanup SIGINT SIGTERM

# Navega para o diretório raiz do projeto
cd "$(dirname "$0")/.."

# Compila o backend Rust primeiro
echo "📦 Compilando backend Rust..."
cd apps/editor/backend
cargo build
cd ../../..

# Inicia o backend Rust
echo "🦀 Iniciando backend Rust na porta 3000..."
cd apps/editor/backend
CORS_PERMISSIVE=1 cargo run &
RUST_PID=$!
cd ../../..

# Espera o backend Rust estar pronto
echo "⏳ Aguardando backend Rust inicializar..."
sleep 3

# Verifica se o backend Rust está rodando
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ Backend Rust não iniciou corretamente"
    kill $RUST_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Backend Rust iniciado com sucesso"

# Inicia o backend Node.js
echo "🟢 Iniciando backend Node.js na porta 3001..."
cd apps/backend
RUST_BACKEND_URL=http://localhost:3000 pnpm dev &
NODE_PID=$!
cd ../..

# Espera o backend Node.js estar pronto
echo "⏳ Aguardando backend Node.js inicializar..."
sleep 3

# Inicia o frontend
echo "⚛️  Iniciando frontend na porta 5173..."
cd apps/editor
pnpm dev &
FRONTEND_PID=$!
cd ../..

echo ""
echo "🎉 Todos os serviços iniciados com sucesso!"
echo ""
echo "📊 Serviços disponíveis:"
echo "   - Frontend:      http://localhost:5173"
echo "   - Backend Node:  http://localhost:3001/api"
echo "   - Backend Rust:  http://localhost:3000/api"
echo ""
echo "🔗 Fluxo de simulação:"
echo "   Frontend → Backend Node.js (/api/simulate) → Backend Rust (/api/simulate)"
echo ""
echo "Para parar todos os serviços, pressione Ctrl+C"

# Aguarda até que um dos processos termine
wait
