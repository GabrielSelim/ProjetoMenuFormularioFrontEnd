# Guia de Uso - Sistema de Formulários

## 🎯 Como usar o sistema

### 1. Fazer Login

1. Acesse `http://localhost:5173`
2. Use uma das credenciais de teste:
   - **Admin**: admin@test.com / admin123
   - **Usuário**: user@test.com / user123

### 2. Dashboard Principal

Após o login, você verá:
- **Informações do usuário** com avatar e role
- **Estatísticas** do sistema
- **Ações rápidas** baseadas no seu perfil
- **Menu lateral** com opções disponíveis

### 3. Funcionalidades por Perfil

#### 👑 Administrador (admin@test.com)

**Gerenciar Menus**
1. Clique em "Gerenciar Menus" na sidebar
2. Use "Adicionar Menu" para criar novo item
3. Configure:
   - Título e ícone
   - Tipo (Rota, Formulário, Link Externo, IFrame)
   - Roles de acesso
   - Caminho ou URL

**Construtor de Formulários**
1. Acesse "Construtor de Formulários"
2. Defina título e descrição
3. Adicione campos:
   - Clique em "Adicionar Campo"
   - Escolha o tipo (texto, email, seleção, etc.)
   - Configure validações
   - Use drag-and-drop para reordenar
4. Clique "Visualizar" para preview
5. Salve o formulário

**Lista de Formulários**
1. Veja todos os formulários criados
2. Use a barra de pesquisa para filtrar
3. Ações disponíveis:
   - ✅ Visualizar: Abrir o formulário
   - ✏️ Editar: Modificar no construtor
   - 🔍 Preview: Ver sem abrir
   - 🗑️ Excluir: Remover formulário

#### 👤 Usuário (user@test.com)

**Preencher Formulários**
1. Navegue pelos menus disponíveis
2. Clique em um formulário
3. Preencha os campos obrigatórios
4. Clique "Enviar Formulário"
5. Aguarde confirmação de envio

### 4. Exemplos de Uso

#### Criar um Formulário de Contato

1. Como admin, acesse o construtor
2. Título: "Formulário de Contato"
3. Adicione campos:
   ```
   - Nome (texto, obrigatório)
   - Email (email, obrigatório)
   - Telefone (texto, opcional)
   - Assunto (seleção com opções)
   - Mensagem (texto multilinha, obrigatório)
   ```
4. Salve o formulário

#### Criar Menu para o Formulário

1. Acesse "Gerenciar Menus"
2. Criar novo menu:
   - Título: "Contato"
   - Tipo: "Formulário"
   - Form ID: (ID do formulário criado)
   - Roles: ["user", "admin"]

#### Resultado Final

- Menu "Contato" aparece na sidebar
- Usuários podem acessar e preencher
- Dados são enviados para a API

### 5. Tipos de Campo Disponíveis

| Tipo | Descrição | Validações |
|------|-----------|------------|
| **Texto** | Campo de texto simples | Min/max length, pattern |
| **Email** | Campo com validação de email | Formato de email |
| **Senha** | Campo mascarado | Min length |
| **Número** | Campo numérico | Min/max value, step |
| **Seleção** | Dropdown com opções | Opções predefinidas |
| **Checkbox** | Caixa de seleção | Booleano |
| **Radio** | Botões de opção | Uma opção das disponíveis |
| **Data** | Seletor de data | Formato de data |
| **Seção** | Separador visual | Apenas título |

### 6. Tipos de Menu Disponíveis

| Tipo | Uso | Configuração |
|------|-----|--------------|
| **Rota** | Página interna | Caminho da rota (ex: /dashboard) |
| **Formulário** | Abrir formulário | ID do formulário |
| **Link Externo** | Site externo | URL completa |
| **IFrame** | Conteúdo embed | Conteúdo carregado em iframe |

### 7. Dicas de Uso

#### Performance
- Formulários grandes: Use seções para organizar
- Campos condicionais: Implemente na API se necessário
- Upload de arquivos: Adicione suporte na API

#### UX/UI
- Use nomes descritivos para campos
- Adicione texto de ajuda quando necessário
- Agrupe campos relacionados
- Configure validações claras

#### Segurança
- Sempre valide dados no backend
- Use roles apropriados para menus
- Implemente rate limiting na API

### 8. Troubleshooting

#### Erro "Token Expirado"
- O sistema redireciona automaticamente para login
- Faça login novamente

#### Menu não aparece
- Verifique se o usuário tem o role correto
- Confirme se o menu está ativo

#### Formulário não carrega
- Verifique se o ID do formulário está correto
- Confirme se o formulário está ativo

#### Erro ao enviar formulário
- Verifique preenchimento de campos obrigatórios
- Confirme se a API está respondendo

### 9. Integração com Backend

O sistema espera uma API REST com endpoints específicos. Para integrar:

1. **Implementar endpoints** conforme documentação
2. **Configurar CORS** para permitir origem do frontend
3. **Implementar JWT** para autenticação
4. **Validar dados** recebidos dos formulários

### 10. Próximos Passos

Para expandir o sistema:

- ✅ Adicionar upload de arquivos
- ✅ Implementar formulários condicionais
- ✅ Criar relatórios de submissions
- ✅ Adicionar notificações
- ✅ Implementar aprovação de formulários
- ✅ Criar templates de formulário

---

**💡 Dica**: Use este sistema como base e customize conforme suas necessidades específicas!