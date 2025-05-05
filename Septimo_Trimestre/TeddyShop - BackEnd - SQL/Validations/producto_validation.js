const Joi = require('@hapi/joi');

const productoSchemaValidation = Joi.object({
    estiloProducto: Joi.string()
        .required()
        .messages({
            'string.base': 'El estilo del producto debe ser un texto',
            'any.required': 'El estilo del producto es un campo requerido'
        }),
    disponibilidadProducto: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'La disponibilidad debe ser un número entero',
            'number.integer': 'La disponibilidad debe ser un número entero',
            'number.min': 'La disponibilidad no puede ser menor a 0',
            'any.required': 'La disponibilidad es un campo requerido'
        }),
    tamañoProducto: Joi.string()
        .required()
        .messages({
            'string.base': 'El tamaño del producto debe ser un texto',
            'any.required': 'El tamaño del producto es un campo requerido'
        }),
    imagen: Joi.string()
        .uri()
        .optional()
        .allow('')
        .messages({
            'string.base': 'La imagen debe ser una cadena de texto',
            'string.uri': 'La imagen debe tener una URL válida'
        }),
    historialPrecios: Joi.array()
        .items(Joi.number().integer().min(1))
        .optional()
        .messages({
            'array.base': 'El historial de precios debe ser un arreglo',
            'number.base': 'El ID del historial debe ser un número',
            'number.integer': 'El ID debe ser un número entero',
            'number.min': 'El ID debe ser mayor a 0'
        }),
    catalogos: Joi.array()
        .items(Joi.number().integer().min(1))
        .optional()
        .messages({
            'array.base': 'Los catálogos deben ser un arreglo',
            'number.base': 'El ID del catálogo debe ser un número',
            'number.integer': 'El ID debe ser un número entero',
            'number.min': 'El ID debe ser mayor a 0'
        }),
    categorias: Joi.array()
        .items(Joi.number().integer().min(1))
        .optional()
        .messages({
            'array.base': 'Las categorías deben ser un arreglo',
            'number.base': 'El ID de la categoría debe ser un número',
            'number.integer': 'El ID debe ser un número entero',
            'number.min': 'El ID debe ser mayor a 0'
        })
});

module.exports = { productoSchemaValidation };
