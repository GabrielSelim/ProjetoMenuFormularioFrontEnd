# Configuração Manual do Nginx

## 1. Instalar Nginx e Certbot (no servidor)

```bash
# Atualizar sistema
apt update && apt upgrade -y

# Instalar nginx
apt install nginx -y

# Instalar certbot para SSL
apt install certbot python3-certbot-nginx -y

# Verificar se nginx está rodando
systemctl status nginx


```

## 2. Criar configuração do site

```bash
# Criar arquivo de configuração
nano /etc/nginx/sites-available/formsmenu.gabrielsanztech.com.br
```

**Conteúdo do arquivo:**

```nginx
server {
    listen 80;
    server_name formsmenu.gabrielsanztech.com.br;

    # Logs
    access_log /var/log/nginx/formsmenu_access.log;
    error_log /var/log/nginx/formsmenu_error.log;

    # Proxy para o container Docker na porta 3001
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

## 3. Ativar o site

```bash
# Criar link simbólico
ln -s /etc/nginx/sites-available/formsmenu.gabrielsanztech.com.br /etc/nginx/sites-enabled/

# Testar configuração
nginx -t

# Recarregar nginx
systemctl reload nginx
```

## 4. Configurar SSL com Let's Encrypt

```bash
# Gerar certificado SSL
certbot --nginx -d formsmenu.gabrielsanztech.com.br

# O certbot vai perguntar:
# 1. Email para notificações
# 2. Aceitar termos de uso
# 3. Se quer compartilhar email (pode escolher No)
```

## 5. Verificar se está funcionando

```bash
# Ver status dos serviços
systemctl status nginx
systemctl status docker

# Ver containers rodando
docker ps

# Testar acesso local
curl -I http://localhost:3001
curl -I http://localhost
```

## 6. Configurar renovação automática do SSL

```bash
# Testar renovação
certbot renew --dry-run

# A renovação automática já fica configurada no cron
```

## 7. Comandos úteis para debug

```bash
# Ver logs do nginx
tail -f /var/log/nginx/formsmenu_access.log
tail -f /var/log/nginx/formsmenu_error.log

# Ver logs do container
docker logs formsmenu-frontend

# Reiniciar serviços se necessário
systemctl restart nginx
docker-compose restart
```

## Estrutura final:

```
Internet → Nginx (porta 80/443) → Docker Container (porta 3001)
```

**URLs finais:**
- HTTP: http://formsmenu.gabrielsanztech.com.br (redireciona para HTTPS)
- HTTPS: https://formsmenu.gabrielsanztech.com.br ✅

Execute esses comandos no seu servidor e me avise se tiver algum erro!