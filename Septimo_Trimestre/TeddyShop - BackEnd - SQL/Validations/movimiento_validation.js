// validaciones/movimientoValidation.js
const Joi = require('@hapi/joi');

const movimientoSchemaValidation = Joi.object({
    fecha: Joi.date()
        .required()
        .messages({
            'date.base': 'La fecha debe ser un valor válido',
            'any.required': 'La fecha es un campo requerido'
        }),
    cantidadIngreso: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'La cantidad de ingreso debe ser un número entero',
            'number.integer': 'La cantidad de ingreso debe ser un número entero',
            'any.required': 'La cantidad de ingreso es un campo requerido'
        }),
    cantidadVendida: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'La cantidad vendida debe ser un número entero',
            'number.integer': 'La cantidad vendida debe ser un número entero',
            'any.required': 'La cantidad vendida es un campo requerido'
        }),
    inventario_id: Joi.number().integer().required()
    .messages({
      'any.required': 'El idProducto es obligatorio',
      'number.base': 'El idProducto debe ser un número entero'
    }),
});

// Exportar la validación
module.exports = { movimientoSchemaValidation };
