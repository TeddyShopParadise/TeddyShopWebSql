// Validations/detallePedido_validation.js
const Joi = require('joi');

// Schema de validación para detalle de pedido
const detallePedidoSchemaValidation = Joi.object({
  // Aceptar ambos nombres de campo para mayor flexibilidad
  idPedido: Joi.number().integer().required()
    .messages({
      'any.required': 'El idPedido es obligatorio',
      'number.base': 'El idPedido debe ser un número entero'
    }),
  
  // Permitir ambos nombres de campo para el producto
  idproducto_id: Joi.number().integer().required()
    .messages({
      'any.required': 'El idProducto es obligatorio',
      'number.base': 'El idProducto debe ser un número entero'
    }),
  
  precioDetallePedido: Joi.number().precision(2).required()
    .messages({
      'any.required': 'El precioDetallePedido es obligatorio',
      'number.base': 'El precioDetallePedido debe ser un número'
    }),
    
  cantidadDetallePedido: Joi.number().integer().required()
    .messages({
      'any.required': 'La cantidadDetallePedido es obligatoria',
      'number.base': 'La cantidadDetallePedido debe ser un número entero'
    })
});

module.exports = { detallePedidoSchemaValidation };