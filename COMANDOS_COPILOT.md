# 🤖 COMANDOS RÁPIDOS PARA GITHUB COPILOT

## ⚡ COMANDOS ESSENCIAIS

### 🔥 Build + Servidor (Método Mais Rápido)
```javascript
// Use estes comandos exatos no Copilot:

// 1. Para Desenvolvimento
run_in_terminal(".\frontend\start-dev.bat", "Iniciando servidor de desenvolvimento", true)
open_simple_browser("http://localhost:5173/")

// 2. Para Build de Produção  
run_in_terminal(".\frontend\build-local.bat", "Fazendo build de produção", false)
```

### 🎯 Build Manual (Se scripts .bat falharem)
```javascript
// Sequência correta:
run_in_terminal("cd c:\\Users\\gabriel\\source\\repos\\GabrielSelim\\ProjetoMenuFormularioFrontEnd\\frontend", "Navegando para frontend", false)
run_in_terminal("npm run build", "Executando build", false)
```

### 📁 Verificação de Diretório
```javascript
// SEMPRE verifique primeiro:
run_in_terminal("pwd", "Verificando diretório atual", false)
// Deve retornar: C:\Users\gabriel\source\repos\GabrielSelim\ProjetoMenuFormularioFrontEnd\frontend
```

## 🚨 ERROS MAIS COMUNS

### ❌ "Could not read package.json"
**Problema**: Executando no diretório errado  
**Solução**:
```javascript
run_in_terminal("cd frontend", "Corrigindo diretório", false)
```

### ❌ Terminal no diretório raiz
**Problema**: `C:\Users\gabriel\source\repos\GabrielSelim\ProjetoMenuFormularioFrontEnd>`  
**Solução**:
```javascript
run_in_terminal("cd frontend", "Entrando na pasta frontend", false)
```

## ✅ VERIFICAÇÕES DE SUCESSO

### Build Concluído:
- ✓ `16203 modules transformed`
- ✓ `built in 50-60s`
- ✓ `dist/index.html` criado
- ✓ `dist/assets/index-[hash].js` (~6MB)

### Servidor Rodando:
- ✓ `VITE v7.1.9 ready in ~500ms`
- ✓ `Local: http://localhost:5173/`

## 🎨 CONTEXTO DO PROJETO

### Tecnologias:
- **React 18.3.1**
- **Vite 7.1.9** 
- **Material-UI 7.3.4**
- **FormEngine.io 7.3.0** (6MB, normal)
- **TypeScript**

### Estrutura:
```
ProjetoMenuFormularioFrontEnd/
└── frontend/  ← TRABALHAR AQUI SEMPRE
    ├── package.json
    ├── start-dev.bat
    ├── build-local.bat
    └── src/
```

### Layout Atual:
- **Sidebar**: 260px largura
- **Dashboard**: marginLeft 260px (sem espaço extra)
- **Responsivo**: Mobile com hamburger menu

## 🔧 COMANDOS DE EMERGÊNCIA

### Se tudo falhar:
```javascript
// Reset completo
run_in_terminal("cd c:\\Users\\gabriel\\source\\repos\\GabrielSelim\\ProjetoMenuFormularioFrontEnd", "Vai para raiz", false)
run_in_terminal("cd frontend", "Entra no frontend", false)
run_in_terminal("npm install", "Reinstala dependências", false)
run_in_terminal("npm run build", "Build final", false)
```

## 📱 TESTING CHECKLIST

### Login de Teste:
- **Email**: admin@test.com
- **Senha**: admin123

### Verificar:
- [ ] Dashboard sem espaçamento excessivo
- [ ] FormEngine.io funcionando (drag & drop)
- [ ] Sidebar responsiva
- [ ] Menus dinâmicos carregando

---

**🎯 REGRA DE OURO**: NUNCA execute `npm` no diretório raiz, SEMPRE na pasta `frontend/`!