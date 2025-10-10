# Deploy do Frontend FormEngine

Este documento contém as instruções para fazer o deploy do frontend FormEngine usando Docker.

## 🚀 Pré-requisitos

- Docker e Docker Compose instalados no servidor
- Domínio `formsmenu.gabrielsanztech.com.br` apontando para o servidor
- Proxy reverso configurado (Nginx/Traefik) para HTTPS

## 📦 Estrutura de Arquivos

```
├── frontend/
│   ├── Dockerfile              # Configuração do container
│   ├── nginx.conf             # Configuração do Nginx
│   ├── .dockerignore          # Arquivos ignorados no build
│   └── .env.production.example # Exemplo de variáveis de ambiente
├── docker-compose.yml         # Orquestração dos containers
└── deploy.sh                  # Script de deploy automatizado
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e configure as variáveis:

```bash
cp frontend/.env.production.example frontend/.env.production
```

Edite o arquivo `.env.production`:

```env
VITE_API_URL=https://formsmenuapi.gabrielsanztech.com.br
NODE_ENV=production
VITE_APP_NAME=FormEngine Frontend
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

### 2. Configuração do Domínio

O domínio `formsmenu.gabrielsanztech.com.br` deve estar configurado no seu DNS apontando para o IP do servidor.

## 🚀 Deploy

### Opção 1: Deploy Automatizado (Recomendado)

Execute o script de deploy:

```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

### Opção 2: Deploy Manual

```bash
# 1. Build da imagem (com nome específico do projeto)
docker-compose -p formsmenu-frontend-project build

# 2. Subir os containers
docker-compose -p formsmenu-frontend-project up -d

# 3. Verificar status
docker-compose -p formsmenu-frontend-project ps
```

### � Gerenciamento Seguro do Container

Para gerenciar apenas o container do FormEngine (sem afetar outros):

```bash
# Linux/Mac
chmod +x manage-frontend.sh
./manage-frontend.sh {start|stop|restart|logs|status|health}

# Windows  
manage-frontend.bat {start|stop|restart|logs|status|health}

# Exemplos:
./manage-frontend.sh status    # Ver status
./manage-frontend.sh logs      # Ver logs
./manage-frontend.sh restart   # Reiniciar
```

## 🔍 Verificação

Após o deploy, verifique se a aplicação está funcionando:

```bash
# Verificar containers rodando
docker-compose ps

# Ver logs da aplicação
docker-compose logs -f formsmenu-frontend

# Testar endpoint de saúde
curl http://localhost:3000/health
```

## 🌐 Configuração do Proxy Reverso

### Para Nginx

Adicione no seu arquivo de configuração do Nginx:

```nginx
server {
    listen 80;
    server_name formsmenu.gabrielsanztech.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name formsmenu.gabrielsanztech.com.br;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/formsmenu.gabrielsanztech.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/formsmenu.gabrielsanztech.com.br/privkey.pem;

    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Para Traefik

Se estiver usando Traefik, as labels no `docker-compose.yml` já estão configuradas.

## 🔧 Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Reiniciar a aplicação
docker-compose restart

# Parar a aplicação
docker-compose down

# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Limpar recursos não utilizados
docker system prune -f
```

## 🐛 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs formsmenu-frontend

# Verificar se a porta 3000 está livre
netstat -tlnp | grep :3000
```

### Erro de build
```bash
# Build com logs detalhados
docker-compose build --no-cache --progress=plain
```

### Aplicação não carrega
1. Verifique se o DNS está correto
2. Verifique se o proxy reverso está configurado
3. Verifique se os certificados SSL estão válidos
4. Verifique os logs do container

## 📊 Monitoramento

Para monitorar a aplicação em produção:

```bash
# Status dos containers
docker-compose ps

# Recursos utilizados
docker stats

# Logs com timestamp
docker-compose logs -f --timestamps

# Health check
curl -f http://localhost:3000/health || echo "Health check failed"
```

## 🔄 Atualizações

Para atualizar a aplicação:

1. Faça git pull das mudanças
2. Execute o script de deploy: `./deploy.sh`
3. Verifique se a aplicação está funcionando

## 🛡️ Segurança

- O Nginx está configurado com headers de segurança
- Use sempre HTTPS em produção
- Mantenha o Docker e as dependências atualizadas
- Configure backup regular dos dados se necessário

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs: `docker-compose logs -f`
2. Verifique o status: `docker-compose ps`
3. Teste a conectividade: `curl http://localhost:3000/health`