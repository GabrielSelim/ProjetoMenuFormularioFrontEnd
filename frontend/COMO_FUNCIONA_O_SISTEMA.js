// 🚀 TESTE PRÁTICO - FLUXO COMPLETO DO SISTEMA

// 1. CRIAR FORMULÁRIO (Admin/Gestor)
// Acesse: http://localhost:5173/form-builder
// Ou: http://localhost:5173/form-builder-advanced (FormEngine.io)

const exemploFormularioSimples = {
  title: "Solicitação de Compra",
  description: "Formulário para solicitações de compra de materiais",
  fields: [
    {
      name: "solicitante",
      label: "Nome do Solicitante",
      type: "text",
      required: true,
      placeholder: "Digite seu nome completo"
    },
    {
      name: "departamento", 
      label: "Departamento",
      type: "select",
      required: true,
      options: [
        { label: "TI", value: "ti" },
        { label: "RH", value: "rh" },
        { label: "Financeiro", value: "financeiro" }
      ]
    },
    {
      name: "item",
      label: "Item Solicitado", 
      type: "text",
      required: true,
      placeholder: "Ex: Notebook, Mouse, etc."
    },
    {
      name: "valor",
      label: "Valor Estimado",
      type: "number",
      required: true,
      placeholder: "0.00"
    },
    {
      name: "justificativa",
      label: "Justificativa",
      type: "text",
      multiline: true,
      rows: 3,
      required: true,
      placeholder: "Explique por que precisa deste item"
    }
  ]
};

// 2. SISTEMA AUTOMATICAMENTE ADICIONA BOTÃO "ENVIAR"
// O FormRenderer.jsx já inclui automaticamente o botão:
/*
{!readOnly && onSubmit && (
  <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
    <Button type="submit" variant="contained" size="large">
      {schema.submitText || 'Enviar'}
    </Button>
  </Box>
)}
*/

// 3. QUANDO USUÁRIO CLICA "ENVIAR"
// O FormView.jsx chama automaticamente:
const handleSubmit = async (formData) => {
  try {
    setSubmitting(true);
    setError('');
    
    // Chama API de submissão
    const response = await formService.submitForm(id, formData);
    
    setSuccess(true);
    
    // Redireciona para área de submissions
    setTimeout(() => {
      navigate('/submissions', {
        state: { 
          message: 'Formulário enviado com sucesso!',
          submissionId: response.id 
        }
      });
    }, 2000);
    
  } catch (err) {
    setError(err.message || 'Erro ao enviar formulário');
  } finally {
    setSubmitting(false);
  }
};

// 4. DADOS VÃO PARA O ENDPOINT
// formService.submitForm chama:
// POST /api/SubmissoesFormulario
// {
//   formId: 123,
//   dataJson: JSON.stringify({
//     solicitante: "João Silva",
//     departamento: "ti", 
//     item: "Notebook Dell",
//     valor: 3500.00,
//     justificativa: "Notebook atual está com defeito"
//   })
// }

// 5. ADMIN PODE VER SUBMISSIONS EM /submissions

// ✅ SEU SISTEMA JÁ FUNCIONA ASSIM!