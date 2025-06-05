// validaciones/facturaValidation.js
const Joi = require('@hapi/joi');

const facturaSchemaValidation = Joi.object({

    fechaCreacionFactura: Joi.string()
        .required()
        .messages({
            'date.base': 'La fecha de creación de la factura debe ser una fecha válida',
            'any.required': 'La fecha de creación de la factura es un campo requerido'
        }),
        horaCreacionFactura: Joi.string()
        .pattern(/^([01]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\s?(a\.?m\.?|p\.?m\.?)?$/) // Acepta AM/PM
        .required()
        .messages({
            'string.base': 'La hora de creación de la factura debe ser un texto',
            'string.pattern.base': 'La hora de creación de la factura debe estar en formato HH:MM:SS (con AM/PM opcional)',
            'any.required': 'La hora de creación de la factura es un campo requerido'
        }),    
    pedido: Joi.array()
    .items(Joi.number().integer().min(1))
    .optional()
    .messages({
        'array.base': 'Los pedido deben ser un arreglo',
        'number.base': 'El ID del pedido debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.min': 'El ID debe ser mayor a 0'
    }),
    cliente: Joi.array()
    .items(Joi.number().integer().min(1))
    .optional()
    .messages({
        'array.base': 'Los CLIENTES deben ser un arreglo',
        'number.base': 'El ID del CLIENTES debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.min': 'El ID debe ser mayor a 0'
    }),
    detallesFactura:Joi.array()
    .items(Joi.number().integer().min(1))
    .optional()
    .messages({
        'array.base': 'Los detallesFactura deben ser un arreglo',
        'number.base': 'El ID del detallesFactura debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.min': 'El ID debe ser mayor a 0'
    }),
    metodoPago:Joi.array()
    .items(Joi.number().integer().min(1))
    .optional()
    .messages({
        'array.base': 'Los metodoPago deben ser un arreglo',
        'number.base': 'El ID del metodoPago debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.min': 'El ID debe ser mayor a 0'
    }),
});

// Exportar la validación
module.exports = { facturaSchemaValidation };