const Joi = require('@hapi/joi');

const empleadoSchemaValidation = Joi.object({
    dniEmpleado: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El DNI del empleado debe ser un número',
            'number.integer': 'El DNI del empleado debe ser un número entero',
            'any.required': 'El DNI del empleado es un campo requerido'
        }),
    telefonoEmpleado: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'El teléfono del empleado debe ser un número',
            'number.integer': 'El teléfono del empleado debe ser un número entero',
            'any.required': 'El teléfono del empleado es un campo requerido'
        }),
    nombreEmpleado: Joi.string()
        .required()
        .messages({
            'string.base': 'El nombre del empleado debe ser un texto',
            'any.required': 'El nombre del empleado es un campo requerido'
        }),
  compania_id:  Joi.number().integer().required()
        .messages({
          'any.required': 'El idProducto es obligatorio',
          'number.base': 'El idProducto debe ser un número entero'
        }),
    
});

// Exportar la validación
module.exports = { empleadoSchemaValidation };
