{
  "openapi": "3.0.1",
  "info": {
    "title": "FormEngine API",
    "description": "API REST para gerenciamento de formulários dinâmicos com FormEngine",
    "contact": {
      "name": "FormEngine Team",
      "email": "contact@formengine.com"
    },
    "version": "v1"
  },
  "paths": {
    "/api/Auth/register": {
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RegisterDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/Auth/login": {
      "post": {
        "tags": [
          "Auth"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/LoginDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponseDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponseDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginResponseDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/Forms": {
      "get": {
        "tags": [
          "Forms"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormDto"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Forms"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateFormDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateFormDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateFormDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/Forms/{id}": {
      "get": {
        "tags": [
          "Forms"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Forms"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateFormDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateFormDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateFormDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Forms"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Forms/{originalFormId}/versions": {
      "get": {
        "tags": [
          "Forms"
        ],
        "parameters": [
          {
            "name": "originalFormId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormVersionDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormVersionDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormVersionDto"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/Forms/{originalFormId}/latest": {
      "get": {
        "tags": [
          "Forms"
        ],
        "parameters": [
          {
            "name": "originalFormId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/Forms/{originalFormId}/version/{version}": {
      "get": {
        "tags": [
          "Forms"
        ],
        "parameters": [
          {
            "name": "originalFormId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "version",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormDto"
                }
              }
            }
          }
        }
      }
    },
    "/Health": {
      "get": {
        "tags": [
          "Health"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/Health/database": {
      "get": {
        "tags": [
          "Health"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Menus": {
      "get": {
        "tags": [
          "Menus"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/MenuDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/MenuDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/MenuDto"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Menus"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateMenuDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateMenuDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateMenuDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/Menus/{id}": {
      "get": {
        "tags": [
          "Menus"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Menus"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateMenuDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateMenuDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateMenuDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/MenuDto"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Menus"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/Submissions": {
      "post": {
        "tags": [
          "Submissions"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateSubmissionDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateSubmissionDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CreateSubmissionDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/FormSubmissionDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormSubmissionDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/FormSubmissionDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/Submissions/form/{formId}": {
      "get": {
        "tags": [
          "Submissions"
        ],
        "parameters": [
          {
            "name": "formId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/Submissions/user/{userId}": {
      "get": {
        "tags": [
          "Submissions"
        ],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/Submissions/my-submissions": {
      "get": {
        "tags": [
          "Submissions"
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FormSubmissionDto"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "FormId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "UserId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "Status",
            "in": "query",
            "schema": {
              "$ref": "#/components/schemas/StatusSubmissao"
            }
          },
          {
            "name": "DataInicialCriacao",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "DataFinalCriacao",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "DataInicialSubmissao",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "DataFinalSubmissao",
            "in": "query",
            "schema": {
              "type": "string",
              "format": "date-time"
            }
          },
          {
            "name": "UsuarioAprovadorId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "IncluirExcluidas",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "Pagina",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "TamanhoPagina",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "CampoOrdenacao",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "DirecaoOrdenacao",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/SubmissaoFormularioDtoResultadoPaginadoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmissaoFormularioDtoResultadoPaginadoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmissaoFormularioDtoResultadoPaginadoDto"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CriarSubmissaoDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/CriarSubmissaoDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/CriarSubmissaoDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/DetalheSubmissaoFormularioDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DetalheSubmissaoFormularioDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/DetalheSubmissaoFormularioDto"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AtualizarSubmissaoDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/AtualizarSubmissaoDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/AtualizarSubmissaoDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "string"
              }
            },
            "text/json": {
              "schema": {
                "type": "string"
              }
            },
            "application/*+json": {
              "schema": {
                "type": "string"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/enviar": {
      "post": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "string"
              }
            },
            "text/json": {
              "schema": {
                "type": "string"
              }
            },
            "application/*+json": {
              "schema": {
                "type": "string"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/aprovar": {
      "post": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "string"
              }
            },
            "text/json": {
              "schema": {
                "type": "string"
              }
            },
            "application/*+json": {
              "schema": {
                "type": "string"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/rejeitar": {
      "post": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/RejeitarSubmissaoDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/RejeitarSubmissaoDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/RejeitarSubmissaoDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/cancelar": {
      "post": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "string"
              }
            },
            "text/json": {
              "schema": {
                "type": "string"
              }
            },
            "application/*+json": {
              "schema": {
                "type": "string"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/status": {
      "put": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MudarStatusSubmissaoDto"
              }
            },
            "text/json": {
              "schema": {
                "$ref": "#/components/schemas/MudarStatusSubmissaoDto"
              }
            },
            "application/*+json": {
              "schema": {
                "$ref": "#/components/schemas/MudarStatusSubmissaoDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/RespostaOperacaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/historico": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/HistoricoSubmissaoDto"
                  }
                }
              },
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/HistoricoSubmissaoDto"
                  }
                }
              },
              "text/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/HistoricoSubmissaoDto"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/estatisticas": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "usuarioId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "formId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/EstatisticasSubmissaoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EstatisticasSubmissaoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/EstatisticasSubmissaoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/pendentes-aprovacao": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "pagina",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 1
            }
          },
          {
            "name": "tamanhoPagina",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32",
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "$ref": "#/components/schemas/SubmissaoFormularioDtoResultadoPaginadoDto"
                }
              },
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmissaoFormularioDtoResultadoPaginadoDto"
                }
              },
              "text/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubmissaoFormularioDtoResultadoPaginadoDto"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/pode-visualizar": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "boolean"
                }
              },
              "application/json": {
                "schema": {
                  "type": "boolean"
                }
              },
              "text/json": {
                "schema": {
                  "type": "boolean"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/pode-editar": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "boolean"
                }
              },
              "application/json": {
                "schema": {
                  "type": "boolean"
                }
              },
              "text/json": {
                "schema": {
                  "type": "boolean"
                }
              }
            }
          }
        }
      }
    },
    "/api/SubmissoesFormulario/{id}/pode-aprovar": {
      "get": {
        "tags": [
          "SubmissoesFormulario"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/plain": {
                "schema": {
                  "type": "boolean"
                }
              },
              "application/json": {
                "schema": {
                  "type": "boolean"
                }
              },
              "text/json": {
                "schema": {
                  "type": "boolean"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "AcaoSubmissao": {
        "enum": [
          0,
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "type": "integer",
        "format": "int32"
      },
      "AtualizarSubmissaoDto": {
        "required": [
          "dataJson",
          "versao"
        ],
        "type": "object",
        "properties": {
          "dataJson": {
            "minLength": 1,
            "type": "string"
          },
          "comentario": {
            "maxLength": 1000,
            "minLength": 0,
            "type": "string",
            "nullable": true
          },
          "versao": {
            "type": "integer",
            "format": "int32"
          }
        },
        "additionalProperties": false
      },
      "CreateFormDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "nullable": true
          },
          "schemaJson": {
            "type": "string",
            "nullable": true
          },
          "rolesAllowed": {
            "type": "string",
            "nullable": true
          },
          "version": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CreateMenuDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "nullable": true
          },
          "contentType": {
            "type": "string",
            "nullable": true
          },
          "urlOrPath": {
            "type": "string",
            "nullable": true
          },
          "rolesAllowed": {
            "type": "string",
            "nullable": true
          },
          "order": {
            "type": "integer",
            "format": "int32"
          },
          "icon": {
            "type": "string",
            "nullable": true
          },
          "parentId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "originalFormId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "formVersion": {
            "type": "string",
            "nullable": true
          },
          "useLatestVersion": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "CreateSubmissionDto": {
        "type": "object",
        "properties": {
          "formId": {
            "type": "integer",
            "format": "int32"
          },
          "dataJson": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "CriarSubmissaoDto": {
        "required": [
          "dataJson",
          "formId"
        ],
        "type": "object",
        "properties": {
          "formId": {
            "type": "integer",
            "format": "int32"
          },
          "dataJson": {
            "minLength": 1,
            "type": "string"
          },
          "status": {
            "$ref": "#/components/schemas/StatusSubmissao"
          },
          "comentarioInicial": {
            "maxLength": 1000,
            "minLength": 0,
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "DetalheSubmissaoFormularioDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "formId": {
            "type": "integer",
            "format": "int32"
          },
          "formName": {
            "type": "string",
            "nullable": true
          },
          "userId": {
            "type": "integer",
            "format": "int32"
          },
          "userName": {
            "type": "string",
            "nullable": true
          },
          "userEmail": {
            "type": "string",
            "nullable": true
          },
          "status": {
            "$ref": "#/components/schemas/StatusSubmissao"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "dataAtualizacao": {
            "type": "string",
            "format": "date-time"
          },
          "dataSubmissao": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "dataAprovacao": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "usuarioAprovadorId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "usuarioAprovadorName": {
            "type": "string",
            "nullable": true
          },
          "versao": {
            "type": "integer",
            "format": "int32"
          },
          "excluido": {
            "type": "boolean"
          },
          "dataJson": {
            "type": "string",
            "nullable": true
          },
          "motivoRejeicao": {
            "type": "string",
            "nullable": true
          },
          "enderecoIp": {
            "type": "string",
            "nullable": true
          },
          "userAgent": {
            "type": "string",
            "nullable": true
          },
          "dataExclusao": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "historicos": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/HistoricoSubmissaoDto"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "EstatisticasSubmissaoDto": {
        "type": "object",
        "properties": {
          "totalPorStatus": {
            "type": "object",
            "properties": {
              "Rascunho": {
                "type": "integer",
                "format": "int32"
              },
              "Enviado": {
                "type": "integer",
                "format": "int32"
              },
              "EmAnalise": {
                "type": "integer",
                "format": "int32"
              },
              "Aprovado": {
                "type": "integer",
                "format": "int32"
              },
              "Rejeitado": {
                "type": "integer",
                "format": "int32"
              },
              "Cancelado": {
                "type": "integer",
                "format": "int32"
              }
            },
            "additionalProperties": false,
            "nullable": true
          },
          "totalGeral": {
            "type": "integer",
            "format": "int32"
          },
          "criadasHoje": {
            "type": "integer",
            "format": "int32"
          },
          "criadasEstaSemana": {
            "type": "integer",
            "format": "int32"
          },
          "criadasEsteMes": {
            "type": "integer",
            "format": "int32"
          },
          "pendentesAprovacao": {
            "type": "integer",
            "format": "int32"
          },
          "tempoMedioAprovacao": {
            "type": "number",
            "format": "double",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "FormDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "originalFormId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "schemaJson": {
            "type": "string",
            "nullable": true
          },
          "rolesAllowed": {
            "type": "string",
            "nullable": true
          },
          "version": {
            "type": "string",
            "nullable": true
          },
          "isLatest": {
            "type": "boolean"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "updatedAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "additionalProperties": false
      },
      "FormSubmissionDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "formId": {
            "type": "integer",
            "format": "int32"
          },
          "userId": {
            "type": "integer",
            "format": "int32"
          },
          "dataJson": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "formName": {
            "type": "string",
            "nullable": true
          },
          "userName": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "FormVersionDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "originalFormId": {
            "type": "integer",
            "format": "int32"
          },
          "version": {
            "type": "string",
            "nullable": true
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "isLatest": {
            "type": "boolean"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "additionalProperties": false
      },
      "HistoricoSubmissaoDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "acao": {
            "$ref": "#/components/schemas/AcaoSubmissao"
          },
          "dataAcao": {
            "type": "string",
            "format": "date-time"
          },
          "usuarioId": {
            "type": "integer",
            "format": "int32"
          },
          "usuarioName": {
            "type": "string",
            "nullable": true
          },
          "usuarioEmail": {
            "type": "string",
            "nullable": true
          },
          "comentario": {
            "type": "string",
            "nullable": true
          },
          "statusAnterior": {
            "$ref": "#/components/schemas/StatusSubmissao"
          },
          "novoStatus": {
            "$ref": "#/components/schemas/StatusSubmissao"
          },
          "enderecoIp": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "LoginDto": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "nullable": true
          },
          "password": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "LoginResponseDto": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string",
            "nullable": true
          },
          "user": {
            "$ref": "#/components/schemas/UserDto"
          }
        },
        "additionalProperties": false
      },
      "MenuDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "contentType": {
            "type": "string",
            "nullable": true
          },
          "urlOrPath": {
            "type": "string",
            "nullable": true
          },
          "rolesAllowed": {
            "type": "string",
            "nullable": true
          },
          "order": {
            "type": "integer",
            "format": "int32"
          },
          "icon": {
            "type": "string",
            "nullable": true
          },
          "parentId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "originalFormId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "formVersion": {
            "type": "string",
            "nullable": true
          },
          "useLatestVersion": {
            "type": "boolean"
          },
          "children": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/MenuDto"
            },
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "MudarStatusSubmissaoDto": {
        "required": [
          "comentario",
          "novoStatus",
          "versao"
        ],
        "type": "object",
        "properties": {
          "novoStatus": {
            "$ref": "#/components/schemas/StatusSubmissao"
          },
          "comentario": {
            "maxLength": 1000,
            "minLength": 0,
            "type": "string"
          },
          "motivoRejeicao": {
            "maxLength": 1000,
            "minLength": 0,
            "type": "string",
            "nullable": true
          },
          "versao": {
            "type": "integer",
            "format": "int32"
          }
        },
        "additionalProperties": false
      },
      "RegisterDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "nullable": true
          },
          "email": {
            "type": "string",
            "nullable": true
          },
          "password": {
            "type": "string",
            "nullable": true
          },
          "role": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RejeitarSubmissaoDto": {
        "type": "object",
        "properties": {
          "comentario": {
            "type": "string",
            "nullable": true
          },
          "motivoRejeicao": {
            "type": "string",
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "RespostaOperacaoDto": {
        "type": "object",
        "properties": {
          "sucesso": {
            "type": "boolean"
          },
          "mensagem": {
            "type": "string",
            "nullable": true
          },
          "id": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "erros": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "nullable": true
          },
          "dados": {
            "nullable": true
          }
        },
        "additionalProperties": false
      },
      "StatusSubmissao": {
        "enum": [
          0,
          1,
          2,
          3,
          4,
          5
        ],
        "type": "integer",
        "format": "int32"
      },
      "SubmissaoFormularioDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "formId": {
            "type": "integer",
            "format": "int32"
          },
          "formName": {
            "type": "string",
            "nullable": true
          },
          "userId": {
            "type": "integer",
            "format": "int32"
          },
          "userName": {
            "type": "string",
            "nullable": true
          },
          "userEmail": {
            "type": "string",
            "nullable": true
          },
          "status": {
            "$ref": "#/components/schemas/StatusSubmissao"
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          },
          "dataAtualizacao": {
            "type": "string",
            "format": "date-time"
          },
          "dataSubmissao": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "dataAprovacao": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "usuarioAprovadorId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "usuarioAprovadorName": {
            "type": "string",
            "nullable": true
          },
          "versao": {
            "type": "integer",
            "format": "int32"
          },
          "excluido": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "SubmissaoFormularioDtoResultadoPaginadoDto": {
        "type": "object",
        "properties": {
          "itens": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/SubmissaoFormularioDto"
            },
            "nullable": true
          },
          "totalItens": {
            "type": "integer",
            "format": "int32"
          },
          "paginaAtual": {
            "type": "integer",
            "format": "int32"
          },
          "totalPaginas": {
            "type": "integer",
            "format": "int32"
          },
          "tamanhoPagina": {
            "type": "integer",
            "format": "int32"
          },
          "temPaginaAnterior": {
            "type": "boolean",
            "readOnly": true
          },
          "temProximaPagina": {
            "type": "boolean",
            "readOnly": true
          }
        },
        "additionalProperties": false
      },
      "UpdateFormDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "nullable": true
          },
          "schemaJson": {
            "type": "string",
            "nullable": true
          },
          "rolesAllowed": {
            "type": "string",
            "nullable": true
          },
          "version": {
            "type": "string",
            "nullable": true
          },
          "createNewVersion": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "UpdateMenuDto": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "nullable": true
          },
          "contentType": {
            "type": "string",
            "nullable": true
          },
          "urlOrPath": {
            "type": "string",
            "nullable": true
          },
          "rolesAllowed": {
            "type": "string",
            "nullable": true
          },
          "order": {
            "type": "integer",
            "format": "int32"
          },
          "icon": {
            "type": "string",
            "nullable": true
          },
          "parentId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "originalFormId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "formVersion": {
            "type": "string",
            "nullable": true
          },
          "useLatestVersion": {
            "type": "boolean"
          }
        },
        "additionalProperties": false
      },
      "UserDto": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "format": "int32"
          },
          "name": {
            "type": "string",
            "nullable": true
          },
          "email": {
            "type": "string",
            "nullable": true
          },
          "role": {
            "type": "string",
            "nullable": true
          },
          "createdAt": {
            "type": "string",
            "format": "date-time"
          }
        },
        "additionalProperties": false
      }
    },
    "securitySchemes": {
      "Bearer": {
        "type": "apiKey",
        "description": "JWT Authorization header usando o esquema Bearer. Exemplo: \"Authorization: Bearer {token}\"",
        "name": "Authorization",
        "in": "header"
      }
    }
  },
  "security": [
    {
      "Bearer": [ ]
    }
  ]
}