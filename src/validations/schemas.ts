import Joi from 'joi';

export const colaboradorSchema = Joi.object({
  nome: Joi.string().required().min(3).max(100),
  email: Joi.string().email().required(),
  cpf: Joi.string().pattern(/^\d{11}$/).required().messages({
    'string.pattern.base': 'CPF deve conter 11 dígitos numéricos'
  }),
  dataNascimento: Joi.date().max('now').required(),
  cargo: Joi.string().required(),
  departamento: Joi.string().required()
});

export const tipoDocumentoSchema = Joi.object({
  nome: Joi.string().required().min(2).max(50),
  descricao: Joi.string().max(200),
  obrigatorio: Joi.boolean().default(true)
});

export const documentoShema = Joi.object({
  colaboradorId: Joi.string().uuid().required(),
  tipoDocumentoId: Joi.string().uuid().required(),
  arquivoNome: Joi.string().required(),
  arquivoTamanho: Joi.number().positive().max(10485760).required(), // 10MB max
  mimeType: Joi.string().valid('application/pdf', 'image/jpeg', 'image/png').required(),
  observacao: Joi.string().max(500).optional()
});