# Script para remover console.log do projeto

## Arquivos que contêm console.log para limpar:

### API Services
- api/formService.js ✅ (parcialmente limpo)
- api/authService.js
- api/menuService.js
- api/axiosConfig.js

### Components
- components/Sidebar.jsx ✅ (parcialmente limpo)
- components/FormEngineRenderer.jsx
- components/FormBuilderSimple.jsx  
- components/FormViewerSimple.jsx
- components/FormBuilderMinimal.jsx
- components/FormBuilderDoc.jsx
- components/FormBuilderTest.jsx
- components/FormBuilderAlternative.jsx
- components/TestComponents.jsx

### Pages
- pages/MenuManager.jsx
- pages/FormList.jsx
- pages/FormBuilderAdvanced.jsx
- pages/FormView.jsx
- pages/Dashboard.jsx

### Context
- context/AuthContext.jsx
- context/MenuContext.jsx

## Estratégia:
1. **Manter apenas console.error** para erros críticos
2. **Remover todos console.log** (debug/info)
3. **Remover console.warn** que não são críticos
4. **Manter try/catch** mas sem logs desnecessários

## Console.log a manter (se necessário):
- Erros críticos de autenticação
- Erros de conexão com API
- Erros de parse de dados importantes

## Console.log a remover:
- Debug de formulários
- Debug de navegação
- Debug de dados do usuário
- Logs de desenvolvimento
- Logs de preview/carregamento