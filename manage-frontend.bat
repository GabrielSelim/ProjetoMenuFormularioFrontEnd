@echo off
setlocal

set PROJECT_NAME=formsmenu-frontend-project
set CONTAINER_NAME=formsmenu-frontend-app

if "%1"=="start" goto START
if "%1"=="stop" goto STOP
if "%1"=="restart" goto RESTART
if "%1"=="logs" goto LOGS
if "%1"=="status" goto STATUS
if "%1"=="health" goto HEALTH
goto HELP

:START
echo 🚀 Iniciando container FormEngine Frontend...
docker-compose -p %PROJECT_NAME% up -d
goto END

:STOP
echo 🛑 Parando container FormEngine Frontend...
docker stop %CONTAINER_NAME% >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Container não estava rodando
) else (
    echo ✅ Container parado com sucesso
)
goto END

:RESTART
echo 🔄 Reiniciando container FormEngine Frontend...
docker-compose -p %PROJECT_NAME% restart
goto END

:LOGS
echo 📋 Logs do container FormEngine Frontend...
docker-compose -p %PROJECT_NAME% logs -f
goto END

:STATUS
echo 📊 Status do container FormEngine Frontend...
docker-compose -p %PROJECT_NAME% ps
echo.
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | findstr "%CONTAINER_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Container está rodando
    echo 🌐 Acesso local: http://localhost:3001
    echo 🔍 Health check: http://localhost:3001/health
) else (
    echo ❌ Container não está rodando
)
goto END

:HEALTH
echo 🩺 Verificando saúde da aplicação...
Invoke-WebRequest -Uri http://localhost:3001/health -UseBasicParsing >nul 2>&1
if not errorlevel 1 (
    echo ✅ Aplicação está saudável
) else (
    echo ❌ Aplicação não está respondendo
)
goto END

:HELP
echo 🔧 Script de gerenciamento do FormEngine Frontend
echo.
echo Uso: %0 {start^|stop^|restart^|logs^|status^|health}
echo.
echo Comandos disponíveis:
echo   start   - Inicia o container
echo   stop    - Para o container (SEGURO - só este container)
echo   restart - Reinicia o container
echo   logs    - Mostra logs em tempo real
echo   status  - Mostra status do container
echo   health  - Testa se a aplicação está funcionando
echo.
echo 🛡️  Este script é SEGURO e só afeta o container FormEngine Frontend

:END
pause