// controllers/metodoPagoController.js

const db = require('../modelsSQL'); // Asegúrate de tener este index que exporta todos los modelos
const MetodoPago = db.MetodoPago;

// Crear un nuevo método de pago
async function crearMetodoPago(body) {
  const metodoPago = await MetodoPago.create({
    nombremetodopago: body.nombremetodopago
  });

  return buscarMetodoPagoPorId(metodoPago.id);
}

// Actualizar un método de pago
async function actualizarMetodoPago(id, body) {
  const metodoPago = await MetodoPago.findByPk(id);
  if (!metodoPago) throw new Error(`Método de pago con ID ${id} no encontrado`);

  await metodoPago.update({
    nombremetodopago: body.nombremetodopago
  });

  return buscarMetodoPagoPorId(id);
}

// Listar todos los métodos de pago
async function listarMetodosPago() {
  const metodosPago = await MetodoPago.findAll({
    order: [['id', 'DESC']]
  });
  return metodosPago;
}

// Buscar un método de pago por su ID
async function buscarMetodoPagoPorId(id) {
  const metodoPago = await MetodoPago.findByPk(id);
  if (!metodoPago) throw new Error(`Método de pago con ID ${id} no encontrado`);
  return metodoPago;
}

// Eliminar un método de pago por su ID
async function eliminarMetodoPago(id) {
  const metodoPago = await MetodoPago.findByPk(id);
  if (!metodoPago) throw new Error(`Método de pago con ID ${id} no encontrado`);

  await metodoPago.destroy();
  return metodoPago;
}

module.exports = {
  crearMetodoPago,
  actualizarMetodoPago,
  listarMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago
};
