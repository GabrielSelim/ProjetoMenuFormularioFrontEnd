#!/bin/bash

# Script para build e deploy do frontend FormEngine
# Usa nome específico do projeto para evitar conflitos com outros containers

PROJECT_NAME="formsmenu-frontend-project"
CONTAINER_NAME="formsmenu-frontend-app"

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

# Parar e remover APENAS o container específico do FormEngine
log_info "Verificando container existente: $CONTAINER_NAME"
if docker ps -a --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    log_info "Parando e removendo container antigo: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
else
    log_info "Nenhum container anterior encontrado."
fi

# Remover apenas a rede específica se existir
if docker network ls --format "table {{.Name}}" | grep -q "^formsmenu-frontend-net$"; then
    log_info "Removendo rede específica: formsmenu-frontend-net"
    docker network rm formsmenu-frontend-net 2>/dev/null || true
fi

# Limpar apenas imagens sem tag deste projeto (mais seguro)
log_info "Limpando imagens não utilizadas do projeto..."
docker images --filter "dangling=true" -q --no-trunc | head -5 | xargs -r docker rmi 2>/dev/null || true

# Build da nova imagem
log_info "Construindo nova imagem..."
docker-compose -p $PROJECT_NAME build --no-cache

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    log_info "Build concluído com sucesso!"
else
    log_error "Falha no build. Verifique os logs acima."
    exit 1
fi

# Deploy da aplicação
log_info "Fazendo deploy da aplicação..."
docker-compose -p $PROJECT_NAME up -d

# Verificar se os containers estão rodando
sleep 5
if docker-compose -p $PROJECT_NAME ps | grep -q "Up"; then
    log_info "✅ Deploy concluído com sucesso!"
    log_info "🌐 Frontend local: http://localhost:3001"
    log_info "🌐 Frontend produção: http://formsmenu.gabrielsanztech.com.br"
    log_info "📊 Para ver os logs: docker-compose -p $PROJECT_NAME logs -f"
    log_info "🔧 Para parar: docker-compose -p $PROJECT_NAME down"
    log_info "🐳 Container: $CONTAINER_NAME"
    log_info "🔍 Health check: curl http://localhost:3001/health"
else
    log_error "❌ Falha no deploy. Verificando logs..."
    docker-compose -p $PROJECT_NAME logs
fi