@echo off
echo 🚀 Iniciando build e deploy do frontend FormEngine...

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando. Por favor, inicie o Docker.
    pause
    exit /b 1
)

REM Parar e remover containers existentes
echo 📦 Parando containers existentes...
docker-compose down

REM Build da nova imagem
echo 🔨 Construindo nova imagem...
docker-compose build --no-cache

REM Verificar se o build foi bem-sucedido
if errorlevel 1 (
    echo ❌ Falha no build. Verifique os logs acima.
    pause
    exit /b 1
)

REM Deploy da aplicação
echo 🚀 Fazendo deploy da aplicação...
docker-compose up -d

REM Aguardar containers iniciarem
timeout /t 5 /nobreak >nul

REM Verificar se os containers estão rodando
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Falha no deploy. Verificando logs...
    docker-compose logs
    pause
    exit /b 1
) else (
    echo ✅ Deploy concluído com sucesso!
    echo 🌐 Frontend disponível em: http://formsmenu.gabrielsanztech.com.br
    echo 📊 Para ver os logs: docker-compose logs -f
    echo 🔧 Para parar: docker-compose down
)

pause