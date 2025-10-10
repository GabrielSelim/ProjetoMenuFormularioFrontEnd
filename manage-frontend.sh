#!/bin/bash

# Script SEGURO para gerenciar APENAS o container FormEngine Frontend
# NÃO afeta outros containers do sistema

PROJECT_NAME="formsmenu-frontend-project"
CONTAINER_NAME="formsmenu-frontend-app"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

case "$1" in
    "start")
        log_info "🚀 Iniciando container FormEngine Frontend..."
        docker-compose -p $PROJECT_NAME up -d
        ;;
        
    "stop")
        log_info "🛑 Parando container FormEngine Frontend..."
        docker stop $CONTAINER_NAME 2>/dev/null || log_warn "Container não estava rodando"
        ;;
        
    "restart")
        log_info "🔄 Reiniciando container FormEngine Frontend..."
        docker-compose -p $PROJECT_NAME restart
        ;;
        
    "logs")
        log_info "📋 Logs do container FormEngine Frontend..."
        docker-compose -p $PROJECT_NAME logs -f
        ;;
        
    "status")
        log_info "📊 Status do container FormEngine Frontend..."
        docker-compose -p $PROJECT_NAME ps
        echo
        if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q "$CONTAINER_NAME"; then
            log_info "✅ Container está rodando"
            log_info "🌐 Acesso local: http://localhost:3001"
            log_info "🔍 Health check: curl http://localhost:3001/health" 
        else
            log_warn "❌ Container não está rodando"
        fi
        ;;
        
    "health")
        log_info "🩺 Verificando saúde da aplicação..."
        if curl -s http://localhost:3001/health > /dev/null; then
            log_info "✅ Aplicação está saudável"
        else
            log_error "❌ Aplicação não está respondendo"
        fi
        ;;
        
    *)
        echo "🔧 Script de gerenciamento do FormEngine Frontend"
        echo
        echo "Uso: $0 {start|stop|restart|logs|status|health}"
        echo
        echo "Comandos disponíveis:"
        echo "  start   - Inicia o container"
        echo "  stop    - Para o container (SEGURO - só este container)"
        echo "  restart - Reinicia o container"
        echo "  logs    - Mostra logs em tempo real"
        echo "  status  - Mostra status do container"
        echo "  health  - Testa se a aplicação está funcionando"
        echo
        echo "🛡️  Este script é SEGURO e só afeta o container FormEngine Frontend"
        exit 1
        ;;
esac