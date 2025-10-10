# Sistema de Formulários - Frontend React

Um sistema completo de gestão de formulários dinâmicos desenvolvido em React 18+ com Material UI, integrado com API ASP.NET Core.

## 🚀 Características

- ✅ **Interface Moderna**: Construído com React 18+ e Material UI
- ✅ **Menu Dinâmico**: Sistema de navegação baseado em roles de usuário
- ✅ **Construtor de Formulários**: Interface drag-and-drop para criar formulários personalizados
- ✅ **Autenticação JWT**: Sistema completo de login e controle de acesso
- ✅ **Gerenciamento de Estado**: Context API e React Query
- ✅ **Responsivo**: Design adaptável para desktop e mobile
- ✅ **TypeScript Ready**: Configurado para suportar JavaScript e TypeScript

## 🛠️ Tecnologias Utilizadas

- **React 18+** - Biblioteca principal
- **Material UI** - Componentes e tema
- **React Router DOM** - Navegação
- **Axios** - Cliente HTTP
- **React Hook Form** - Manipulação de formulários
- **React Query** - Gerenciamento de estado do servidor
- **React Beautiful DnD** - Drag and drop
- **Vite** - Build tool

## 📋 Pré-requisitos

- Node.js 16+ 
- npm ou yarn
- API ASP.NET Core rodando em `http://localhost:5000`

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd ProjetoMenuFormularioFrontEnd/frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a API**
   - Certifique-se de que a API ASP.NET Core está rodando em `http://localhost:5000`
   - As configurações da API estão em `src/api/axiosConfig.js`

4. **Execute o projeto**
   ```bash
   npm run dev
   ```
   
   O sistema estará disponível em `http://localhost:5173`

## 🏗️ Estrutura do Projeto

```
src/
├── api/                    # Configurações e serviços da API
│   ├── axiosConfig.js     # Configuração do Axios
│   ├── authService.js     # Serviços de autenticação
│   ├── menuService.js     # Serviços de menu
│   └── formService.js     # Serviços de formulários
├── components/            # Componentes reutilizáveis
│   ├── Header.jsx         # Cabeçalho da aplicação
│   ├── Sidebar.jsx        # Menu lateral
│   ├── ProtectedRoute.jsx # Proteção de rotas
│   └── FormRenderer.jsx   # Renderizador de formulários
├── context/              # Contextos da aplicação
│   ├── AuthContext.jsx   # Context de autenticação
│   └── MenuContext.jsx   # Context de menus
├── pages/                # Páginas da aplicação
│   ├── Login.jsx         # Página de login
│   ├── Dashboard.jsx     # Dashboard principal
│   ├── MenuManager.jsx   # Gerenciamento de menus
│   ├── FormBuilderPage.jsx # Construtor de formulários
│   ├── FormList.jsx      # Lista de formulários
│   └── FormView.jsx      # Visualização de formulários
├── styles/               # Estilos globais
│   └── global.css        # CSS global
├── App.jsx               # Componente principal
└── main.jsx              # Ponto de entrada
```

## 👥 Sistema de Usuários

O sistema possui diferentes tipos de usuário com permissões específicas:

### Administrador (admin)
- Acesso completo ao sistema
- Pode gerenciar menus
- Pode criar/editar/excluir formulários
- Acesso ao construtor de formulários

### Usuário (user)
- Acesso aos formulários disponíveis
- Pode preencher e enviar formulários
- Visualização limitada do dashboard

## 🔐 Autenticação

### Usuários de Teste

Para testar o sistema, use estas credenciais:

```
Administrador:
- Email: admin@test.com
- Senha: admin123

Usuário:
- Email: user@test.com
- Senha: user123
```

### Fluxo de Autenticação

1. **Login**: POST `/api/auth/login`
2. **Token JWT**: Armazenado no localStorage
3. **Interceptors**: Axios adiciona automaticamente o token nas requisições
4. **Logout**: Remove token e redireciona para login

## 📝 Funcionalidades Principais

### 1. Dashboard
- Visão geral do sistema
- Estatísticas de formulários e menus
- Ações rápidas baseadas no perfil do usuário

### 2. Gerenciamento de Menus (Admin)
- Criar menus dinâmicos
- Configurar tipos de menu (rota, formulário, link externo, iframe)
- Definir roles de acesso
- Reordenar menus via drag-and-drop

### 3. Construtor de Formulários (Admin)
- Interface visual para criar formulários
- Suporte a diversos tipos de campo:
  - Texto, email, senha, número
  - Seleção, checkbox, radio button
  - Data, seção
- Preview em tempo real
- Validações customizáveis

### 4. Lista de Formulários
- Visualizar todos os formulários criados
- Busca e filtros
- Estatísticas de uso
- Ações de editar/visualizar/excluir

### 5. Visualização de Formulários
- Renderização dinâmica baseada no schema
- Validação client-side
- Envio de dados para API
- Feedback visual de sucesso/erro

## 🎨 Temas e Estilos

O sistema utiliza Material UI com um tema customizado:

- **Cores primárias**: Tons de azul (#2196F3)
- **Cores secundárias**: Tons de laranja (#FF5722)
- **Tipografia**: Roboto
- **Componentes**: Cards arredondados, botões com sombra

### Customização de Tema

Para modificar o tema, edite o arquivo `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3', // Azul principal
    },
    secondary: {
      main: '#FF5722', // Laranja secundário
    },
  },
});
```

## 🌐 Integração com API

### Endpoints Esperados

O frontend espera que a API tenha os seguintes endpoints:

```
Auth:
POST /api/auth/login
POST /api/auth/register
PUT /api/auth/profile

Menus:
GET /api/menus
GET /api/menus/role/{role}
POST /api/menus
PUT /api/menus/{id}
DELETE /api/menus/{id}
PUT /api/menus/reorder

Formulários:
GET /api/forms
GET /api/forms/{id}
POST /api/forms
PUT /api/forms/{id}
DELETE /api/forms/{id}

Submissions:
POST /api/submissions
GET /api/submissions
GET /api/submissions/form/{formId}
```

### Configuração da API

Para alterar a URL base da API, modifique `src/api/axiosConfig.js`:

```javascript
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Altere aqui
});
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Sidebar colapsável
- **Mobile**: Menu drawer

## 🚀 Build e Deploy

### Desenvolvimento
```bash
npm run dev
```

### Build de Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Deploy

O projeto pode ser deployado em qualquer servidor web estático:

1. Execute `npm run build`
2. Copie o conteúdo da pasta `dist/` para seu servidor
3. Configure o servidor para servir `index.html` para rotas não encontradas (SPA)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_TITLE=Sistema de Formulários
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build
- `npm run lint` - Executa linter (se configurado)

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Certifique-se de que a API permite requisições de `http://localhost:5173`
   
2. **Token expirado**
   - O sistema redireciona automaticamente para login
   - Verifique a configuração JWT na API

3. **Menus não carregam**
   - Verifique se o usuário tem o role correto
   - Confirme se a API retorna os menus no formato esperado

4. **Formulários não renderizam**
   - Verifique se o schema está no formato correto
   - Confirme se todos os tipos de campo são suportados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ usando React e Material UI**