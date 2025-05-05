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
        companiaId: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de la compañía debe ser un número',
            'number.integer': 'El ID de la compañía debe ser un número entero',
            'number.positive': 'El ID de la compañía debe ser un número positivo'
        }),
    
});

// Exportar la validación
module.exports = { empleadoSchemaValidation };
