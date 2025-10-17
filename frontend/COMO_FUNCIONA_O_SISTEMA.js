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

const handleSubmit = async (formData) => {
  try {
    setSubmitting(true);
    setError('');
    
    const response = await formService.submitForm(id, formData);
    
    setSuccess(true);
    
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