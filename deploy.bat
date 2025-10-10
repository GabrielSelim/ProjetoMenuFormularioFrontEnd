@echo off
setlocal

REM Definir variáveis do projeto
set PROJECT_NAME=formsmenu-frontend-project
set CONTAINER_NAME=formsmenu-frontend-app

echo 🚀 Iniciando build e deploy do frontend FormEngine...
echo 📦 Projeto: %PROJECT_NAME%

REM Verificar se Docker está rodando
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker não está rodando. Por favor, inicie o Docker.
    pause
    exit /b 1
)

REM Verificar e remover APENAS o container específico do FormEngine
echo � Verificando container existente: %CONTAINER_NAME%
docker ps -a --filter "name=%CONTAINER_NAME%" --format "{{.Names}}" | findstr /x "%CONTAINER_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo 🗑️ Parando e removendo container antigo: %CONTAINER_NAME%
    docker stop %CONTAINER_NAME% >nul 2>&1
    docker rm %CONTAINER_NAME% >nul 2>&1
) else (
    echo ✅ Nenhum container anterior encontrado.
)

REM Remover apenas a rede específica se existir
docker network ls --format "{{.Name}}" | findstr /x "formsmenu-frontend-net" >nul 2>&1
if not errorlevel 1 (
    echo 🌐 Removendo rede específica: formsmenu-frontend-net
    docker network rm formsmenu-frontend-net >nul 2>&1
)

REM Build da nova imagem com nome do projeto
echo 🔨 Construindo nova imagem...
docker-compose -p %PROJECT_NAME% build --no-cache

REM Verificar se o build foi bem-sucedido
if errorlevel 1 (
    echo ❌ Falha no build. Verifique os logs acima.
    pause
    exit /b 1
)

REM Deploy da aplicação
echo 🚀 Fazendo deploy da aplicação...
docker-compose -p %PROJECT_NAME% up -d

REM Aguardar containers iniciarem
timeout /t 5 /nobreak >nul

REM Verificar se os containers estão rodando
docker-compose -p %PROJECT_NAME% ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Falha no deploy. Verificando logs...
    docker-compose -p %PROJECT_NAME% logs
    pause
    exit /b 1
) else (
    echo ✅ Deploy concluído com sucesso!
    echo 🌐 Frontend local: http://localhost:3001
    echo 🌐 Frontend produção: http://formsmenu.gabrielsanztech.com.br
    echo 📊 Para ver os logs: docker-compose -p %PROJECT_NAME% logs -f
    echo 🔧 Para parar: docker-compose -p %PROJECT_NAME% down
    echo 🐳 Container: %CONTAINER_NAME%
    echo 🔍 Health check: http://localhost:3001/health
)

pause