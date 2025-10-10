# Dados de Exemplo para API - Formulários FormEngine.io

## Formulário 1: Formulário de Contato

```json
{
  "name": "contato-empresarial",
  "schemaJson": "{\"title\":\"Formulário de Contato Empresarial\",\"description\":\"Entre em contato conosco para parcerias e oportunidades de negócio\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"nome\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Digite seu nome completo\"},\"label\":{\"value\":\"Nome Completo\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]},\"tooltipProps\":{\"text\":{\"value\":\"Informe seu nome completo\"}}},{\"key\":\"email\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"seu.email@empresa.com\"},\"label\":{\"value\":\"E-mail Corporativo\"}},\"schema\":{\"validations\":[{\"key\":\"required\"},{\"key\":\"email\"}]},\"tooltipProps\":{\"text\":{\"value\":\"E-mail válido para contato\"}}},{\"key\":\"empresa\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Nome da sua empresa\"},\"label\":{\"value\":\"Empresa\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"telefone\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"(11) 99999-9999\"},\"label\":{\"value\":\"Telefone\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"assunto\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Assunto\"},\"data\":{\"value\":[{\"label\":\"Parceria Comercial\",\"value\":\"parceria\"},{\"label\":\"Suporte Técnico\",\"value\":\"suporte\"},{\"label\":\"Orçamento\",\"value\":\"orcamento\"},{\"label\":\"Outros\",\"value\":\"outros\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"mensagem\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":4},\"placeholder\":{\"value\":\"Descreva sua necessidade ou dúvida\"},\"label\":{\"value\":\"Mensagem\"}},\"schema\":{\"validations\":[{\"key\":\"required\"},{\"key\":\"min\",\"args\":{\"limit\":10}}]}},{\"key\":\"enviar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Enviar Contato\"},\"color\":{\"value\":\"blue\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,user,manager",
  "version": "1.0"
}
```

## Formulário 2: Avaliação de Produto

```json
{
  "name": "avaliacao-produto",
  "schemaJson": "{\"title\":\"Avaliação de Produto\",\"description\":\"Compartilhe sua experiência com nossos produtos\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"produto\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Produto Avaliado\"},\"data\":{\"value\":[{\"label\":\"Sistema de Gestão\",\"value\":\"gestao\"},{\"label\":\"App Mobile\",\"value\":\"mobile\"},{\"label\":\"Portal Web\",\"value\":\"portal\"},{\"label\":\"API Integration\",\"value\":\"api\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"nota\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Nota Geral\"},\"data\":{\"value\":[{\"label\":\"⭐ 1 - Muito ruim\",\"value\":\"1\"},{\"label\":\"⭐⭐ 2 - Ruim\",\"value\":\"2\"},{\"label\":\"⭐⭐⭐ 3 - Regular\",\"value\":\"3\"},{\"label\":\"⭐⭐⭐⭐ 4 - Bom\",\"value\":\"4\"},{\"label\":\"⭐⭐⭐⭐⭐ 5 - Excelente\",\"value\":\"5\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"facilidade\",\"type\":\"RadioGroup\",\"props\":{\"label\":{\"value\":\"Facilidade de Uso\"},\"data\":{\"value\":[{\"label\":\"Muito Fácil\",\"value\":\"muito-facil\"},{\"label\":\"Fácil\",\"value\":\"facil\"},{\"label\":\"Neutro\",\"value\":\"neutro\"},{\"label\":\"Difícil\",\"value\":\"dificil\"},{\"label\":\"Muito Difícil\",\"value\":\"muito-dificil\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"recomendaria\",\"type\":\"RadioGroup\",\"props\":{\"label\":{\"value\":\"Recomendaria para outros?\"},\"data\":{\"value\":[{\"label\":\"Sim, certamente\",\"value\":\"sim\"},{\"label\":\"Talvez\",\"value\":\"talvez\"},{\"label\":\"Não\",\"value\":\"nao\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"pontos-fortes\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":3},\"placeholder\":{\"value\":\"O que mais gostou no produto?\"},\"label\":{\"value\":\"Pontos Fortes\"}}},{\"key\":\"sugestoes\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":3},\"placeholder\":{\"value\":\"Como podemos melhorar?\"},\"label\":{\"value\":\"Sugestões de Melhoria\"}}},{\"key\":\"enviar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Enviar Avaliação\"},\"color\":{\"value\":\"green\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,user",
  "version": "1.0"
}
```

## Formulário 3: Cadastro de Funcionário

```json
{
  "name": "cadastro-funcionario",
  "schemaJson": "{\"title\":\"Cadastro de Funcionário\",\"description\":\"Formulário para cadastro de novos colaboradores\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"dados-pessoais\",\"type\":\"Panel\",\"props\":{\"header\":{\"value\":\"Dados Pessoais\"}},\"children\":[{\"key\":\"nome\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Nome completo\"},\"label\":{\"value\":\"Nome Completo\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"cpf\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"000.000.000-00\"},\"label\":{\"value\":\"CPF\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"email\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"email@empresa.com\"},\"label\":{\"value\":\"E-mail\"}},\"schema\":{\"validations\":[{\"key\":\"required\"},{\"key\":\"email\"}]}},{\"key\":\"telefone\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"(11) 99999-9999\"},\"label\":{\"value\":\"Telefone\"}}}]},{\"key\":\"dados-profissionais\",\"type\":\"Panel\",\"props\":{\"header\":{\"value\":\"Dados Profissionais\"}},\"children\":[{\"key\":\"cargo\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Cargo\"},\"data\":{\"value\":[{\"label\":\"Desenvolvedor\",\"value\":\"dev\"},{\"label\":\"Designer\",\"value\":\"design\"},{\"label\":\"Gerente\",\"value\":\"gerente\"},{\"label\":\"Analista\",\"value\":\"analista\"},{\"label\":\"Coordenador\",\"value\":\"coord\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"departamento\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Departamento\"},\"data\":{\"value\":[{\"label\":\"Tecnologia\",\"value\":\"ti\"},{\"label\":\"Recursos Humanos\",\"value\":\"rh\"},{\"label\":\"Financeiro\",\"value\":\"financeiro\"},{\"label\":\"Comercial\",\"value\":\"vendas\"},{\"label\":\"Marketing\",\"value\":\"marketing\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"salario\",\"type\":\"InputNumber\",\"props\":{\"label\":{\"value\":\"Salário (R$)\"},\"prefix\":{\"value\":\"R$\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"data-admissao\",\"type\":\"DatePicker\",\"props\":{\"label\":{\"value\":\"Data de Admissão\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}}]},{\"key\":\"observacoes\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":3},\"placeholder\":{\"value\":\"Observações adicionais\"},\"label\":{\"value\":\"Observações\"}}},{\"key\":\"salvar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Cadastrar Funcionário\"},\"color\":{\"value\":\"blue\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,manager",
  "version": "1.0"
}
```

## Formulário 4: Pesquisa de Satisfação

```json
{
  "name": "pesquisa-satisfacao",
  "schemaJson": "{\"title\":\"Pesquisa de Satisfação\",\"description\":\"Ajude-nos a melhorar nossos serviços com sua opinião\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"atendimento\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Qualidade do Atendimento\"},\"data\":{\"value\":[{\"label\":\"⭐ 1 - Péssimo\",\"value\":\"1\"},{\"label\":\"⭐⭐ 2 - Ruim\",\"value\":\"2\"},{\"label\":\"⭐⭐⭐ 3 - Regular\",\"value\":\"3\"},{\"label\":\"⭐⭐⭐⭐ 4 - Bom\",\"value\":\"4\"},{\"label\":\"⭐⭐⭐⭐⭐ 5 - Excelente\",\"value\":\"5\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]},\"tooltipProps\":{\"text\":{\"value\":\"Avalie de 1 a 5 estrelas\"}}},{\"key\":\"tempo-resposta\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Tempo de Resposta\"},\"data\":{\"value\":[{\"label\":\"⭐ 1 - Muito demorado\",\"value\":\"1\"},{\"label\":\"⭐⭐ 2 - Demorado\",\"value\":\"2\"},{\"label\":\"⭐⭐⭐ 3 - Aceitável\",\"value\":\"3\"},{\"label\":\"⭐⭐⭐⭐ 4 - Rápido\",\"value\":\"4\"},{\"label\":\"⭐⭐⭐⭐⭐ 5 - Muito rápido\",\"value\":\"5\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"solucao\",\"type\":\"RadioGroup\",\"props\":{\"label\":{\"value\":\"Sua solicitação foi resolvida?\"},\"data\":{\"value\":[{\"label\":\"Totalmente resolvida\",\"value\":\"total\"},{\"label\":\"Parcialmente resolvida\",\"value\":\"parcial\"},{\"label\":\"Não foi resolvida\",\"value\":\"nao\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"canal-telefone\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"Telefone\"}}},{\"key\":\"canal-email\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"E-mail\"}}},{\"key\":\"canal-chat\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"Chat Online\"}}},{\"key\":\"canal-whatsapp\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"WhatsApp\"}}},{\"key\":\"canal-portal\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"Portal Web\"}}},{\"key\":\"comentarios\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":4},\"placeholder\":{\"value\":\"Deixe seus comentários e sugestões\"},\"label\":{\"value\":\"Comentários\"}}},{\"key\":\"email-contato\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"seu@email.com\"},\"label\":{\"value\":\"E-mail (opcional)\"}},\"schema\":{\"validations\":[{\"key\":\"email\"}]}},{\"key\":\"enviar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Enviar Pesquisa\"},\"color\":{\"value\":\"orange\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,user,manager",
  "version": "1.0"
}
```

## Formulário 5: Solicitação de Férias

```json
{
  "name": "solicitacao-ferias",
  "schemaJson": "{\"title\":\"Solicitação de Férias\",\"description\":\"Formulário para solicitação de período de férias\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"funcionario\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Nome do funcionário\"},\"label\":{\"value\":\"Nome do Funcionário\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"matricula\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Número da matrícula\"},\"label\":{\"value\":\"Matrícula\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"periodo\",\"type\":\"Panel\",\"props\":{\"header\":{\"value\":\"Período Solicitado\"}},\"children\":[{\"key\":\"data-inicio\",\"type\":\"DatePicker\",\"props\":{\"label\":{\"value\":\"Data de Início\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"data-fim\",\"type\":\"DatePicker\",\"props\":{\"label\":{\"value\":\"Data de Retorno\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"dias-uteis\",\"type\":\"InputNumber\",\"props\":{\"label\":{\"value\":\"Dias Úteis\"},\"min\":{\"value\":1},\"max\":{\"value\":30}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}}]},{\"key\":\"tipo\",\"type\":\"RadioGroup\",\"props\":{\"label\":{\"value\":\"Tipo de Férias\"},\"data\":{\"value\":[{\"label\":\"Férias Regulares (30 dias)\",\"value\":\"regular\"},{\"label\":\"Férias Fracionadas\",\"value\":\"fracionada\"},{\"label\":\"Antecipação de Férias\",\"value\":\"antecipacao\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"observacoes\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":3},\"placeholder\":{\"value\":\"Observações especiais\"},\"label\":{\"value\":\"Observações\"}}},{\"key\":\"urgente\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"Solicitação urgente\"}}},{\"key\":\"enviar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Solicitar Férias\"},\"color\":{\"value\":\"cyan\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,user,manager",
  "version": "1.0"
}
```

## Como usar no Swagger:

1. Vá para o Swagger da API
2. Encontre o endpoint POST `/Forms`
3. Use cada JSON acima no campo de request body
4. Execute a requisição para criar os formulários de exemplo

Esses formulários cobrem diferentes cenários:
- **Formulário de Contato**: Campos básicos + seleção + textarea
- **Avaliação de Produto**: Rating + radio groups + textarea
- **Cadastro de Funcionário**: Painéis organizados + campos profissionais
- **Pesquisa de Satisfação**: Rating + checkboxes + validações opcionais
- **Solicitação de Férias**: Datas + números + tipos especiais

## Formulário 6: Cadastro de Cliente

```json
{
  "name": "cadastro-cliente",
  "schemaJson": "{\"title\":\"Cadastro de Cliente\",\"description\":\"Formulário para cadastro de novos clientes\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"tipo-pessoa\",\"type\":\"RadioGroup\",\"props\":{\"label\":{\"value\":\"Tipo de Pessoa\"},\"data\":{\"value\":[{\"label\":\"Pessoa Física\",\"value\":\"pf\"},{\"label\":\"Pessoa Jurídica\",\"value\":\"pj\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"nome-razao\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Nome completo ou Razão Social\"},\"label\":{\"value\":\"Nome / Razão Social\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"documento\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"CPF ou CNPJ\"},\"label\":{\"value\":\"CPF / CNPJ\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"email\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"cliente@email.com\"},\"label\":{\"value\":\"E-mail\"}},\"schema\":{\"validations\":[{\"key\":\"required\"},{\"key\":\"email\"}]}},{\"key\":\"telefone\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"(11) 99999-9999\"},\"label\":{\"value\":\"Telefone\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"endereco\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Rua, número, bairro\"},\"label\":{\"value\":\"Endereço\"}}},{\"key\":\"cidade\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Nome da cidade\"},\"label\":{\"value\":\"Cidade\"}}},{\"key\":\"estado\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Estado\"},\"data\":{\"value\":[{\"label\":\"São Paulo\",\"value\":\"SP\"},{\"label\":\"Rio de Janeiro\",\"value\":\"RJ\"},{\"label\":\"Minas Gerais\",\"value\":\"MG\"},{\"label\":\"Paraná\",\"value\":\"PR\"},{\"label\":\"Rio Grande do Sul\",\"value\":\"RS\"},{\"label\":\"Bahia\",\"value\":\"BA\"},{\"label\":\"Santa Catarina\",\"value\":\"SC\"},{\"label\":\"Goiás\",\"value\":\"GO\"},{\"label\":\"Outros\",\"value\":\"OUT\"}]}}},{\"key\":\"newsletter\",\"type\":\"RsCheckbox\",\"props\":{\"children\":{\"value\":\"Desejo receber newsletter\"}}},{\"key\":\"cadastrar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Cadastrar Cliente\"},\"color\":{\"value\":\"blue\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,user,manager",
  "version": "1.0"
}
```

## Formulário 7: Agendamento de Reunião

```json
{
  "name": "agendamento-reuniao",
  "schemaJson": "{\"title\":\"Agendamento de Reunião\",\"description\":\"Agende uma reunião com nossa equipe\",\"formEngineSchema\":{\"form\":{\"key\":\"Screen\",\"type\":\"Screen\",\"props\":{},\"children\":[{\"key\":\"solicitante\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Seu nome completo\"},\"label\":{\"value\":\"Nome do Solicitante\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"email\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"seu@email.com\"},\"label\":{\"value\":\"E-mail\"}},\"schema\":{\"validations\":[{\"key\":\"required\"},{\"key\":\"email\"}]}},{\"key\":\"departamento\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Departamento\"},\"data\":{\"value\":[{\"label\":\"Vendas\",\"value\":\"vendas\"},{\"label\":\"Suporte Técnico\",\"value\":\"suporte\"},{\"label\":\"Financeiro\",\"value\":\"financeiro\"},{\"label\":\"Recursos Humanos\",\"value\":\"rh\"},{\"label\":\"Diretoria\",\"value\":\"diretoria\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"data-reuniao\",\"type\":\"DatePicker\",\"props\":{\"label\":{\"value\":\"Data da Reunião\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"horario\",\"type\":\"RsSelect\",\"props\":{\"label\":{\"value\":\"Horário Preferido\"},\"data\":{\"value\":[{\"label\":\"08:00 - 09:00\",\"value\":\"08:00\"},{\"label\":\"09:00 - 10:00\",\"value\":\"09:00\"},{\"label\":\"10:00 - 11:00\",\"value\":\"10:00\"},{\"label\":\"11:00 - 12:00\",\"value\":\"11:00\"},{\"label\":\"14:00 - 15:00\",\"value\":\"14:00\"},{\"label\":\"15:00 - 16:00\",\"value\":\"15:00\"},{\"label\":\"16:00 - 17:00\",\"value\":\"16:00\"},{\"label\":\"17:00 - 18:00\",\"value\":\"17:00\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"tipo-reuniao\",\"type\":\"RadioGroup\",\"props\":{\"label\":{\"value\":\"Tipo de Reunião\"},\"data\":{\"value\":[{\"label\":\"Presencial\",\"value\":\"presencial\"},{\"label\":\"Online (Teams/Zoom)\",\"value\":\"online\"},{\"label\":\"Telefone\",\"value\":\"telefone\"}]}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"assunto\",\"type\":\"RsInput\",\"props\":{\"placeholder\":{\"value\":\"Descreva brevemente o assunto\"},\"label\":{\"value\":\"Assunto da Reunião\"}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"participantes\",\"type\":\"InputNumber\",\"props\":{\"label\":{\"value\":\"Número de Participantes\"},\"min\":{\"value\":1},\"max\":{\"value\":20}},\"schema\":{\"validations\":[{\"key\":\"required\"}]}},{\"key\":\"observacoes\",\"type\":\"RsInput\",\"props\":{\"as\":{\"value\":\"textarea\"},\"rows\":{\"value\":3},\"placeholder\":{\"value\":\"Informações adicionais\"},\"label\":{\"value\":\"Observações\"}}},{\"key\":\"agendar\",\"type\":\"RsButton\",\"props\":{\"children\":{\"value\":\"Agendar Reunião\"},\"color\":{\"value\":\"green\"},\"appearance\":{\"value\":\"primary\"}},\"events\":{\"onClick\":[{\"name\":\"validate\",\"type\":\"common\"}]}}]}},\"fields\":[]}",
  "rolesAllowed": "admin,user,manager",
  "version": "1.0"
}
```

## Componentes RSuite Válidos Utilizados:

✅ **Componentes Corrigidos e Válidos:**
- `RsInput` - Campo de texto simples e textarea
- `RsSelect` - Seleção dropdown (componente correto do RSuite)
- `RadioGroup` - Botões de rádio  
- `RsCheckbox` - Checkbox individual (substitui RsCheckboxGroup)
- `RsButton` - Botões de ação
- `DatePicker` - Seletor de data
- `InputNumber` - Campo numérico
- `Panel` - Painéis organizacionais

❌ **Componentes Removidos (não existem no RSuite):**
- ~~`RsRate`~~ → Substituído por `RsSelect` com estrelas
- ~~`RsCheckboxGroup`~~ → Substituído por múltiplos `RsCheckbox`
- ~~`RsSelectPicker`~~ → Substituído por `RsSelect`
- ~~`RsRadioGroup`~~ → Substituído por `RadioGroup`
- ~~`RsInputNumber`~~ → Substituído por `InputNumber`
- ~~`RsDatePicker`~~ → Substituído por `DatePicker`
- ~~`RsPanel`~~ → Substituído por `Panel`

Todos seguem o padrão do FormEngine.io com validações e componentes RSuite válidos! 🎯
