@echo off
setlocal

echo 🚀 Build local rápido para testes...

REM Limpar cache se necessário
if exist "node_modules\.vite" (
    echo 🧹 Limpando cache do Vite...
    rmdir /s /q "node_modules\.vite"
)

if exist "dist" (
    echo 🗑️ Removendo build anterior...
    rmdir /s /q "dist"
)

echo 📦 Fazendo build otimizado...
set NODE_ENV=production
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

if errorlevel 1 (
    echo ❌ Falha no build local
    pause
    exit /b 1
) else (
    echo ✅ Build local concluído!
    echo 📁 Arquivos em: dist/
    echo 🌐 Para testar: npm run preview
)

pause