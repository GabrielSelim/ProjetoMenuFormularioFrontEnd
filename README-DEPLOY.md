# Deploy Simples do Frontend

## Como fazer deploy no servidor:

```bash
# 1. Clonar/atualizar o código
git pull origin main

# 2. Fazer build e deploy
docker-compose up -d --build
```

## URLs:
- **Local:** http://localhost:3001
- **Produção:** http://formsmenu.gabrielsanztech.com.br

## Comandos úteis:

```bash
# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Status
docker-compose ps
```

Pronto! Só isso. 🚀