// validaciones/detalleFacturaValidation.js
const Joi = require('@hapi/joi');

const detalleFacturaSchemaValidation = Joi.object({
    precioDetalleFactura: Joi.number()
        .required()
        .messages({
            'number.base': 'El precio del detalle de factura debe ser un número',
            'any.required': 'El precio del detalle de factura es un campo requerido'
        }),
    cantidadDetalleFactura: Joi.number()
        .integer()
        .required()
        .messages({
            'number.base': 'La cantidad del detalle de factura debe ser un número',
            'number.integer': 'La cantidad del detalle de factura debe ser un entero',
            'any.required': 'La cantidad del detalle de factura es un campo requerido'
        }),
    idinventario_id: Joi.number().integer().optional()
        .messages({
            'number.base': 'El ID de inventario debe ser un número entero'
        }),
    idproducto_id: Joi.number().integer().optional()
        .messages({
            'number.base': 'El ID de producto debe ser un número entero'
        }),
    idfactura_id: Joi.number().integer().optional()
        .messages({
            'number.base': 'El ID de factura debe ser un número entero'
        })
});

// Exportar la validación
module.exports = { detalleFacturaSchemaValidation };