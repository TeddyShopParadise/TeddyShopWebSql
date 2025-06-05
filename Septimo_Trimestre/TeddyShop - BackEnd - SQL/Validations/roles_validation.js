// validaciones/rolesValidation.js
const Joi = require('@hapi/joi');

const rolesSchemaValidation = Joi.object({
  estado: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'El estado debe ser un valor booleano (true o false)',
      'any.required': 'El estado es un campo requerido'
    }),
  nombre: Joi.string()
    .required()
    .min(1) 
    .max(255) 
    .messages({
      'string.base': 'El nombre debe ser un texto',
      'any.required': 'El nombre es un campo requerido',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 1 caracter',
      'string.max': 'El nombre debe tener un máximo de 255 caracteres'
    })
});

// Exportar la validación
module.exports = { rolesSchemaValidation };
