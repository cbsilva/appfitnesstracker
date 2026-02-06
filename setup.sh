#!/bin/bash

# Fitness Tracker - Setup Script
# Este script configura o ambiente de desenvolvimento completo

echo "🏋️ Fitness Tracker - Setup do Projeto"
echo "====================================="

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar se Node.js está instalado
echo ""
echo "Verificando dependências..."
if command -v node &> /dev/null; then
    print_success "Node.js encontrado: $(node --version)"
else
    print_error "Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

if command -v npm &> /dev/null; then
    print_success "npm encontrado: $(npm --version)"
else
    print_error "npm não encontrado"
    exit 1
fi

if command -v psql &> /dev/null; then
    print_success "PostgreSQL encontrado"
else
    print_warning "PostgreSQL não encontrado. Você pode instalá-lo separadamente"
fi

# Instalar dependências do backend
echo ""
echo "Instalando dependências do backend..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_success "Backend pronto"
else
    print_error "Erro ao instalar dependências do backend"
    exit 1
fi

# Criar arquivo .env do backend
if [ ! -f .env ]; then
    print_warning "Criando arquivo .env do backend"
    cp .env.example .env
    echo "Por favor, edite backend/.env com suas credenciais do PostgreSQL"
fi

cd ..

# Instalar dependências do frontend
echo ""
echo "Instalando dependências do frontend..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Frontend pronto"
else
    print_error "Erro ao instalar dependências do frontend"
    exit 1
fi

# Criar arquivo .env do frontend
if [ ! -f .env ]; then
    print_warning "Criando arquivo .env do frontend"
    cp .env.example .env
fi

cd ..

print_success "Setup completo!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o banco de dados PostgreSQL em backend/.env"
echo "2. Inicie o backend: cd backend && npm run dev"
echo "3. Em outro terminal, inicie o frontend: cd frontend && npm run dev"
echo "4. Acesse http://localhost:3000"
echo ""
