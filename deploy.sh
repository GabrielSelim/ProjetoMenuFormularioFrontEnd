#!/bin/bash

# Script para build e deploy do frontend FormEngine

echo "🚀 Iniciando build e deploy do frontend FormEngine..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    log_error "Docker não está rodando. Por favor, inicie o Docker."
    exit 1
fi

# Parar e remover containers existentes
log_info "Parando containers existentes..."
docker-compose down

# Limpar imagens antigas (opcional)
log_info "Removendo imagens antigas..."
docker image prune -f

# Build da nova imagem
log_info "Construindo nova imagem..."
docker-compose build --no-cache

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    log_info "Build concluído com sucesso!"
else
    log_error "Falha no build. Verifique os logs acima."
    exit 1
fi

# Deploy da aplicação
log_info "Fazendo deploy da aplicação..."
docker-compose up -d

# Verificar se os containers estão rodando
sleep 5
if docker-compose ps | grep -q "Up"; then
    log_info "✅ Deploy concluído com sucesso!"
    log_info "🌐 Frontend disponível em: http://formsmenu.gabrielsanztech.com.br"
    log_info "📊 Para ver os logs: docker-compose logs -f"
    log_info "🔧 Para parar: docker-compose down"
else
    log_error "❌ Falha no deploy. Verificando logs..."
    docker-compose logs
fi