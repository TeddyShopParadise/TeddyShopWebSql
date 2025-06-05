    const Joi = require('@hapi/joi');

    const pedidoSchemaValidation = Joi.object({
        nombreComprador: Joi.string()
            .optional()
            .messages({
                'string.base': 'El nombre del comprador debe ser un texto',
                'any.required': 'El nombre del comprador es un campo requerido'
            }),
        numeroComprador: Joi.string()
            .optional()
            .messages({
                'string.base': 'El número del comprador debe ser un texto',
                'any.required': 'El número del comprador es un campo requerido'
            }),
        nombreAgendador: Joi.string()
            .optional()
            .messages({
                'string.base': 'El nombre del agendador debe ser un texto',
                'any.required': 'El nombre del agendador es un campo requerido'
            }),
        numeroAgendador: Joi.string()
            .optional()
            .messages({
                'string.base': 'El número del agendador debe ser un texto',
                'any.required': 'El número del agendador es un campo requerido'
            }),
        localidad: Joi.string()
            .optional()
            .messages({
                'string.base': 'La localidad debe ser un texto',
                'any.required': 'La localidad es un campo requerido'
            }),
        direccion: Joi.string()
            .optional()
            .messages({
                'string.base': 'La dirección debe ser un texto',
                'any.required': 'La dirección es un campo requerido'
            }),
        barrio: Joi.string()
            .optional()
            .messages({
                'string.base': 'El barrio debe ser un texto',
                'any.required': 'El barrio es un campo requerido'
            }),
    cliente_id: Joi.number()
    .integer()
    .min(0)  // Permitir que el valor sea 0 (o cualquier valor mayor)
    .optional()
    .messages({
        'number.base': 'El ID del CLIENTE debe ser un número',
        'number.integer': 'El ID debe ser un número entero',
        'number.min': 'El ID debe ser mayor a 0'
    }),



        detallesPedido: Joi.array()
            .items(Joi.number().integer().min(1))
            .optional()
            .messages({
                'array.base': 'Los detalles del pedido deben ser un arreglo',
                'number.base': 'El ID del detalle del pedido debe ser un número',
                'number.integer': 'El ID debe ser un número entero',
                'number.min': 'El ID debe ser mayor a 0'
            }),
        facturas: Joi.array()
            .items(Joi.number().integer().min(1))
            .optional()
            .messages({
                'array.base': 'Las facturas deben ser un arreglo',
                'number.base': 'El ID de la factura debe ser un número',
                'number.integer': 'El ID debe ser un número entero',
                'number.min': 'El ID debe ser mayor a 0'
            }),
    });

    module.exports = { pedidoSchemaValidation };
